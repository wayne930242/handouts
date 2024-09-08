"use client";
import { useTranslations } from "next-intl";

import ImageManager, { ImageTableKey } from "@/lib/ImageManager";
import useAppStore from "@/lib/store/useAppStore";

import { toast } from "@/components/ui/use-toast";
import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/form/MyMDXEditor";

export default function TextEditor({
  field,
  oldValue,
  imageTableId,
  imageTableKey,
  handoutId,
}: Props) {
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
        imageTableId && imageTableKey
          ? async (image: File) => {
              setIsLoading(true);
              return imageManager
                .uploadImage(
                  image,
                  imageTableKey,
                  imageTableId,
                  "handouts",
                  handoutId
                )
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
  handoutId: string;
  imageTableKey?: ImageTableKey;
  imageTableId?: string;
  oldValue?: string;
}
