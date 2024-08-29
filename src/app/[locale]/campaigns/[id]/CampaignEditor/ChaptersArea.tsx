"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import { Chapter } from "@/types/interfaces";
import ChapterCard from "./ChapterCard";

import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import onDragEnd from "@/lib/supabase/onDragEnd";

interface Props {
  chapters: Chapter[];
  campaignId: string;
}

export default function ChaptersArea({ chapters, campaignId }: Props) {
  const supabase = createClient();

  const { campaignData, setCampaignData } = useCampaignStore((state) => ({
    campaignData: state.campaignData,
    setCampaignData: state.setCampaignData,
  }));

  return (
    <DragDropContext
      onDragEnd={(result) => {
        onDragEnd(result, campaignData, supabase, setCampaignData);
      }}
    >
      <Droppable droppableId={"chapters"} type="CHAPTER">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-1 gap-y-4"
          >
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id ?? "new-" + index}
                draggableId={chapter.id.toString()}
                index={index}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ChapterCard chapter={chapter} />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
}
