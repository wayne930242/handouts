"use client";

import { DndContext } from "@dnd-kit/core";
import { Chapter } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import ChapterCard from "./CampaignEditor/ChapterCard";

const genEmptyChapter = (campaignId: string, orderNum: number): Chapter => ({
  id: "new",
  campaign_id: campaignId,
  title: "",
  order_num: orderNum,
  sections: [],
});

export default function CampaignEditor() {
  const supabase = createClient();

  const { campaignData, setCampaignData } = useCampaignStore();

  return (
    <div className="flex flex-col gap-2 w-full my-2">
      <div className="flex justify-between items-center w-full px-2">
        <div className="grow-1"></div>
        <div>
          <Button
            size="sm"
            className="flex gap-2 items-center"
            onClick={() => {
              const newChapter = genEmptyChapter(
                campaignData?.id as string,
                campaignData?.chapters?.length ?? 0
              );
              const { sections, ...newChapterWithoutSections } = newChapter;
              setCampaignData(
                newChapterWithoutSections,
                supabase,
                "chapters",
                "INSERT"
              );
            }}
          >
            新章節 <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <DndContext>
        {campaignData?.chapters
          .sort((a, b) => a.order_num - b.order_num)
          .map((chapter) => (
            <ChapterCard key={chapter.id} chapter={chapter} />
          ))}
      </DndContext>
    </div>
  );
}
