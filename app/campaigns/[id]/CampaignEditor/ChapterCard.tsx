"use client";

import { Move, X } from "lucide-react";

import { DndContext } from "@dnd-kit/core";

import { useSortable } from "@dnd-kit/sortable";
import { Chapter } from "@/types/interfaces";
import { createClient } from "@/utils/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Button } from "@/components/ui/button";

interface Props {
  chapter: Chapter;
}

export default function ChapterCard({ chapter }: Props) {
  const supabase = createClient();
  const { setCampaignData } = useCampaignStore();

  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: chapter.id });

  const style = transform
    ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
      }
    : undefined;

  return (
    <div
      style={style}
      ref={setNodeRef}
      className="flex flex-col gap-2 w-full min-h-12 bg-black/5 p-2 rounded-md"
      {...attributes}
    >
      <div className="flex justify-between gap-x-2">
        <div className="flex gap-2 flex-col grow">
          <div className="flex justify-between items-center gap-x-2">
            <Button
              className="shrink-0 grow-0"
              variant="outline"
              size="icon"
              {...listeners}
            >
              <Move className="h-4 w-4" />
            </Button>
            <div>
              {chapter.title}
              {JSON.stringify(chapter)}
              <DndContext></DndContext>
            </div>
          </div>
          <div>
            <Button
              className="w-full"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              新段落
            </Button>
          </div>
        </div>
        <Button
          variant="ghost"
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
    </div>
  );
}
