"use client";
import { useEffect, useMemo, useRef } from "react";
import useCampaignStore from "@/lib/store/useCampaignStore";
import useCampaignData from "@/lib/hooks/useCampaignData";
import useAppStore from "@/lib/store/useAppStore";
import { createClient } from "@/lib/supabase/client";
import dynamic from "next/dynamic";

import Toolbar from "./CampaignToolbar";
import useCanEditCampaign from "@/lib/hooks/useCanEditCampaign";
import { removePassphrase } from "@/lib/passphrase";

const CampaignEditor = dynamic(() => import("./CampaignEditor"), {
  ssr: false,
});
const CampaignViewer = dynamic(() => import("./CampaignViewer"), {
  ssr: false,
});

export default function Campaign({ campaignId, isAuthorized }: Props) {
  useCampaignData(campaignId, isAuthorized);
  const { editingCampaign } = useAppStore((state) => ({
    editingCampaign: state.editingCampaign,
  }));
  const { setupRealtimeSubscription, connected } = useCampaignStore(
    (state) => ({
      setupRealtimeSubscription: state.setupRealtimeSubscription,
      connected: state.connected,
    })
  );

  const supabase = useMemo(() => createClient(), []);
  const canEdit = useCanEditCampaign();
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (!isAuthorized) return;

    const setupSubscription = () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      unsubscribeRef.current = setupRealtimeSubscription(supabase, campaignId);
    };

    setupSubscription();

    const handleFocus = () => {
      if (!connected) {
        setupSubscription();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
    };
  }, [
    supabase,
    campaignId,
    isAuthorized,
    connected,
    setupRealtimeSubscription,
  ]);

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
