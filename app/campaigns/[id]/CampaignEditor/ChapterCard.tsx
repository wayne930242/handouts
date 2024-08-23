"use client";

import { Plus, X } from "lucide-react";

import { Chapter, Section } from "@/types/interfaces";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionsArea from "./SectionsArea";

interface Props {
  chapter: Chapter;
}

const emptySection = (chapterId: number, orderNum: number): Section => ({
  id: "new",
  chapter_id: chapterId,
  title: "",
  order_num: orderNum,
  handouts: [],
});

export default function ChapterCard({ chapter }: Props) {
  const supabase = createClient();
  const { setCampaignData } = useCampaignStore();

  return (
    <div className="relative flex flex-col gap-2 w-full min-h-12 bg-black/5 p-2 rounded-md cursor-default">
      <div className="flex justify-between gap-x-2">
        <div className="flex gap-2 flex-col grow">
          <div className="flex justify-between items-center gap-x-2 pl-6 pr-12">
            <div className="grow">
              {chapter.id}
              <Input
                value={chapter.title}
                onChange={(e) => {
                  setCampaignData(
                    {
                      id: chapter.id,
                      campaign_id: chapter.campaign_id,
                      title: e.target.value,
                      order_num: chapter.order_num,
                    },
                    supabase,
                    "chapters",
                    "UPDATE",
                    "chapter-title",
                    300
                  );
                }}
              />
            </div>
          </div>
          <div>
            <SectionsArea
              chapterId={chapter.id as number}
              sections={chapter.sections ?? []}
            />
          </div>
          <div>
            <Button
              className="w-full flex gap-2 items-center"
              variant="outline"
              size="sm"
              onClick={(e) => {
                setCampaignData(
                  emptySection(
                    chapter.id as number,
                    (chapter.sections?.length ?? 0) + 1
                  ),
                  supabase,
                  "sections",
                  "INSERT"
                );
              }}
            >
              <p>新段落</p>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Button
        className="absolute top-2 right-2"
        variant="destructive"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          setCampaignData(
            {
              id: chapter.id,
              campaign_id: chapter.campaign_id,
              title: chapter.title,
              order_num: chapter.order_num,
            },
            supabase,
            "chapters",
            "DELETE"
          );
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
