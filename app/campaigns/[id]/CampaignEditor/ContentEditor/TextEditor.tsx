"use client";

import { createClient } from "@/lib/supabase/client";
import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/MyMDXEditor";

export default function TextEditor({ field, oldValue, campaignId }: Props) {
  const supabase = createClient();

  return (
    <MyMDXEditor
      markdown={field.value ?? ""}
      oldMarkdown={oldValue}
      onChange={(value) => field.onChange(value)}
      imageUploadHandler={
        campaignId
          ? (image: File) => {
              return Promise.resolve("https://picsum.photos/200/300");
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
