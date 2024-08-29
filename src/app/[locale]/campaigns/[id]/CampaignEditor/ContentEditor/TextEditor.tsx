"use client";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/MyMDXEditor";
import ImageManager from "@/lib/ImageManager";

export default function TextEditor({ field, oldValue, campaignId }: Props) {
  const t = useTranslations("TextEditor");
  const imageManager = new ImageManager();

  return (
    <MyMDXEditor
      markdown={field.value ?? ""}
      oldMarkdown={oldValue}
      onChange={(value) => field.onChange(value)}
      imageUploadHandler={
        campaignId
          ? async (image: File) => {
              return imageManager
                .uploadImage(image, campaignId)
                .then((url) => url)
                .catch((e) => {
                  toast({
                    title: t("uploadFailed"),
                    description: t("uploadFailedDescription"),
                    variant: "destructive",
                  });
                  throw new Error("Failed to upload image");
                });
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
