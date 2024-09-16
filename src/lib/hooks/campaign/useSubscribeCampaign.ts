"use client";

import useCampaignStore from "@/lib/store/useCampaignStore";
import useSubscribeHandouts from "../useSubscribeHandouts";
import useGameStore from "@/lib/store/useGameStore";
import { useEffect } from "react";

export default function useSubscribeCampaign(campaignId: string) {
  const { setConnected, handleRealtimeUpdate } = useCampaignStore((state) => ({
    setConnected: state.setConnected,
    handleRealtimeUpdate: state.handleRealtimeUpdate,
  }));
  const { setGameConnected, setNeedConnect } = useGameStore((state) => ({
    setGameConnected: state.setConnected,
    setNeedConnect: state.setNeedConnect,
  }));

  useEffect(() => {
    setGameConnected(false);
    setConnected(false);
    setNeedConnect(true);

    return () => {
      setNeedConnect(false);
    };
  }, []);

  useSubscribeHandouts(
    campaignId,
    handleRealtimeUpdate,
    () => {
      setConnected(true);
      setGameConnected(true);
    },
    () => {
      setConnected(false);
      setGameConnected(false);
    }
  );
}
