import { blobToWebP } from "webp-converter-browser";
import imageCompression, { Options } from "browser-image-compression";
import ky from "ky";

const defaultOptions: Options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg",
};

type Fields = any;
export type ImageTableKey = "campaigns" | "docs" | "profile";

export default class ImageManager {
  private options: Options;
  private baseUrl: string;

  constructor(options: Options = defaultOptions) {
    this.options = { ...defaultOptions, ...options };
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  }

  async uploadImage(
    file: File,
    tableKey: ImageTableKey,
    id: string
  ): Promise<string> {
    const compressedImage = await this.compressImage(file);
    const key = `${tableKey}/${id}/images/${Date.now()}.webp`;
    const objectUrl = await this.uploadToS3(compressedImage, key);
    return objectUrl;
  }

  async cleanImages(
    tableKey: ImageTableKey,
    id: string,
    content: string | undefined,
    exUrls?: string[]
  ): Promise<string[]> {
    const keepUrls = this.prepareKeepUrls(content, exUrls);
    await ky.post(`${this.baseUrl}/api/clean-images`, {
      json: { urlsToKeep: keepUrls, tableKey, id },
    });
    return keepUrls;
  }

  private prepareKeepUrls(
    content: string | undefined,
    exUrls?: string[]
  ): string[] {
    const extractImageUrlsFromMarkdown = (
      markdown: string | undefined
    ): string[] => {
      if (!markdown) return [];
      const regex = /!\[.*?\]\((.*?)\)/g;
      const matches = markdown.matchAll(regex);

      return Array.from(matches, (match) => match[1]);
    };

    const contentUrls = extractImageUrlsFromMarkdown(content);
    return Array.from(new Set([...contentUrls, ...(exUrls ?? [])]));
  }

  private async compressImage(file: File): Promise<Blob> {
    const compressedImage = this.options
      ? await imageCompression(file, this.options)
      : file;
    return blobToWebP(compressedImage);
  }

  async deleteImagesByKeyAndId(
    tableKey: ImageTableKey,
    id: string
  ): Promise<void> {
    try {
      await ky.post(`${this.baseUrl}/api/delete-images`, {
        json: { id, tableKey },
      });
    } catch (error) {
      console.error("Delete failed:", error);
      throw new Error("Failed to delete images from S3");
    }
  }

  async deleteImageByUrl(url: string): Promise<void> {
    try {
      await ky.post(`${this.baseUrl}/api/delete-image`, {
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
