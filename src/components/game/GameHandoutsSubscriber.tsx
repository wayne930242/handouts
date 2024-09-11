"use client";

import useGameStore from "@/lib/store/useGameStore";
import useSubscribeHandouts from "@/lib/hooks/useSubscribeHandouts";
import { useEffect } from "react";

export default function GameHandoutsSubscriber({
  campaign_id,
}: {
  campaign_id: string;
}) {
  const { setConnected, handleRealtimeUpdateCampaignHandouts, setNeedConnect } =
    useGameStore((state) => ({
      setConnected: state.setConnected,
      handleRealtimeUpdateCampaignHandouts:
        state.handleRealtimeUpdateCampaignHandouts,
      handleRealtimeUpdateNotes: state.handleRealtimeUpdateNotes,
      setNeedConnect: state.setNeedConnect,
    }));

  useEffect(() => {
    setNeedConnect(true);
  }, [setNeedConnect]);

  // Subscribe to campaign handouts
  useSubscribeHandouts(
    campaign_id,
    handleRealtimeUpdateCampaignHandouts,
    () => setConnected(true),
    () => setConnected(false)
  );

  return <></>;
}
