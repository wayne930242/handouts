'use client'

import { ContentFieldProps } from "../HandoutCard";
import { Input } from "@/components/ui/input";

export default function YoutubeEditor({ field }: Props) {
  return <Input placeholder="請輸入 Youtube 連結" {...field} />;
}

interface Props {
  field: ContentFieldProps;
}
