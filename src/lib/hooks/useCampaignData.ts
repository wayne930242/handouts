import { useEffect } from "react";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import useCampaignStore from "@/lib/store/useCampaignStore";

import { getCampaignDetail } from "../supabase/query/campaignsQuery";
import { useClient } from "../supabase/client";

const useCampaignData = (campaignId: string, isAuthorized: boolean) => {
  const supabase = useClient()

  const { initCampaignData, setLoading } = useCampaignStore(state => ({
    initCampaignData: state.initCampaignData,
    setLoading: state.setLoading,
  }));

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
