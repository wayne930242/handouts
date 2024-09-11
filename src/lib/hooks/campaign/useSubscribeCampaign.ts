"use client";

import useCampaignStore from "@/lib/store/useCampaignStore";
import useSubscribeHandouts from "../useSubscribeHandouts";

export default function useSubscribeCampaign(campaignId: string) {
  const { setConnected, handleRealtimeUpdate } = useCampaignStore((state) => ({
    setConnected: state.setConnected,
    handleRealtimeUpdate: state.handleRealtimeUpdate,
  }));

  useSubscribeHandouts(
    campaignId,
    handleRealtimeUpdate,
    () => setConnected(true),
    () => setConnected(false)
  );
}
