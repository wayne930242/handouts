import { SupabaseClient } from "@supabase/supabase-js";
import imageCompression from "browser-image-compression";

const defaultOptions = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg",
  quality: 0.8,
};

export default class ImageManager {
  private supabase: SupabaseClient;
  private bucketName: string;
  private options: any;

  constructor(
    supabase: SupabaseClient,
    bucketName: string = "images",
    options: any = defaultOptions
  ) {
    this.supabase = supabase;
    this.bucketName = bucketName;
    this.options = options;
  }

  async uploadImage(file: File, campaign_id: string): Promise<any> {
    const compressedImage = this.options
      ? await imageCompression(file, this.options)
      : file;

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(
        `campaigns/${campaign_id}/images/${Date.now()}_${file.name}`,
        compressedImage
      );

    const path = data?.path;
    if (!path) throw new Error("Failed to upload image");

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(path);

    return publicUrl;
  }

  async deleteImageByCampaignId(campaign_id: string): Promise<any> {
    const { error: removeError } = await this.supabase.storage
      .from(this.bucketName)
      .remove([`campaigns/${campaign_id}/images`]);

    return removeError;
  }
}
