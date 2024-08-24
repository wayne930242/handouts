import {
  Campaign,
  CampaignSubTable,
  HandoutImage,
  Chapter,
  Section,
  Handout,
} from "@/types/interfaces";
import { updateArray } from "./arraryUpdater";

export const updateCampaignNestedData = (
  campaignData: Campaign | null,
  table: CampaignSubTable,
  newRecord: any,
  oldRecord: any,
  eventType: "INSERT" | "UPDATE" | "DELETE",
  rowIdentifier?: Partial<Campaign | Chapter | Section | Handout | HandoutImage>
): Campaign | null => {
  if (!campaignData) return null;

  const updatedData = { ...campaignData };

  if (table === "campaigns") {
    return { ...updatedData, ...newRecord };
  }
  if (table === "chapters") {
    updatedData.chapters = updateArray(
      updatedData.chapters,
      newRecord,
      oldRecord,
      eventType
    );
    if (rowIdentifier) {
      console.warn("rowIdentifier is useless for chapters update");
    }
  }
  if (table === "sections") {
    const chapters = updatedData.chapters;
    const chatperId = (newRecord as Section).chapter_id;
    const chapterIndex = chapters.findIndex(
      (chapter) => chapter.id === chatperId
    );
    if (chapterIndex === -1) return updatedData;
    if (rowIdentifier) {
      const filteredChapters = chapters.filter((chapter) => {
        Object.entries(rowIdentifier).forEach(([key, value]) => {
          if (chapter[key as keyof Chapter] !== value) return false;
        });
        return true;
      });
      updatedData.chapters = updateArray(
        filteredChapters,
        newRecord,
        oldRecord,
        eventType
      );
    } else {
      updatedData.chapters[chapterIndex].sections = updateArray(
        updatedData.chapters[chapterIndex].sections,
        newRecord,
        oldRecord,
        eventType
      );
    }
  }
  if (table === "handouts") {
    updatedData.chapters = updatedData.chapters.map((chapter) => ({
      ...chapter,
      sections: chapter.sections.map((section) => {
        if (rowIdentifier) {
          const filteredHandouts = section.handouts.filter((handout) => {
            Object.entries(rowIdentifier).forEach(([key, value]) => {
              if (handout[key as keyof Handout] !== value) return false;
            });
            return true;
          });
          return {
            ...section,
            handouts: updateArray(
              filteredHandouts,
              newRecord,
              oldRecord,
              eventType
            ),
          };
        } else {
          return {
            ...section,
            handouts: updateArray(
              section.handouts,
              newRecord,
              oldRecord,
              eventType
            ),
          };
        }
      }),
    }));
  }
  if (table === "handout_images") {
    updatedData.chapters = updatedData.chapters.map((chapter) => ({
      ...chapter,
      sections: chapter.sections.map((section) => ({
        ...section,
        handouts: section.handouts.map((handout) => {
          if (rowIdentifier) {
            const filteredImages = handout.images.filter((image) => {
              Object.entries(rowIdentifier).forEach(([key, value]) => {
                if (image[key as keyof HandoutImage] !== value) return false;
              });
              return true;
            });
            return {
              ...handout,
              images: updateArray(
                filteredImages,
                newRecord,
                oldRecord,
                eventType
              ),
            };
          } else {
            return {
              ...handout,
              images: updateArray(
                handout.images,
                newRecord,
                oldRecord,
                eventType
              ),
            };
          }
        }),
      })),
    }));
  }

  return updatedData;
};
