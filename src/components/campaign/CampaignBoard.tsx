"use client";

import dynamic from "next/dynamic";

import useCanEditCampaign from "@/lib/hooks/campaign/useCanEditCampaign";
import { Campaign as CampaignData } from "@/types/interfaces";
import CampaignViewer from "./CampaignViewer";

import Toolbar from "./CampaignToolbar";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { useEffect } from "react";

const CampaignEditor = dynamic(() => import("./CampaignEditor"), {
  ssr: false,
});

export default function CampaignBoard({ campaignData, userId, gameId }: Props) {
  const { editingStage, setEditingStage } = useCampaignStore((state) => ({
    editingStage: state.editingStage,
    setEditingStage: state.setEditingStage,
  }));

  useEffect(() => {
    return () => {
      setEditingStage(null);
    };
  }, []);

  const isGm = useCanEditCampaign();

  return (
    <div className="w-full">
      {(!gameId || isGm) && (
        <Toolbar
          campaignId={campaignData.id}
          isOwner={isGm}
          isJoined={
            !!campaignData?.players?.find((p) => p?.user?.id === userId)
          }
          isFavorite={!!campaignData?.favorite?.length}
          gameId={gameId}
        />
      )}
      <div className="flex flex-col gap-2 w-full my-2 px-2">
        {editingStage === "campaign" && <CampaignEditor />}
        {editingStage !== "campaign" && <CampaignViewer withoutHeader />}
      </div>
    </div>
  );
}

interface Props {
  campaignData: CampaignData;
  userId?: string;
  gameId?: string;
}
