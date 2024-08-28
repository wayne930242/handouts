import { SupabaseClient } from "@supabase/supabase-js";
import { blobToWebP } from "webp-converter-browser";
import imageCompression, { Options } from "browser-image-compression";
import { createS3Client } from "./s3/client";
import {
  PutObjectCommand,
  ListObjectsV2Command,
  DeleteObjectsCommand,
} from "@aws-sdk/client-s3";

const defaultOptions: Options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg",
};

export default class ImageManager {
  private supabase: SupabaseClient;
  private options: Options;

  constructor(supabase: SupabaseClient, options: Options = defaultOptions) {
    this.supabase = supabase;
    this.options = options;
  }

  async uploadImage(file: File, campaignId: string): Promise<string | null> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();
    if (!session) return null;

    const s3Client = createS3Client(session.access_token);
    const compressedImage = await this.compressImage(file);
    const key = `${campaignId}/images/${Date.now()}.webp`;

    const params = {
      Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
      Key: key,
      Body: compressedImage,
      ACL: "public-read" as const,
    };

    try {
      const command = new PutObjectCommand(params);
      await s3Client.send(command);
      return `https://${process.env.NEXT_PUBLIC_S3_BUCKET}.s3.${process.env.NEXT_PUBLIC_S3_REGION}.amazonaws.com/${key}`;
    } catch (error) {
      console.error("Upload failed:", error);
      return null;
    }
  }

  async deleteImagesByCampaignId(campaignId: string): Promise<void> {
    const {
      data: { session },
    } = await this.supabase.auth.getSession();
    if (!session) return;

    const s3Client = createS3Client(session.access_token);
    const prefix = `${campaignId}/images/`;

    try {
      const listCommand = new ListObjectsV2Command({
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
        Prefix: prefix,
      });
      const { Contents } = await s3Client.send(listCommand);

      if (!Contents || Contents.length === 0) {
        console.log("No images found for deletion.");
        return;
      }

      const deleteParams = {
        Bucket: process.env.NEXT_PUBLIC_S3_BUCKET!,
        Delete: {
          Objects: Contents.map((item) => ({ Key: item.Key! })),
        },
      };

      const deleteCommand = new DeleteObjectsCommand(deleteParams);
      await s3Client.send(deleteCommand);

      console.log(
        `${Contents.length} images deleted from campaign ${campaignId}`
      );
    } catch (error) {
      console.error("Deletion failed:", error);
    }
  }

  private async compressImage(file: File): Promise<Blob> {
    const compressedImage = this.options
      ? await imageCompression(file, this.options)
      : file;
    return blobToWebP(compressedImage);
  }
}
