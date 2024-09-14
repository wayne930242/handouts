import {
  Campaign,
  MySupabaseClient,
  Chapter,
  Section,
  Handout,
} from "@/types/interfaces";
import { extractImageUrlsFromMarkdown } from "../markdown";
import ImageManager, { ImageKeyPrefix } from "../s3/ImageManager";

export default class CampaignImporter {
  private supabase: MySupabaseClient;
  private campaignData: Campaign;
  private imageManager: ImageManager;
  private gameId?: string;

  constructor(supabase: MySupabaseClient, campaignData: Campaign, gameId?: string) {
    this.supabase = supabase;
    this.imageManager = new ImageManager();
    this.campaignData = campaignData;
  }

  async importCampaign() {
    try {
      const { data: newCampaign, error: campaignError } = await this.supabase
        .from("campaigns")
        .insert({
          name: this.campaignData.name,
          description: this.campaignData.description,
          gm_id: this.campaignData.gm_id,
          status: this.campaignData.status,
        })
        .select()
        .single();
      if (!newCampaign || campaignError) throw campaignError;

      const key: ImageKeyPrefix = this.gameId
        ? `games/${this.gameId}/campaigns/${newCampaign.id}/images`
        : `campaigns/${newCampaign.id}/images`;

      if (this.campaignData.banner_url) {
        const newUrl = await this.imageManager.uploadByUrl(
          this.campaignData.banner_url,
          key
        );
        await this.supabase
          .from("campaigns")
          .update({
            banner_url: newUrl,
          })
          .eq("id", newCampaign.id);
      }

      if (this.gameId) {
        const { data } = await this.supabase
          .from("games")
          .select(
            `
            campaigns(
              id,
              banner_url
            )
          `
          )
          .eq("id", this.gameId)
          .single();
        const oldCampaign = data?.campaigns;
        if (oldCampaign) {
          await this.supabase
            .from("campaigns")
            .delete()
            .eq("id", oldCampaign.id);
        }
        if (oldCampaign?.banner_url) {
          this.imageManager.deleteImageByUrl(oldCampaign.banner_url);
        }
        await this.supabase
          .from("games")
          .update({
            campaign_id: newCampaign.id,
          })
          .eq("id", this.gameId);
      }

      for (const chapter of this.campaignData.chapters) {
        await this.createChapter(newCampaign.id, chapter);
      }

      return newCampaign;
    } catch (error) {
      console.error("Error importing campaign:", error);
      throw error;
    }
  }

  private async createChapter(newCampaignId: string, chapter: Chapter) {
    const { data: newChapter, error: chapterError } = await this.supabase
      .from("chapters")
      .insert({
        campaign_id: newCampaignId,
        title: chapter.title,
        order_num: chapter.order_num,
      })
      .select()
      .single();

    if (chapterError) throw chapterError;

    for (const section of chapter.sections) {
      await this.createSection(newCampaignId, newChapter.id, section);
    }
  }

  private async createSection(
    newCampaignId: string,
    newChapterId: number,
    section: Section
  ) {
    const { data: newSection, error: sectionError } = await this.supabase
      .from("sections")
      .insert({
        campaign_id: newCampaignId,
        chapter_id: newChapterId,
        title: section.title,
        order_num: section.order_num,
      })
      .select()
      .single();

    if (sectionError) throw sectionError;

    for (const handout of section.handouts) {
      await this.createHandout(newCampaignId, newSection.id, handout);
    }
  }

  private async createHandout(
    newCampaignId: string,
    newSectionId: number,
    handout: Handout
  ) {
    let content = handout.content;

    const imageUrls = extractImageUrlsFromMarkdown(content);

    for (const url of imageUrls) {
      if (content === null)
        throw new Error("Content is null, but it has image urls?");
      const newUrl = await this.imageManager.uploadByUrl(
        url,
        `games/${newCampaignId}/handouts/${newSectionId}/images`
      );
      content = content?.replace(url, newUrl) ?? null;
    }

    const { error: handoutError } = await this.supabase
      .from("handouts")
      .insert({
        campaign_id: newCampaignId,
        section_id: newSectionId,
        title: handout.title,
        content: content,
        is_public: false,
        type: handout.type,
        owner_id: handout.owner_id,
        note: handout.note,
        order_num: handout.order_num,
      });

    if (handoutError) throw handoutError;
  }
}
