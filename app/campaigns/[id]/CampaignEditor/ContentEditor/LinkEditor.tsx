'use client'

import { ContentFieldProps } from "../HandoutCard";
import { Input } from "@/components/ui/input";

export default function LinkEditor({ field }: Props) {
  return <Input placeholder="請輸入連結" {...field} />;
}

interface Props {
  field: ContentFieldProps;
}
