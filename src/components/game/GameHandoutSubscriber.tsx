"use client";

import useSubscribeHandouts from "@/lib/hooks/useSubscribeHandouts";
import useCampaignStore from "@/lib/store/useCampaignStore";
import useGameStore from "@/lib/store/useGameStore";
import { useEffect } from "react";

export default function GameHandoutSubscriber({
  campaignId,
}: {
  campaignId: string;
}) {
  const { setConnected, setNeedConnect } = useGameStore((state) => ({
    setConnected: state.setConnected,
    setNeedConnect: state.setNeedConnect,
  }));
  const { handleRealtimeUpdate } = useCampaignStore((state) => ({
    handleRealtimeUpdate: state.handleRealtimeUpdate,
  }));

  useEffect(() => {
    setNeedConnect(true);
    return () => {
      setNeedConnect(false);
    };
  }, [setNeedConnect]);

  useSubscribeHandouts(
    campaignId,
    handleRealtimeUpdate,
    () => setConnected(true),
    () => setConnected(false)
  );

  return <></>;
}
