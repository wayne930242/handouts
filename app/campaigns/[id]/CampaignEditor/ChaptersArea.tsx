"use client";

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";

import { Chapter, Section } from "@/types/interfaces";
import ChapterCard from "./ChapterCard";
import { advancedArrayMove } from "@/lib/arrayAction";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";

interface Props {
  chapters: Chapter[];
  campaignId: string;
}

export default function ChaptersArea({ chapters, campaignId }: Props) {
  const supabase = createClient();

  const { campaignData, setCampaignData } = useCampaignStore();

  const onDragEnd = (result: DropResult) => {
    const { source, destination, draggableId, type } = result;

    if (!destination) return;

    const sourceDroppableId = source.droppableId.split("-");
    const destDroppableId = destination.droppableId.split("-");

    console.log(sourceDroppableId, destDroppableId);
    console.log(type);

    if (type === "CHAPTER") {
      const sourceIndex = source.index;
      const destIndex = destination.index;

      const newChapters = advancedArrayMove(
        chapters,
        sourceIndex,
        destIndex,
        "order_num"
      ).map((chapter) => {
        const { id, campaign_id, title, order_num } = chapter;
        return {
          id,
          campaign_id,
          title,
          order_num,
        };
      });

      setCampaignData(newChapters, supabase, "chapters", "UPDATE");
    } else if (type === "SECTION") {
      const sourceChapterIndex = chapters.findIndex(
        (chapter) => chapter.id == sourceDroppableId[1]
      );
      const destChapterIndex = chapters.findIndex(
        (chapter) => chapter.id == destDroppableId[1]
      );
      if (sourceChapterIndex === destChapterIndex) {
        const sourceIndex = source.index;
        const destIndex = destination.index;

        const sections = chapters[sourceChapterIndex].sections;
      }
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
