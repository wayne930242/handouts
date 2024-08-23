"use client";

import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  useDroppable,
  closestCenter,
  TouchSensor,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Chapter } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import ChapterCard from "./CampaignEditor/ChapterCard";

import { cn } from "@/lib/utils";

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

  const { isOver, setNodeRef } = useDroppable({
    id: "campaign",
  });

  const chapters = campaignData?.chapters ?? [];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
    useSensor(TouchSensor)
  );

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
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={(event) => {
          const { active, over } = event;

          if (over && active.id !== over.id) {
            const oldIndex = chapters.findIndex(
              (item) => item.id === active.id
            );
            const newIndex = chapters.findIndex((item) => item.id === over.id);
            const newChapters = arrayMove(chapters, oldIndex, newIndex);

            newChapters.forEach((chapter, index) => {
              if (chapter.order_num !== index + 1) {
                chapter.order_num = index + 1;
                setCampaignData(chapter, supabase, "chapters", "UPDATE");
              }
            });
          }
        }}
      >
        <SortableContext
          items={chapters.map((chapter) => chapter.id)}
          strategy={verticalListSortingStrategy}
        >
          <div ref={setNodeRef} className={cn("grid grid-cols-1 gap-y-2")}>
            {chapters.map((chapter) => (
              <ChapterCard key={chapter.id} chapter={chapter} />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
