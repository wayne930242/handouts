"use client";

import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/MyMDXEditor";

export default function TextEditor({ field, oldValue }: Props) {
  return (
    <MyMDXEditor
      markdown={field.value ?? ""}
      oldMarkdown={oldValue}
      onChange={(value) => field.onChange(value)}
    />
  );
}

interface Props {
  field: ContentFieldProps;
  oldValue?: string;
}
