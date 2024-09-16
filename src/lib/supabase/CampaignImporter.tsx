import {
  Campaign,
  MySupabaseClient,
  Handout,
} from "@/types/interfaces";
import { extractImageUrlsFromMarkdown } from "../markdown";
import ImageManager, { ImageKeyPrefix } from "../s3/ImageManager";

export default class CampaignImporter {
  private imageManager: ImageManager;

  constructor(
    private supabase: MySupabaseClient,
    private campaignData: Campaign,
    private gameId?: string
  ) {
    this.imageManager = new ImageManager();
  }

  async importCampaign(): Promise<Campaign> {
    const user = await this.getAuthenticatedUser();
    this.campaignData.gm_id = user.id;
    this.campaignData.in_game = true;

    const { data, error } = await this.supabase.rpc("import_campaign", {
      p_campaign_data: this.campaignData,
      p_game_id: this.gameId,
    });

    if (error) throw error;

    const newCampaign = data as Campaign;
    await this.handleImages(newCampaign);
    return newCampaign;
  }

  private async getAuthenticatedUser() {
    const {
      data: { user },
    } = await this.supabase.auth.getUser();
    if (!user) throw new Error("User not authenticated");
    return user;
  }

  private async handleImages(newCampaign: Campaign): Promise<void> {
    const imagePromises: Promise<void>[] = [
      this.updateCampaignBanner(newCampaign.id),
      ...this.getHandoutImagePromises(newCampaign),
    ];

    await Promise.all(imagePromises);
  }

  private getHandoutImagePromises(campaign: Campaign): Promise<void>[] {
    return campaign.chapters.flatMap((chapter, chapterIndex) =>
      chapter.sections.flatMap((section, sectionIndex) =>
        section.handouts
          .filter((handout) => handout.content)
          .map((handout, handoutIndex) =>
            this.updateHandoutImages(
              campaign.id,
              section.id,
              handout,
              chapterIndex,
              sectionIndex,
              handoutIndex
            )
          )
      )
    );
  }

  private async updateCampaignBanner(campaignId: string): Promise<void> {
    if (!this.campaignData.banner_url) return;

    const key = this.getImageKey(campaignId, "campaigns");
    const newUrl = await this.imageManager.uploadByUrl(
      this.campaignData.banner_url,
      key
    );

    await this.supabase
      .from("campaigns")
      .update({ banner_url: newUrl })
      .eq("id", campaignId);

    this.campaignData.banner_url = newUrl;
  }

  private async updateHandoutImages(
    campaignId: string,
    sectionId: number,
    handout: Handout,
    chapterIndex: number,
    sectionIndex: number,
    handoutIndex: number
  ): Promise<void> {
    const imageUrls = extractImageUrlsFromMarkdown(handout.content!);
    let updatedContent = handout.content;

    for (const url of imageUrls) {
      const key = this.getImageKey(campaignId, "handouts", sectionId);
      const newUrl = await this.imageManager.uploadByUrl(url, key);
      updatedContent = updatedContent!.replace(url, newUrl);
    }

    await this.supabase
      .from("handouts")
      .update({ content: updatedContent })
      .eq("id", handout.id);

    this.campaignData.chapters[chapterIndex].sections[sectionIndex].handouts[
      handoutIndex
    ].content = updatedContent;
  }

  private getImageKey(
    campaignId: string,
    type: "campaigns" | "handouts",
    sectionId?: number
  ): ImageKeyPrefix {
    return `${
      this.gameId ? `games/${this.gameId}/` : ""
    }campaigns/${campaignId}/${
      type === "campaigns" ? "images" : `handouts/${sectionId}/images`
    }` as ImageKeyPrefix;
  }
}
