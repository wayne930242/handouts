"use client";

import React from "react";
import { X } from "lucide-react";
import dynamic from "next/dynamic";

import { Handout, HandoutType } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardFooter,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { Input } from "@/components/ui/input";
import useCampaignStore from "@/lib/store/useCampaignStore";

const FileEditor = dynamic(() => import("./HandoutEditor/FileEditor"), {
  ssr: false,
});
const ImageEditor = dynamic(() => import("./HandoutEditor/ImageEditor"), {
  ssr: false,
});
const LinkEditor = dynamic(() => import("./HandoutEditor/LinkEditor"), {
  ssr: false,
});
const TextEditor = dynamic(() => import("./HandoutEditor/TextEditor"), {
  ssr: false,
});
const YoutubeEditor = dynamic(() => import("./HandoutEditor/YoutubeEditor"), {
  ssr: false,
});

export default function HandoutCard({ handout, chapterId }: Props) {
  const { setCampaignData, setCampaignDataLocal } = useCampaignStore();

  return (
    <Card className="relative">
      <CardHeader className="mt-2 flex flex-col gap-y-2">
        <Input
          placeholder="標題"
          value={handout.title ?? undefined}
          onChange={(e) => {
            setCampaignDataLocal(
              {
                id: handout.id,
                title: e.target.value,
                section_id: handout.section_id,
              },
              "handouts",
              "UPDATE"
            );
          }}
        />

        <Select
          onValueChange={(value) => {
            setCampaignDataLocal(
              {
                id: handout.id,
                type: value as HandoutType,
                section_id: handout.section_id,
              },
              "handouts",
              "UPDATE"
            );
          }}
          defaultValue={handout.type}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="選擇手邊資料類型" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="text">文字</SelectItem>
            <SelectItem value="image">圖片</SelectItem>
            <SelectItem value="link">連結</SelectItem>
            <SelectItem value="youtube">Youtube</SelectItem>
            <SelectItem value="file">檔案</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="flex flex-col gap-y-2">
        <div>
          {handout.type === "image" && (
            <ImageEditor handout={handout} chapterId={chapterId} />
          )}
          {handout.type === "link" && (
            <LinkEditor handout={handout} chapterId={chapterId} />
          )}
          {handout.type === "youtube" && (
            <YoutubeEditor handout={handout} chapterId={chapterId} />
          )}
          {handout.type === "file" && (
            <FileEditor handout={handout} chapterId={chapterId} />
          )}
          {handout.type === "text" && (
            <TextEditor handout={handout} chapterId={chapterId} />
          )}
        </div>
      </CardContent>

      <CardFooter className="flex gap-2 mt-6 flex-col-reverse sm:justify-end sm:flex-row items-stretch sm:items-center">
        <Button variant="outline">取消</Button>
        <Button>儲存</Button>
      </CardFooter>
      <Button
        className="absolute top-0 right-0 rounded-full w-8 h-8"
        variant="ghost"
        size="icon"
        onClick={(e) => {}}
      >
        <X className="h-4 w-4" />
      </Button>
    </Card>
  );
}

interface Props {
  handout: Handout;
  chapterId: number;
}
