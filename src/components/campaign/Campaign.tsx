"use client";

import useCampaignData from "@/lib/hooks/campaign/useCampaignData";
import CampaignBoard from "./CampaignBoard";

export default function Campaign({ campaignId, userId }: Props) {
  const { campaignData } = useCampaignData(campaignId, userId);

  return (
    <div className="w-full">
      {campaignData && (
        <CampaignBoard campaignData={campaignData} userId={userId} />
      )}
    </div>
  );
}

interface Props {
  campaignId: string;
  userId?: string;
}
