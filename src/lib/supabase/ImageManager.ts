import { SupabaseClient } from "@supabase/supabase-js";
import { blobToWebP } from "webp-converter-browser";
import imageCompression, { Options } from "browser-image-compression";

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
  private options: Options;

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

    const webpImage = await blobToWebP(compressedImage);

    const { data, error } = await this.supabase.storage
      .from(this.bucketName)
      .upload(
        `campaigns/${campaign_id}/images/${Date.now()}_${file.name}`,
        webpImage
      );

    const path = data?.path;
    if (!path) throw new Error("Failed to upload image");

    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(path);

    return publicUrl;
  }

  async deleteImageByCampaignId(campaign_id: string): Promise<any> {
    const { data: list, error: listError } = await this.supabase.storage
      .from(this.bucketName)
      .list(`campaigns/${campaign_id}/images`);
    const filesToRemove = list?.map(
      (file) => `campaigns/${campaign_id}/images/${file.name}`
    );
    if (!filesToRemove || filesToRemove.length === 0) {
      return;
    }
    await this.supabase.storage.from(this.bucketName).remove(filesToRemove);
  }
}
