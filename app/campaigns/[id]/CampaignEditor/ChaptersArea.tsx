"use client";

import {
  DragDropContext,
  Draggable,
  DropResult,
  Droppable,
} from "@hello-pangea/dnd";

import { Chapter } from "@/types/interfaces";
import ChapterCard from "./ChapterCard";
import { advancedArrayMove, advancedMoveAcrossArrays } from "@/lib/arrayAction";
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

    // console.log(sourceDroppableId, destDroppableId);
    // console.log(type);

    if (type === "CHAPTER") {
      const sourceIndex = source.index;
      const destIndex = destination.index;

      const newChapters = advancedArrayMove(
        chapters,
        sourceIndex,
        destIndex,
        "order_num"
      ).map((chapter) => ({
        id: chapter.id,
        campaign_id: chapter.campaign_id,
        title: chapter.title,
        order_num: chapter.order_num,
      }));

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

        if (sourceIndex === destIndex) return;

        const sections = chapters[sourceChapterIndex].sections;

        const newSections = advancedArrayMove(
          sections,
          sourceIndex,
          destIndex,
          "order_num"
        ).map((section) => ({
          id: section.id,
          chapter_id: section.chapter_id,
          title: section.title,
          order_num: section.order_num,
        }));

        setCampaignData(newSections, supabase, "sections", "UPDATE");
      } else {
        const sourceIndex = source.index;
        const destIndex = destination.index;

        // Move section cross chapter
        const sourceChapterId = Number(sourceDroppableId[1]);
        const destChapterId = Number(destDroppableId[1]);

        if (Number.isNaN(sourceChapterId) || Number.isNaN(destChapterId)) {
          console.error("Invalid chapter id");
          return;
        }

        const sourceSections =
          campaignData?.chapters.find(
            (chapter) => chapter.id === sourceChapterId
          )?.sections ?? [];

        const destSections =
          campaignData?.chapters.find((chapter) => chapter.id === destChapterId)
            ?.sections ?? [];

        const [newSourceSections, newDestSections] = advancedMoveAcrossArrays(
          sourceSections,
          destSections,
          sourceIndex,
          destIndex,
          "order_num",
          ["handouts"],
          undefined,
          (section) => ({
            ...section,
            chapter_id: destChapterId,
          })
        );

        setCampaignData(
          newSourceSections,
          supabase,
          "sections",
          "UPDATE",
        );
        setCampaignData(
          newDestSections,
          supabase,
          "sections",
          "UPDATE",
        );
      }
    } else if (type === "HANDOUT") {
      
    } else if (type === "HANDOUT_IMAGE") {

    }
  };

  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
