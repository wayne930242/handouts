"use client";
import { useEffect, useMemo } from "react";
import useCampaignStore from "@/lib/store/useCampaignStore";
import useCampaignData from "@/lib/hooks/useCampaignData";
import useAppStore from "@/lib/store/useAppStore";
import useSession from "@/lib/hooks/useSession";
import { createClient } from "@/lib/supabase/client";

import CampaignEditor from "./CampaignEditor";
import Toolbar from "./CampaignToolbar";

export default function Campaign({ campaignId, isAuthorized }: Props) {
  const { campaignData } = useCampaignData(campaignId, isAuthorized);
  const { editingCampaign } = useAppStore();
  const { setupRealtimeSubscription } = useCampaignStore();

  const session = useSession();
  const supabase = useMemo(() => createClient(), []);
  const canEdit = session?.user?.id === campaignData?.gm_id;

  useEffect(() => {
    if (!isAuthorized) return;
    const unsubscribe = setupRealtimeSubscription(supabase, campaignId);
    return unsubscribe;
  }, [supabase, campaignId, isAuthorized]);

  return (
    <div className="w-full">
      {canEdit && (
        <Toolbar campaignId={campaignId} isAuthorized={isAuthorized} />
      )}
      {editingCampaign && <CampaignEditor />}
    </div>
  );
}

interface Props {
  campaignId: string;
  isAuthorized: boolean;
}
