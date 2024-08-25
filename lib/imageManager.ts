import { Image } from "@/types/interfaces";
import { SupabaseClient } from "@supabase/supabase-js";

/**
 * Manages image uploads, retrievals, and deletions using Supabase.
 * @class
 * @param {SupabaseClient} supabase - The Supabase client instance.
 * @param {string} [bucketName="images"] - The name of the storage bucket to use.
 * @example
 * const supabase = createClient();
 * const imageManager = new ImageManager(supabase, "another-bucket-name");
 */
export default class ImageManager {
  private supabase: SupabaseClient;
  private bucketName: string;

  constructor(supabase: SupabaseClient, bucketName: string = "images") {
    this.supabase = supabase;
    this.bucketName = bucketName;
  }

  /**
   * Uploads an image file and creates an associated record.
   * @param {File} file - The image file to upload.
   * @param {number|string} relatedId - The ID of the related entity.
   * @param {string} relatedTable - The name of the related table.
   * @param {string} imageType - The type of image being uploaded.
   * @param {string} [description=""] - An optional description of the image.
   * @returns {Promise<Image>} The created image record.
   * @throws {Error} If the upload fails or related entity doesn't exist.
   * @example
   * const file = new File([''], 'filename.jpg', { type: 'image/jpeg' });
   * const imageRecord = await imageManager.uploadImage(file, 123, 'products', 'main', 'Product main image');
   * console.log(imageRecord);
   */
  async uploadImage(
    file: File,
    relatedId: number | string,
    relatedTable: string,
    imageType: string,
    description: string = ""
  ): Promise<Image> {
    if (!relatedId || !relatedTable) {
      throw new Error("Related ID and table must be provided");
    }

    await this.checkEntityExists(relatedTable, relatedId);

    const filePath = this.generateFilePath(relatedTable, relatedId, file.name);
    const { data, error } = await this.uploadFileToStorage(file, filePath);

    if (error) throw error;

    const publicURL = await this.getPublicUrl(filePath);

    const imageRecord = await this.createImageRecord({
      relatedId,
      relatedTable,
      publicURL,
      imageType,
      description,
      file,
    });

    return imageRecord;
  }

  /**
   * Retrieves images associated with a specific entity.
   * @param {number|string} relatedId - The ID of the related entity.
   * @param {string} relatedTable - The name of the related table.
   * @param {string} [imageType] - Optional filter for image type.
   * @returns {Promise<Image[]>} An array of image records.
   * @throws {Error} If the query fails.
   * @example
   * const images = await imageManager.getImages(123, 'products', 'thumbnail');
   * images.forEach(img => console.log(img.image_url));
   */
  async getImages(
    relatedId: number | string,
    relatedTable: string,
    imageType?: string
  ): Promise<Image[]> {
    let query = this.supabase
      .from("images")
      .select("*")
      .eq("related_id", relatedId)
      .eq("related_table", relatedTable);

    if (imageType) {
      query = query.eq("image_type", imageType);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data as Image[];
  }

  /**
   * Deletes an image and its associated record.
   * @param {number} imageId - The ID of the image to delete.
   * @returns {Promise<{ success: boolean; message: string }>} The result of the deletion operation.
   * @throws {Error} If the deletion fails.
   * @example
   * const result = await imageManager.deleteImage(456);
   * if (result.success) {
   *   console.log(result.message);
   * }
   */
  async deleteImage(
    imageId: number
  ): Promise<{ success: boolean; message: string }> {
    const imageRecord = await this.getImageRecord(imageId);
    await this.deleteFileFromStorage(imageRecord.image_url);
    await this.deleteImageRecord(imageId);

    return { success: true, message: "Image deleted successfully" };
  }

  // Private methods

  private async checkEntityExists(
    table: string,
    id: number | string
  ): Promise<void> {
    const { data: entityExists, error: entityError } = await this.supabase
      .from(table)
      .select("id")
      .eq("id", id)
      .single();

    if (entityError || !entityExists) {
      throw new Error(`No ${table} found with id ${id}`);
    }
  }

  private generateFilePath(
    relatedTable: string,
    relatedId: number | string,
    fileName: string
  ): string {
    return `${relatedTable}/${relatedId}/${Date.now()}_${fileName}`;
  }

  private async uploadFileToStorage(file: File, filePath: string) {
    return await this.supabase.storage
      .from(this.bucketName)
      .upload(filePath, file);
  }

  private async getPublicUrl(filePath: string): Promise<string> {
    const {
      data: { publicUrl },
    } = this.supabase.storage.from(this.bucketName).getPublicUrl(filePath);

    if (!publicUrl) throw new Error("Failed to get public URL");
    return publicUrl;
  }

  private async createImageRecord(params: {
    relatedId: number | string;
    relatedTable: string;
    publicURL: string;
    imageType: string;
    description: string;
    file: File;
  }): Promise<Image> {
    const { data: imageRecord, error: insertError } = await this.supabase
      .from("images")
      .insert({
        related_id: params.relatedId,
        related_table: params.relatedTable,
        image_url: params.publicURL,
        image_type: params.imageType,
        description: params.description,
        metadata: {
          fileName: params.file.name,
          contentType: params.file.type,
          size: params.file.size,
        },
      })
      .single();

    if (insertError || !imageRecord) throw insertError;
    return imageRecord as Image;
  }

  private async getImageRecord(imageId: number): Promise<Image> {
    const { data: imageRecord, error: fetchError } = await this.supabase
      .from("images")
      .select("*")
      .eq("id", imageId)
      .single();

    if (fetchError || !imageRecord) throw fetchError;
    return imageRecord as Image;
  }

  private async deleteFileFromStorage(imageUrl: string): Promise<void> {
    const filePath = imageUrl.split("/").slice(-3).join("/");
    const { error: deleteError } = await this.supabase.storage
      .from(this.bucketName)
      .remove([filePath]);

    if (deleteError) throw deleteError;
  }

  private async deleteImageRecord(imageId: number): Promise<void> {
    const { error: removeError } = await this.supabase
      .from("images")
      .delete()
      .eq("id", imageId);

    if (removeError) throw removeError;
  }
}
