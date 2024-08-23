"use client";

import { PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import useCampaignData from "@/lib/hooks/useCampaignData";
import { Eye, Pen } from "lucide-react";
import { createClient } from "@/utils/supabase/client";

export default function Toolbar({
  campaignId,
  isAuthorized,
}: {
  campaignId: string;
  isAuthorized: boolean;
}) {
  const { editingCampaign, setEditingCampaign } = useAppStore();
  const supabase = createClient();

  const { loading } = useCampaignData(supabase, campaignId, isAuthorized);

  return (
    <div className="flex justify-between items-center w-full px-2">
      <div className="grow-1 flex gap-2 items-center">
        <PacmanLoader color="#bbb" loading={loading} size={12} />
      </div>
      <div>
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant={editingCampaign ? "outline" : "secondary"}
          onClick={() => setEditingCampaign(!editingCampaign)}
        >
          {editingCampaign ? (
            <Eye className="h-4 w-4" />
          ) : (
            <Pen className="h-4 w-4" />
          )}
          {editingCampaign ? "關閉編輯" : "編輯"}
        </Button>
      </div>
    </div>
  );
}
