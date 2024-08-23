"use client";

import { Plus } from "lucide-react";

import { Chapter } from "@/types/interfaces";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";

import { Button } from "@/components/ui/button";
import ChaptersArea from "./CampaignEditor/ChaptersArea";
import { advancedAddElement } from "@/lib/arrayAction";

const genEmptyChapter = (campaignId: string): Partial<Chapter> => ({
  id: "new",
  campaign_id: campaignId,
  title: "",
});

export default function CampaignEditor() {
  const supabase = createClient();

  const { campaignData, setCampaignData } = useCampaignStore();

  const chapters = campaignData?.chapters ?? [];

  return (
    <div className="flex flex-col gap-2 w-full my-2">
      <div className="flex justify-between items-center w-full px-2">
        <div className="grow-1"></div>
        <div>
          <Button
            size="sm"
            className="flex gap-2 items-center"
            onClick={() => {
              const oldCapters: Partial<Chapter>[] = [
                ...(campaignData?.chapters ?? []),
              ];

              const newChapters = advancedAddElement(
                oldCapters,
                genEmptyChapter(campaignData?.id as string),
                "order_num",
                ["sections"]
              );

              const newChapter = newChapters[newChapters.length - 1];
              const otherChapters = newChapters.slice(0, -1);

              setCampaignData(newChapter, supabase, "chapters", "INSERT");
              setCampaignData(otherChapters, supabase, "chapters", "UPDATE");
            }}
          >
            新章節 <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <ChaptersArea
        chapters={chapters ?? []}
        campaignId={campaignData?.id as string}
      />
    </div>
  );
}
