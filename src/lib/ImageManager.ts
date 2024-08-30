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
type ImageTableKey = "campaigns" | "rules";

export default class ImageManager {
  private options: Options;
  private baseUrl: string;

  constructor(options: Options = defaultOptions) {
    this.options = options;
    this.baseUrl = process.env.NEXT_PUBLIC_BASE_URL!;
  }

  async uploadImage(file: File, tableKey: ImageTableKey, id: string): Promise<string> {
    const compressedImage = await this.compressImage(file);
    const key = `${tableKey}/${id}/images/${Date.now()}.webp`;
    const objectUrl = await this.uploadToS3(compressedImage, key);
    return objectUrl;
  }

  private async compressImage(file: File): Promise<Blob> {
    const compressedImage = this.options
      ? await imageCompression(file, this.options)
      : file;
    return blobToWebP(compressedImage);
  }

  async deleteImagesByCampaignId(tableKey: ImageTableKey, id: string): Promise<void> {
    try {
      await ky.post(`${this.baseUrl}/api/delete-images`, {
        json: { id, tableKey },
      });
    } catch (error) {
      console.error("Delete failed:", error);
      throw new Error("Failed to delete images from S3");
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
