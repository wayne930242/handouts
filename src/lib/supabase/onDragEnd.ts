import { DropResult } from "@hello-pangea/dnd";
import { advancedArrayMove, advancedMoveAcrossArrays } from "@/lib/arrayAction";
import { Campaign, SetCampaignData } from "@/types/interfaces";
import { SupabaseClient } from "@supabase/supabase-js";

export default function onDragEnd(
  result: DropResult,
  campaignData: Campaign | null,
  supabase: SupabaseClient,
  setCampaignData: SetCampaignData
) {
  const { source, destination, type } = result;

  const chapters = campaignData?.chapters ?? [];

  if (!destination) return;

  const sourceDroppableId = source.droppableId.split("-");
  const destDroppableId = destination.droppableId.split("-");

  const sourceIndex = source.index;
  const destIndex = destination.index;

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
      // Move section cross chapter
      const sourceChapterId = sourceDroppableId[1];
      const destChapterId = destDroppableId[1];

      if (sourceChapterId === destChapterId && sourceIndex === destIndex) {
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
          chapter_id: Number(destChapterId),
        })
      );

      setCampaignData(newSourceSections, supabase, "sections", "UPDATE");
      setCampaignData(newDestSections, supabase, "sections", "UPDATE");
    }
  } else if (type === "HANDOUT") {
    const sourceChapterId = sourceDroppableId[1];
    const destChapterId = destDroppableId[1];

    const sourceSectionId = sourceDroppableId[3];
    const destSectionId = destDroppableId[3];

    const sourceIndex = source.index;
    const destIndex = destination.index;

    if (
      sourceChapterId === destChapterId &&
      sourceSectionId === destSectionId &&
      sourceIndex === destIndex
    ) {
      return;
    }

    if (
      sourceChapterId === destChapterId &&
      sourceSectionId === destSectionId
    ) {
      // In the same section
      const chapter = chapters.find(
        (chapter) => String(chapter.id) === String(sourceChapterId)
      );
      if (!chapter) return;
      const section = chapter.sections.find(
        (section) => String(section.id) === String(sourceSectionId)
      );
      if (!section) return;

      const newSections = advancedArrayMove(
        section.handouts,
        sourceIndex,
        destIndex,
        "order_num"
      ).map((handout) => ({
        id: handout.id,
        title: handout.title,
        content: handout.content,
        section_id: handout.section_id,
        type: handout.type,
        owner_id: handout.owner_id,
        is_public: handout.is_public,
        note: handout.note,
        order_num: handout.order_num,
      }));

      setCampaignData(newSections, supabase, "handouts", "UPDATE");
    } else {
      const sourceChapter = chapters.find(
        (chapter) => String(chapter.id) === String(sourceChapterId)
      );
      const destChapter = chapters.find(
        (chapter) => String(chapter.id) === String(destChapterId)
      );
      if (!sourceChapter || !destChapter) return;

      const sourceSection = sourceChapter.sections.find(
        (section) => String(section.id) === String(sourceSectionId)
      );
      const destSection = destChapter.sections.find(
        (section) => String(section.id) === String(destSectionId)
      );
      if (!sourceSection || !destSection) return;

      const sourceHandouts = sourceSection.handouts;
      const destHandouts = destSection.handouts;

      const [newSourceHandouts, newDestHandouts] = advancedMoveAcrossArrays(
        sourceHandouts,
        destHandouts,
        sourceIndex,
        destIndex,
        "order_num",
        ["images"],
        undefined,
        (handout) => ({
          ...handout,
          section_id: Number(destSectionId),
        })
      );

      setCampaignData(newSourceHandouts, supabase, "handouts", "UPDATE");
      setCampaignData(newDestHandouts, supabase, "handouts", "UPDATE");
    }
  } else if (type === "HANDOUT_IMAGE") {
  }
}