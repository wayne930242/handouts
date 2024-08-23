"use client";

import { Plus, X } from "lucide-react";

import { Section } from "@/types/interfaces";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { advancedRemoveElement } from "@/lib/arrayAction";

interface Props {
  section: Section;
}

export default function SectionCard({ section }: Props) {
  const supabase = createClient();
  const { setCampaignData, campaignData } = useCampaignStore();

  return (
    <div className="relative flex flex-col gap-2 w-full min-h-12 bg-black/5 p-2 rounded-md cursor-default">
      <div className="flex justify-between gap-x-2">
        <div className="flex gap-2 flex-col grow">
          <div className="flex justify-between items-center gap-x-2 px-12">
            {section.id}
            <div className="grow">
              <Input
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
                    "section-title",
                    300
                  );
                }}
              />
            </div>
          </div>
          <div>
            <Button
              className="w-full flex gap-2 items-center"
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.preventDefault();
              }}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      <Button
        className="absolute top-2 right-2"
        variant="destructive"
        size="icon"
        onClick={(e) => {
          e.stopPropagation();
          const chapter = campaignData?.chapters.find(
            (chapter) => chapter.id === section.chapter_id
          );
          if (!chapter) return;
          const { sections } = chapter;
          const newSections = advancedRemoveElement(
            sections ?? [],
            section.order_num,
            "order_num",
            ["handouts"]
          );

          setCampaignData(newSections, supabase, "sections", "UPDATE");

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