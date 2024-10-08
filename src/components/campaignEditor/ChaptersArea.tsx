"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

import { Chapter } from "@/types/interfaces";
import ChapterCard from "./ChapterCard";

import { useClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import onCampaignDragEnd from "@/lib/dnd/onCampaignDragEnd";

interface Props {
  chapters: Chapter[];
}

export default function ChaptersArea({ chapters }: Props) {
  const supabase = useClient();

  const { campaignData, setCampaignData, editingStage } = useCampaignStore(
    (state) => ({
      campaignData: state.campaignData,
      setCampaignData: state.setCampaignData,
      editingStage: state.editingStage,
    })
  );

  return (
    <DragDropContext
      onDragEnd={(result) => {
        if (editingStage === "campaign") {
          onCampaignDragEnd(result, campaignData, supabase, setCampaignData);
        }
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
