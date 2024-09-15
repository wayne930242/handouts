import { blobToWebP } from "webp-converter-browser";
import imageCompression, { Options } from "browser-image-compression";
import ky from "ky";
import { extractImageUrlsFromMarkdown } from "../markdown";

const defaultOptions: Options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg",
};

type Fields = any;

export type ImageKeyPrefix =
  | `profile/${string}/images`
  | `campaigns/${string}/images`
  | `campaigns/${string}/handouts/${string}/images`
  | `docs/${string}/images`
  | `games/${string}/images`
  | `games/${string}/campaigns/${string}/handouts/${string}/images`
  | `games/${string}/campaigns/${string}/images`
  | `games/${string}/screens/${string}/handouts/${string}/images`;
export type ImageKey = `${ImageKeyPrefix}/${string}`;

export default class ImageManager {
  private options: Options;
  private baseUrl: string;

  constructor(options: Options = defaultOptions) {
    this.options = { ...defaultOptions, ...options };
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  }

  async uploadImage(file: File, prefix: ImageKeyPrefix): Promise<string> {
    const compressedImage = await this.compressImage(file);
    const objectUrl = await this.uploadToS3(
      compressedImage,
      `${prefix}/${Date.now().toString()}.webp`
    );
    return objectUrl;
  }

  async uploadByUrl(url: string, prefix: ImageKeyPrefix): Promise<string> {
    try {
      const destinationKey = `${prefix}/${Date.now().toString()}.webp`;

      const response = await ky
        .post(`${this.baseUrl}/api/copy-image`, {
          json: { sourceUrl: url, destinationKey },
        })
        .json<{ url: string }>();

      return response.url;
    } catch (error) {
      console.error("Upload by URL failed:", error);
      throw new Error("Failed to copy image within S3");
    }
  }

  async cleanImages(
    prefix: ImageKeyPrefix,
    content: string | undefined,
    exUrls?: string[]
  ): Promise<string[]> {
    const keepUrls = this.prepareKeepUrls(content, exUrls);
    await ky.post(`${this.baseUrl}/api/clean-images`, {
      json: { urlsToKeep: keepUrls, prefix },
    });
    return keepUrls;
  }

  private prepareKeepUrls(
    content: string | undefined,
    exUrls?: string[]
  ): string[] {
    const contentUrls = extractImageUrlsFromMarkdown(content);
    return Array.from(new Set([...contentUrls, ...(exUrls ?? [])]));
  }

  private async compressImage(file: File): Promise<Blob> {
    const compressedImage = this.options
      ? await imageCompression(file, this.options)
      : file;
    return blobToWebP(compressedImage);
  }

  async deleteImagesByPrefix(prefix: ImageKeyPrefix): Promise<void> {
    try {
      await ky.post(`${this.baseUrl}/api/delete-images`, {
        json: { prefix },
      });
    } catch (error) {
      console.error("Delete failed:", error);
      throw new Error("Failed to delete images from S3");
    }
  }

  async deleteImageByUrl(url: string): Promise<void> {
    try {
      await ky.post(`${this.baseUrl}/api/delete-images`, {
        json: { url },
      });
    } catch (error) {
      console.error("Delete failed:", error);
      throw new Error("Failed to delete image from S3");
    }
  }

  private async uploadToS3(file: Blob, key: string): Promise<string> {
    try {
      const data: {
        url: string;
        fields: Fields;
      } = await ky
        .post(`${this.baseUrl}/api/upload`, {
          json: { filename: key, contentType: file.type },
        })
        .json();

      if (!data) throw new Error("Api response is empty");

      const fields = data.fields;
      const url = data.url;

      const formData = new FormData();
      Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value as string);
      });
      formData.append("file", file);

      await ky.post(url, {
        body: formData,
      });

      return `${url}${fields.key}`;
    } catch (error) {
      console.error("Upload failed:", error);
      throw new Error("Failed to upload image to S3");
    }
  }
}
