"use client";

import { toast } from "@/components/ui/use-toast";
import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/MyMDXEditor";
import useIsWhitelisted from "@/lib/hooks/useIsWhitelisted";
import { createClient } from "@/lib/supabase/client";
import ImageManager from "@/lib/supabase/ImageMamager";

export default function TextEditor({ field, oldValue, campaignId }: Props) {
  const isWhitelisted = useIsWhitelisted();
  const supabase = createClient();
  const imageManager = new ImageManager(supabase);

  return (
    <MyMDXEditor
      markdown={field.value ?? ""}
      oldMarkdown={oldValue}
      onChange={(value) => field.onChange(value)}
      imageUploadHandler={
        campaignId && isWhitelisted
          ? (image: File) => {
              try {
                const url = imageManager.uploadImage(image, campaignId);
                return Promise.resolve(url);
              } catch (error) {
                toast({
                  title: "上傳失敗",
                  description: "圖片上傳失敗，請稍後再試。",
                  variant: "destructive",
                });
                return Promise.reject(error);
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
