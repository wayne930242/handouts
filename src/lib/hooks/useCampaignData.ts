import { useEffect, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getCampaignDetail } from "../supabase/query/campaignsQuery";

const useCampaignData = (campaignId: string, isAuthorized: boolean) => {
  const { initCampaignData, setLoading } = useCampaignStore(state => ({
    initCampaignData: state.initCampaignData,
    setLoading: state.setLoading,
  }));

  const supabase = useMemo(() => createClient(), []);
  const { data: campaignData, isFetching, error, refetch } = useQuery(
    getCampaignDetail(supabase, campaignId),
    {
      enabled: isAuthorized,
      refetchOnWindowFocus: false,
      refetchOnReconnect: false,
      refetchOnMount: false,
    });

  useEffect(() => {
    if (isFetching) setLoading(true);
    else setLoading(false);
  }, [isFetching, setLoading]);

  useEffect(() => {
    if (!campaignData) return;

    initCampaignData(campaignData);
  }, [initCampaignData, campaignData]);

  return {
    campaignData,
    isFetching,
    error,
    refetch,
  };
};

export default useCampaignData;
