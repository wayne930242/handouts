"use client";

import dynamic from "next/dynamic";

import useAppStore from "@/lib/store/useAppStore";
import useSubscribeCampaign from "@/lib/hooks/campaign/useSubscribeCampaign";
import useCanEditCampaign from "@/lib/hooks/campaign/useCanEditCampaign";
import { Campaign as CampaignData } from "@/types/interfaces";

import Toolbar from "./CampaignToolbar";

const CampaignEditor = dynamic(() => import("./CampaignEditor"), {
  ssr: false,
});
const CampaignViewer = dynamic(() => import("./CampaignViewer"), {
  ssr: false,
});

export default function CampaignBoard({ campaignData, userId }: Props) {
  const { editingStage } = useAppStore((state) => ({
    editingStage: state.editingStage,
  }));

  const isGm = useCanEditCampaign();

  useSubscribeCampaign(campaignData.id);

  return (
    <div className="w-full">
      <Toolbar
        campaignId={campaignData.id}
        isOwner={isGm}
        isJoined={!!campaignData?.players?.find((p) => p?.user?.id === userId)}
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
  campaignData: CampaignData;
  userId?: string;
}
