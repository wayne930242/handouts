import { Campaign, CampaignSubTable } from "@/types/interfaces";
import { updateArray } from "./arraryUpdater";

export const updateCampaignNestedData = (
  campaignData: Campaign | null,
  table: CampaignSubTable,
  newRecord: any,
  oldRecord: any,
  eventType: "INSERT" | "UPDATE" | "DELETE"
): Campaign | null => {
  if (!campaignData) return null;

  const updatedData = { ...campaignData };

  switch (table) {
    case "campaigns":
      return { ...updatedData, ...newRecord };

    case "chapters":
      updatedData.chapters = updateArray(
        updatedData.chapters,
        newRecord,
        oldRecord,
        eventType
      );
      break;

    case "sections":
      updatedData.chapters = updatedData.chapters.map((chapter) => {
        if (eventType === "DELETE") {
          return {
            ...chapter,
            sections: chapter.sections.filter(
              (section) => section.id !== oldRecord.id
            ),
          };
        } else {
          // Handle INSERT and UPDATE
          if (chapter.id === newRecord.chapter_id) {
            return {
              ...chapter,
              sections: updateArray(
                chapter.sections,
                newRecord,
                oldRecord,
                eventType
              ),
            };
          } else {
            // Remove the section if it's in the wrong chapter
            return {
              ...chapter,
              sections: chapter.sections.filter(
                (section) => section.id !== newRecord.id
              ),
            };
          }
        }
      });
      break;


  }

  return updatedData;
};
