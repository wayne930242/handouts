"use client";

import { Plus } from "lucide-react";

import { Chapter } from "@/types/interfaces";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";

import { Button } from "@/components/ui/button";
import ChaptersArea from "./CampaignEditor/ChaptersArea";

const genEmptyChapter = (
  campaignId: string,
  orderNum: number
): Partial<Chapter> => ({
  id: "new",
  campaign_id: campaignId,
  title: "",
  order_num: orderNum,
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
            className="flex gap-1.5 items-center"
            onClick={() => {
              const newChapter = genEmptyChapter(
                campaignData?.id as string,
                (campaignData?.chapters?.length ?? 0) + 1
              );

              setCampaignData(newChapter, supabase, "chapters", "INSERT");
            }}
          >
            <p>章節</p>
            <Plus className="h-4 w-4" />
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
