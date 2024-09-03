"use client";

import useCampaignData from "@/lib/hooks/useCampaignData";
import useAppStore from "@/lib/store/useAppStore";
import dynamic from "next/dynamic";

import Toolbar from "./CampaignToolbar";
import useCanEditCampaign from "@/lib/hooks/useCanEditCampaign";
import useSession from "@/lib/hooks/useSession";

const CampaignEditor = dynamic(() => import("./CampaignEditor"), {
  ssr: false,
});
const CampaignViewer = dynamic(() => import("./CampaignViewer"), {
  ssr: false,
});
const SubscriptCampaign = dynamic(() => import("./SubscriptCampaign"), {
  ssr: false,
});

export default function Campaign({ campaignId, isAuthorized }: Props) {
  const { campaignData } = useCampaignData(campaignId, isAuthorized);
  const session = useSession();

  const { editingCampaign } = useAppStore((state) => ({
    editingCampaign: state.editingCampaign,
  }));

  const isGm = useCanEditCampaign();

  return (
    <div className="w-full">
      <Toolbar
        campaignId={campaignId}
        isOwner={isGm}
        isJoined={
          !!campaignData?.players.find((p) => p?.user?.id === session?.user?.id)
        }
      />
      <div className="flex flex-col gap-2 w-full my-2 px-2">
        {editingCampaign && <CampaignEditor />}
        {!editingCampaign && <CampaignViewer />}
      </div>
      {isAuthorized && <SubscriptCampaign campaignId={campaignId} />}
    </div>
  );
}

interface Props {
  campaignId: string;
  isAuthorized: boolean;
}
