import { Campaign, Chapter, Handout, Section } from "@/types/interfaces";
import { HandoutsTreeTable } from "@/types/handouts";
import { updateArray } from "./arraryUpdater";

export const updateHandoutsTreeNestedData = <
  T extends Chapter | Section | Handout
>(
  campaignData: Campaign | null,
  table: HandoutsTreeTable,
  newRecord: T,
  oldRecord: Partial<T>,
  eventType: "INSERT" | "UPDATE" | "DELETE"
): Campaign | null => {
  if (!campaignData) return null;

  const updatedData = { ...campaignData };

  switch (table) {
    case "chapters":
      updatedData.chapters = updateArray(
        updatedData.chapters,
        newRecord as Chapter,
        oldRecord as Partial<Chapter>,
        eventType
      );
      break;

    case "sections":
      updatedData.chapters = updatedData.chapters?.map((chapter) => {
        if (eventType === "DELETE") {
          return {
            ...chapter,
            sections: chapter.sections?.filter(
              (section) => section.id !== oldRecord.id
            ),
          };
        } else {
          // Handle INSERT and UPDATE
          if (chapter.id === (newRecord as Section).chapter_id) {
            return {
              ...chapter,
              sections: updateArray(
                chapter.sections,
                newRecord as Section,
                oldRecord as Partial<Section>,
                eventType
              ),
            };
          } else {
            // Remove the section if it's in the wrong chapter
            return {
              ...chapter,
              sections: chapter.sections?.filter(
                (section) => section.id !== newRecord.id
              ),
            };
          }
        }
      });
      break;

    case "handouts":
      updatedData.chapters = updatedData.chapters?.map((chapter) => ({
        ...chapter,
        sections: chapter.sections?.map((section) => {
          if (eventType === "DELETE") {
            return {
              ...section,
              handouts: section.handouts?.filter(
                (handout) => handout.id !== oldRecord.id
              ),
            };
          } else {
            // Handle INSERT and UPDATE
            if (section.id === (newRecord as Handout).section_id) {
              return {
                ...section,
                handouts: updateArray(
                  section.handouts,
                  newRecord as Handout,
                  oldRecord as Partial<Handout>,
                  eventType
                ),
              };
            } else {
              // Remove the handout if it's in the wrong section
              return {
                ...section,
                handouts: section.handouts?.filter(
                  (handout) => handout.id !== newRecord.id
                ),
              };
            }
          }
        }),
      }));
      break;
  }

  return updatedData;
};
