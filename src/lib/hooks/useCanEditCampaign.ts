"use client";

import useCampaignStore from "../store/useCampaignStore";
import useSession from "./useSession";

export default function useCanEditCampaign() {
  const session = useSession();
  const { campaignData } = useCampaignStore();

  return session?.user?.id === campaignData?.gm_id;
}
