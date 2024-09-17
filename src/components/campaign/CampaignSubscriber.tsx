"use client";

import useSubscribeCampaign from "@/lib/hooks/campaign/useSubscribeCampaign";

export default function CampaignSubscriber({
  campaignId,
}: {
  campaignId: string;
}) {
  useSubscribeCampaign(campaignId);

  return <></>;
}
