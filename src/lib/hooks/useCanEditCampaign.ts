"use client";

import useCampaignStore from "../store/useCampaignStore";
import useSessionUser from "./useSession";

export default function useCanEditCampaign() {
  const user = useSessionUser();
  const { campaignData } = useCampaignStore();

  return user?.id === campaignData?.gm_id;
}
