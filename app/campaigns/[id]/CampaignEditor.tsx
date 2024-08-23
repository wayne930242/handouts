"use client";

import { DndContext } from "@dnd-kit/core";
import { Campaign, Chapter } from "@/types/interfaces";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { createClient } from "@/utils/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";

const genEmptyChapter = (campaignId: number, orderNum: number): Chapter => ({
  id: "new",
  campaign_id: campaignId,
  title: "",
  order_num: orderNum,
  sections: [],
});

export default function CampaignEditor() {
  const supabase = createClient();

  const { campaignData, setCampaignData } = useCampaignStore();

  return (
    <div className="flex flex-col gap-2 w-full my-2">
      <div className="flex justify-between items-center w-full px-2">
        <div className="grow-1"></div>
        <div>
          <Button size="sm" className="flex gap-2 items-center">
            新章節 <Plus className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <DndContext>CampaignEditor</DndContext>
    </div>
  );
}
