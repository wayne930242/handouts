import { SupabaseClient } from "@supabase/supabase-js";

export default class ImageManager {
  private supabase: SupabaseClient;
  private bucketName: string;

  constructor(supabase: SupabaseClient, bucketName: string = "images") {
    this.supabase = supabase;
    this.bucketName = bucketName;
  }

  async uploadImage(file: File, campaign_id: string): Promise<any> {
    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(
        `campaigns/${campaign_id}/images/${Date.now()}_${file.name}`,
        file
      );

    const path = data?.path;
    if (!path) throw new Error("Failed to upload image");

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(path);

    console.log("publicUrl", publicUrl);
    return publicUrl;
  }

  async deleteImageByCampaignId(campaign_id: string): Promise<any> {
    const { error: removeError } = await this.supabase.storage
      .from(this.bucketName)
      .remove([`campaigns/${campaign_id}/images`]);

    return removeError;
  }
}
