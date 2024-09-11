"use client";

import useCampaignStore from "@/lib/store/useCampaignStore";
import useSessionUser from "@/lib/hooks/useSession";

export default function useCanEditCampaign() {
  const user = useSessionUser();
  const { campaignData } = useCampaignStore();

  return user?.id === campaignData?.gm_id;
}
