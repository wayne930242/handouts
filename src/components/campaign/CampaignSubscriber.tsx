"use client";

import useSubscribeCampaign from "@/lib/hooks/campaign/useSubscribeCampaign";
import useCampaignStore from "@/lib/store/useCampaignStore";
import useGameStore from "@/lib/store/useGameStore";

export default function CampaignSubscriber({
  campaignId,
  inGame = false,
}: {
  campaignId: string;
  inGame?: boolean;
}) {
  const { setConnectedInGame } = useGameStore((state) => ({
    setConnectedInGame: state.setCampaignConnected,
  }));
  const { setConnected } = useCampaignStore((state) => ({
    setConnected: state.setConnected,
  }));

  useSubscribeCampaign(campaignId, (b) => {
    if (inGame) {
      setConnectedInGame(b);
    } else {
      setConnected(b);
    }
  });

  return <></>;
}
