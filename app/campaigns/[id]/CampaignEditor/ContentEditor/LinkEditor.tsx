"use client";

import { ContentFieldProps } from "../HandoutCard";
import { Input } from "@/components/ui/input";

export default function LinkEditor({ field }: Props) {
  return (
    <div className="grid grid-cols-1 gap-y-2 w-full">
      <Input placeholder="請輸入連結" {...field} />
    </div>
  );
}

interface Props {
  field: ContentFieldProps;
}
