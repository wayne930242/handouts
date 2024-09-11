"use client";

import dynamic from "next/dynamic";

import useCampaignData from "@/lib/hooks/campaign/useCampaignData";
import useAppStore from "@/lib/store/useAppStore";
import useSubscribeCampaign from "@/lib/hooks/campaign/useSubscribeCampaign";
import useCanEditCampaign from "@/lib/hooks/campaign/useCanEditCampaign";

import Toolbar from "./CampaignToolbar";

const CampaignEditor = dynamic(() => import("./CampaignEditor"), {
  ssr: false,
});
const CampaignViewer = dynamic(() => import("./CampaignViewer"), {
  ssr: false,
});

export default function Campaign({ campaignId, userId }: Props) {
  const { campaignData } = useCampaignData(campaignId, userId);

  const { editingStage } = useAppStore((state) => ({
    editingStage: state.editingStage,
  }));

  const isGm = useCanEditCampaign();

  useSubscribeCampaign(campaignId);

  return (
    <div className="w-full">
      <Toolbar
        campaignId={campaignId}
        isOwner={isGm}
        isJoined={!!campaignData?.players.find((p) => p?.user?.id === userId)}
        isFavorite={!!campaignData?.favorite?.length}
      />
      <div className="flex flex-col gap-2 w-full my-2 px-2">
        {editingStage === "campaign" && <CampaignEditor />}
        {editingStage !== "campaign" && <CampaignViewer />}
      </div>
    </div>
  );
}

interface Props {
  campaignId: string;
  userId?: string;
}
