"use client";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/MyMDXEditor";
import { createClient } from "@/lib/supabase/client";
import ImageManager from "@/lib/ImageManager";

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
                const url = await imageManager.uploadImage(image, campaignId);
                if (!url) throw new Error("Failed to upload image");
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
