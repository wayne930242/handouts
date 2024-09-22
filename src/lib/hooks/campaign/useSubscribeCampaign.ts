"use client";

import useCampaignStore from "@/lib/store/useCampaignStore";
import useSubscribeHandouts from "../useSubscribeHandouts";
import { useEffect } from "react";

export default function useSubscribeCampaign(
  campaignId: string,
  setConnected?: (connected: boolean) => void
) {
  const { handleRealtimeUpdate } = useCampaignStore((state) => ({
    handleRealtimeUpdate: state.handleRealtimeUpdate,
    campaignData: state.campaignData,
  }));

  useEffect(() => {
    return () => {
      setConnected?.(false);
    };
  }, []);

  useSubscribeHandouts(
    campaignId,
    handleRealtimeUpdate,
    () => {
      setConnected?.(true);
    },
    () => {
      setConnected?.(false);
    }
  );
}
