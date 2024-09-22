"use client";

import useSubscribeCampaign from "@/lib/hooks/campaign/useSubscribeCampaign";
import useCampaignStore from "@/lib/store/useCampaignStore";

export default function CampaignSubscriber({
  campaignId,
}: {
  campaignId: string;
}) {
  const { setConnected } = useCampaignStore((state) => ({
    setConnected: state.setConnected,
  }));

  useSubscribeCampaign(campaignId, (b) => {
    setConnected(b);
  });

  return <></>;
}
