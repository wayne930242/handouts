"use client";
import { Plus, X } from "lucide-react";
import { Chapter, SectionData } from "@/types/interfaces";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import SectionsArea from "./SectionsArea";
import { advancedRemoveElement } from "@/lib/arrayAction";
import { Label } from "@/components/ui/label";
import { useTranslations } from "next-intl";
import useConfirmDialog from "@/lib/hooks/useConfirmDialog";
import { useClient } from "@/lib/supabase/client";

interface Props {
  chapter: Chapter;
}

const emptySection = (
  campaignId: string,
  chapterId: number,
  orderNum: number
): Omit<SectionData, "id"> => ({
  campaign_id: campaignId,
  chapter_id: chapterId,
  title: "",
  order_num: orderNum,
});

export default function ChapterCard({ chapter }: Props) {
  const t = useTranslations("ChapterCard");
  const supabase = useClient();

  const { setCampaignData, campaignData } = useCampaignStore((state) => ({
    campaignData: state.campaignData,
    setCampaignData: state.setCampaignData,
  }));

  const deleteChapter = async (chapters: Chapter[]) => {
    if (!chapters || chapters.length === 0) return;
    const chapterIndex = chapters.findIndex((c) => c.id === chapter.id);
    const newChapters = advancedRemoveElement(
      chapters ?? [],
      chapterIndex,
      "order_num",
      ["sections"]
    );
    if (newChapters.length !== 0) {
      setCampaignData(newChapters, {}, supabase, "chapters", "UPDATE");
    }
    setCampaignData(
      {
        id: chapter.id,
        campaign_id: chapter.campaign_id,
        title: chapter.title,
        order_num: chapter.order_num,
      },
      {
        id: chapter.id,
        campaign_id: chapter.campaign_id,
        title: chapter.title,
        order_num: chapter.order_num,
      },
      supabase,
      "chapters",
      "DELETE"
    );
  };

  const { setConfirm } = useConfirmDialog(deleteChapter);

  return (
    <div className="relative flex flex-col gap-2 w-full min-h-12 bg-black/5 p-3 rounded-md cursor-default">
      <div className="flex justify-between gap-x-2">
        <div className="flex gap-2 flex-col grow">
          <div className="flex justify-between items-center gap-x-2 pl-2 pr-8">
            <div className="grow grid w-full items-center gap-1.5">
              <Label htmlFor={"chapter-title-" + chapter.id}>
                {t("chapterTitle")}
              </Label>
              <Input
                id={"chapter-title-" + chapter.id}
                placeholder={t("titlePlaceholder")}
                value={chapter.title}
                onChange={(e) => {
                  setCampaignData(
                    {
                      id: chapter.id,
                      campaign_id: chapter.campaign_id,
                      title: e.target.value,
                      order_num: chapter.order_num,
                    },
                    {
                      id: chapter.id,
                      campaign_id: chapter.campaign_id,
                      title: chapter.title,
                      order_num: chapter.order_num,
                    },
                    supabase,
                    "chapters",
                    "UPDATE",
                    {
                      key: "chapter-title",
                      delay: 1200,
                    }
                  );
                }}
              />
            </div>
          </div>
          <div>
            <SectionsArea
              chapterId={chapter.id as number}
              sections={chapter.sections ?? []}
            />
          </div>
          <div className="flex justify-end gap-x-2 my-1">
            <Button
              className="flex gap-1.5 items-center"
              size="sm"
              onClick={() => {
                const newSection = emptySection(
                  campaignData!.id,
                  chapter.id as number,
                  (chapter.sections?.length ?? 0) + 1
                );
                setCampaignData(newSection, {}, supabase, "sections", "INSERT");
              }}
            >
              <p>{t("addSection")}</p>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Button
        className="absolute top-0 right-0 rounded-full"
        variant="ghost"
        size="icon"
        onClick={async (e) => {
          if (!campaignData) return;
          const chapters = campaignData.chapters;
          if (!chapter.sections?.length) {
            deleteChapter(chapters);
          } else {
            setConfirm({
              id: `delete-chapter-${chapter.id}`,
              title: t("deleteChapter"),
              description: t("deleteChapterDescription"),
              data: chapters,
            });
          }
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
