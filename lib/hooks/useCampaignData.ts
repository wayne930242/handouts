import { useEffect, useMemo, useRef } from "react";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";

const useCampaignData = (campaignId: string, isAuthorized: boolean) => {
  const { campaignData, loading, error, fetchCampaignData } =
    useCampaignStore();
  const supabase = useMemo(() => createClient(), []);

  const isInit = useRef(false);
  useEffect(() => {
    if (!isAuthorized || isInit.current) return;
    isInit.current = true;
    fetchCampaignData(supabase, campaignId);
  }, [supabase, campaignId, isAuthorized]);

  return {
    campaignData,
    loading,
    error,
    refetch: () => fetchCampaignData(supabase, campaignId),
  };
};

export default useCampaignData;
