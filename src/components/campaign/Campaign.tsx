"use client";

import useCampaignData from "@/lib/hooks/campaign/useCampaignData";
import CampaignBoard from "./CampaignBoard";
import CampaignSubscriber from "./CampaignSubscriber";

export default function Campaign({ campaignId, userId }: Props) {
  const { campaignData } = useCampaignData(campaignId, userId);

  return (
    <div className="w-full">
      {campaignData && (
        <>
          <CampaignBoard campaignData={campaignData} userId={userId} />
          <CampaignSubscriber campaignId={campaignData.id} />
        </>
      )}
    </div>
  );
}

interface Props {
  campaignId: string;
  userId?: string;
}
