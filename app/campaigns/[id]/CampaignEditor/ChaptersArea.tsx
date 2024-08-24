"use client";

import { DragDropContext, Draggable, Droppable } from "@hello-pangea/dnd";

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

  return (
    <DragDropContext
      onDragEnd={(result) => {
        const { source, destination, type } = result;

        if (!destination) return;

        const sourceDroppableId = source.droppableId.split("-");
        const destDroppableId = destination.droppableId.split("-");

        if (type === "CHAPTER") {
          const sourceIndex = source.index;
          const destIndex = destination.index;

          if (sourceIndex === destIndex) return;

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
            (chapter) => String(chapter.id) == String(sourceDroppableId[1])
          );
          const destChapterIndex = chapters.findIndex(
            (chapter) => String(chapter.id) == String(destDroppableId[1])
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
            const sourceChapterId = sourceDroppableId[1];
            const destChapterId = destDroppableId[1];

            if (
              sourceChapterId === destChapterId &&
              sourceIndex === destIndex
            ) {
              return;
            }

            const sourceSections =
              campaignData?.chapters.find(
                (chapter) => String(chapter.id) === String(sourceChapterId)
              )?.sections ?? [];

            const destSections =
              campaignData?.chapters.find(
                (chapter) => String(chapter.id) === String(destChapterId)
              )?.sections ?? [];

            const [newSourceSections, newDestSections] =
              advancedMoveAcrossArrays(
                sourceSections,
                destSections,
                sourceIndex,
                destIndex,
                "order_num",
                ["handouts"],
                undefined,
                (section) => ({
                  ...section,
                  chapter_id: Number(destChapterId),
                })
              );

            setCampaignData(newSourceSections, supabase, "sections", "UPDATE");
            setCampaignData(newDestSections, supabase, "sections", "UPDATE");
          }
        } else if (type === "HANDOUT") {
        } else if (type === "HANDOUT_IMAGE") {
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
