"use client";

import { PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { Eye, Pen, Unplug } from "lucide-react";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";

export default function Toolbar({
  campaignId,
  isAuthorized,
}: {
  campaignId: string;
  isAuthorized: boolean;
}) {
  const { editingCampaign, setEditingCampaign } = useAppStore();
  const { connected, setupRealtimeSubscription } = useCampaignStore();

  const { loading } = useCampaignStore();

  const supabase = createClient();

  return (
    <div className="flex justify-between items-center w-full px-2">
      <div className="grow-1 flex gap-2 items-center">
        <PacmanLoader color="#bbb" loading={loading} size={12} />
      </div>
      <div className="flex gap-1.5 items-center">
        {!connected && (
          <Badge
            variant="outline"
            className="text-destructive border-transparent animate-pulse cursor-pointer"
            onClick={() => {
              setupRealtimeSubscription(supabase, campaignId);
            }}
          >
            <Unplug className="h-4 w-4" />
          </Badge>
        )}
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
