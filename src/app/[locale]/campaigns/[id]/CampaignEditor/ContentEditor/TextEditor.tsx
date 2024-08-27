"use client";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/MyMDXEditor";
import { createClient } from "@/lib/supabase/client";
import ImageManager from "@/lib/supabase/ImageMamager";
import imageCompression from "browser-image-compression";

const options = {
  maxSizeMB: 1,
  maxWidthOrHeight: 1920,
  useWebWorker: true,
  fileType: "image/jpeg",
  quality: 0.8,
};

export default function TextEditor({ field, oldValue, campaignId }: Props) {
  const t = useTranslations("TextEditor");
  const supabase = createClient();
  const imageManager = new ImageManager(supabase);

  return (
    <MyMDXEditor
      markdown={field.value ?? ""}
      oldMarkdown={oldValue}
      onChange={(value) => field.onChange(value)}
      imageUploadHandler={
        campaignId
          ? async (image: File) => {
              try {
                const compressedImage = await imageCompression(image, options);
                const url = imageManager.uploadImage(
                  compressedImage,
                  campaignId
                );
                return url;
              } catch (error) {
                toast({
                  title: t("uploadFailed"),
                  description: t("uploadFailedDescription"),
                  variant: "destructive",
                });
                throw error;
              }
            }
          : undefined
      }
    />
  );
}

interface Props {
  field: ContentFieldProps;
  campaignId?: string;
  oldValue?: string;
}
