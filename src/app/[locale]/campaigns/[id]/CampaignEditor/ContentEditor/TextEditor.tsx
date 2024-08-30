"use client";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/use-toast";
import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/MyMDXEditor";
import ImageManager from "@/lib/ImageManager";
import useAppStore from "@/lib/store/useAppStore";

export default function TextEditor({ field, oldValue, campaignId }: Props) {
  const { setIsLoading } = useAppStore((state) => ({
    setIsLoading: state.setIsLoading,
  }));

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
              setIsLoading(true);
              return imageManager
                .uploadImage(image, "campaigns", campaignId)
                .then((url) => url)
                .catch((e) => {
                  toast({
                    title: t("uploadFailed"),
                    description: t("uploadFailedDescription"),
                    variant: "destructive",
                  });
                  throw new Error("Failed to upload image");
                })
                .finally(() => setIsLoading(false));
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
