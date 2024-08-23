import { useEffect } from "react";
import { SupabaseClient } from "@supabase/supabase-js";
import useCampaignStore from "@/lib/store/useCampaignStore";

const useCampaignData = (
  supabase: SupabaseClient,
  campaignId: string,
  isAuthorized: boolean
) => {
  const {
    campaignData,
    loading,
    error,
    fetchCampaignData,
    setupRealtimeSubscription,
  } = useCampaignStore();

  useEffect(() => {
    if (!isAuthorized) return;
    fetchCampaignData(supabase, campaignId);
    const unsubscribe = setupRealtimeSubscription(supabase, campaignId);
    return unsubscribe;
  }, [supabase, campaignId, isAuthorized]);

  return {
    campaignData,
    loading,
    error,
    refetch: () => fetchCampaignData(supabase, campaignId),
  };
};

export default useCampaignData;
