"use client";

import { Plus, X } from "lucide-react";
import { useTranslations } from "next-intl";

import { Handout, Section } from "@/types/interfaces";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { advancedRemoveElement } from "@/lib/arrayAction";
import { Label } from "@/components/ui/label";
import HandoutsArea from "./HandoutsArea";
import useSession from "@/lib/hooks/useSession";

interface Props {
  section: Section;
}

const emptyHandout = (
  sectionId: number,
  orderNum: number,
  ownerId: string
): Partial<Handout> => ({
  id: "new",
  section_id: sectionId,
  title: "",
  content: "",
  is_public: false,
  note: "",
  type: "text",
  owner_id: ownerId,
  order_num: orderNum,
});

export default function SectionCard({ section }: Props) {
  const t = useTranslations("SectionCard");
  const supabase = createClient();
  const session = useSession();
  const { setCampaignData, campaignData } = useCampaignStore();

  return (
    <div className="relative flex flex-col gap-y-2 w-full min-h-12 bg-black/5 p-3 rounded-md cursor-default">
      <div className="flex justify-between gap-x-2">
        <div className="flex gap-2 flex-col grow">
          <div className="flex justify-between items-center gap-x-2 pl-2 pr-8">
            <div className="grow grid w-full items-center gap-1.5">
              <Label htmlFor={"section-title-" + section.id}>
                {t("sectionTitle")}
              </Label>
              <Input
                id={"section-title-" + section.id}
                placeholder={t("titlePlaceholder")}
                value={section.title}
                onChange={(e) => {
                  setCampaignData(
                    {
                      id: section.id,
                      chapter_id: section.chapter_id,
                      title: e.target.value,
                      order_num: section.order_num,
                    },
                    supabase,
                    "sections",
                    "UPDATE",
                    {
                      key: "section-title",
                      delay: 1200,
                    }
                  );
                }}
              />
            </div>
          </div>
          <div className="grow flex flex-col gap-y-2">
            <HandoutsArea section={section} />
          </div>
          <div className="flex justify-end gap-x-2 my-1">
            <Button
              className="flex gap-1.5 items-center"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
                if (!session) return;

                const newHandout = emptyHandout(
                  section.id as number,
                  (section.handouts?.length ?? 0) + 1,
                  session.user.id
                );

                setCampaignData(newHandout, supabase, "handouts", "INSERT");
              }}
            >
              <p>{t("handoutButton")}</p>
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Button
        className="absolute top-0 right-0 rounded-full"
        variant="ghost"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          const chapter = campaignData?.chapters.find(
            (chapter) => chapter.id === section.chapter_id
          );

          if (!chapter) return;
          const { sections } = chapter;

          const sectionIndex = sections.findIndex((s) => s.id === section.id);

          const newSections = advancedRemoveElement(
            sections ?? [],
            sectionIndex,
            "order_num",
            ["handouts"]
          );

          if (newSections.length !== 0) {
            setCampaignData(newSections, supabase, "sections", "UPDATE");
          }

          setCampaignData(
            {
              id: section.id,
              chapter_id: section.chapter_id,
            },
            supabase,
            "sections",
            "DELETE"
          );
        }}
      >
        <X className="h-4 w-4" />
      </Button>
    </div>
  );
}
