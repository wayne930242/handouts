"use client";

import { Chapter } from "@/types/interfaces";
import { DndContext } from "@dnd-kit/core";
import { createClient } from "@/utils/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

interface Props {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: Props) {
  const supabase = createClient();
  const { setCampaignData } = useCampaignStore();

  const handleDelete = () => {
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
  };

  return (
    <div className="flex flex-col gap-2 w-full min-h-12 bg-black/5 p-2 rounded-md">
      <div className="flex justify-between items-center">
        <div>{chapter.title}</div>
        <Button variant="ghost" size="icon" onClick={handleDelete}>
          <X className="h-4 w-4" />
        </Button>
      </div>
      <DndContext></DndContext>
    </div>
  );
}
