import { Campaign, MySupabaseClient, Handout } from "@/types/interfaces";
import { extractImageUrlsFromMarkdown } from "../markdown";
import ImageManager, { ImageKeyPrefix } from "../s3/ImageManager";

export default class CampaignImporter {
  private supabase: MySupabaseClient;
  private campaignData: Campaign;
  private imageManager: ImageManager;
  private gameId?: string;

  constructor(
    supabase: MySupabaseClient,
    campaignData: Campaign,
    gameId?: string
  ) {
    this.supabase = supabase;
    this.campaignData = campaignData;
    this.gameId = gameId;
    this.imageManager = new ImageManager();
  }

  async importCampaign() {
    const { data: newCampaign, error } = await this.supabase.rpc(
      "import_campaign",
      {
        p_campaign_data: this.campaignData,
        p_game_id: this.gameId,
      }
    );

    if (error) throw error;

    await this.handleImages(newCampaign as Campaign);

    return newCampaign as Campaign;
  }

  private async handleImages(newCampaign: Campaign) {
    const imagePromises: Promise<void>[] = [];

    if (this.campaignData.banner_url) {
      imagePromises.push(this.updateCampaignBanner(newCampaign.id));
    }

    for (const chapter of newCampaign.chapters) {
      for (const section of chapter.sections) {
        for (const handout of section.handouts) {
          if (handout.content) {
            imagePromises.push(
              this.updateHandoutImages(newCampaign.id, section.id, handout)
            );
          }
        }
      }
    }

    await Promise.all(imagePromises);
  }

  private async updateCampaignBanner(campaignId: string) {
    const key: ImageKeyPrefix = this.gameId
      ? `games/${this.gameId}/campaigns/${campaignId}/images`
      : `campaigns/${campaignId}/images`;

    const newUrl = await this.imageManager.uploadByUrl(
      this.campaignData.banner_url!,
      key
    );

    await this.supabase
      .from("campaigns")
      .update({ banner_url: newUrl })
      .eq("id", campaignId);
  }

  private async updateHandoutImages(
    campaignId: string,
    sectionId: number,
    handout: Handout
  ) {
    const imageUrls = extractImageUrlsFromMarkdown(handout.content!);
    let updatedContent = handout.content;

    for (const url of imageUrls) {
      const key: ImageKeyPrefix = this.gameId
        ? `games/${this.gameId}/campaigns/${campaignId}/handouts/${sectionId}/images`
        : `campaigns/${campaignId}/handouts/${sectionId}/images`;

      const newUrl = await this.imageManager.uploadByUrl(url, key);
      updatedContent = updatedContent!.replace(url, newUrl);
    }

    await this.supabase
      .from("handouts")
      .update({ content: updatedContent })
      .eq("id", handout.id);
  }
}
