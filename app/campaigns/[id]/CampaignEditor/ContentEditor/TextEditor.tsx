"use client";

import { ContentFieldProps } from "../HandoutCard";
import MyMDXEditor from "@/components/MyMDXEditor";

export default function TextEditor({ field }: Props) {
  return (
    <MyMDXEditor
      markdown={field.value ?? ""}
      onChange={(value) => field.onChange(value)}
    />
  );
}

interface Props {
  field: ContentFieldProps;
}
