"use client";
import { useEffect, useMemo } from "react";
import useCampaignStore from "@/lib/store/useCampaignStore";
import useCampaignData from "@/lib/hooks/useCampaignData";
import useAppStore from "@/lib/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

import Toolbar from "./CampaignToolbar";
import useCanEditCampaign from "@/lib/hooks/useCanEditCampaign";

const CampaignEditor = dynamic(() => import("./CampaignEditor"), {
  ssr: false,
});
const CampaignViewer = dynamic(() => import("./CampaignViewer"), {
  ssr: false,
});

export default function Campaign({ campaignId, isAuthorized }: Props) {
  useCampaignData(campaignId, isAuthorized);
  const { editingCampaign } = useAppStore();
  const { setupRealtimeSubscription } = useCampaignStore();

  const supabase = useMemo(() => createClient(), []);
  const canEdit = useCanEditCampaign();

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
      <div className="flex flex-col gap-2 w-full my-2 px-2">
        {editingCampaign && <CampaignEditor />}
        {!editingCampaign && <CampaignViewer />}
      </div>
    </div>
  );
}

interface Props {
  campaignId: string;
  isAuthorized: boolean;
}
