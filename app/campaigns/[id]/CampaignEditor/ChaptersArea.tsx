"use client";

import {
  DragDropContext,
  DragStart,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";

import { Chapter } from "@/types/interfaces";
import ChapterCard from "./ChapterCard";
import { advancedArrayMove } from "@/lib/arrayAction";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";

import { cn } from "@/lib/utils";

interface Props {
  chapters: Chapter[];
}

export default function ChaptersArea({ chapters }: Props) {
  const supabase = createClient();

  const { campaignData, setCampaignData } = useCampaignStore();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    const sourceDroppableId = source.droppableId.split("-");
    const destDroppableId = destination.droppableId.split("-");

    let newChapters = [...chapters];

    if (type === "CHAPTER") {
    } else if (type === "SECTION") {
    } else if (type === "HANDOUT") {
    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="chapters" type="CHAPTER">
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className="grid grid-cols-1 gap-y-2"
          >
            {chapters.map((chapter, index) => (
              <Draggable
                key={chapter.id}
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
