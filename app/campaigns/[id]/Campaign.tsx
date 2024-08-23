"use client";

import useCampaignData from "@/lib/hooks/useCampaignData";
import { createClient } from "@/utils/supabase/client";
import Toolbar from "./CampaignToolbar";
import useAppStore from "@/lib/store/useAppStore";
import CampaignEditor from "./CampaignEditor";
import useSession from "@/lib/hooks/useSession";
import OverlayLoading from "@/components/OverlayLoading";

export default function Campaign({ campaignId, isAuthorized }: Props) {
  const supabase = createClient();

  const { campaignData, loading } = useCampaignData(
    supabase,
    campaignId,
    isAuthorized
  );
  const { editingCampaign } = useAppStore();

  const session = useSession();
  const canEdit = session?.user?.id === campaignData?.gm_id;

  return (
    <div className="w-full">
      {canEdit && <Toolbar />}
      {editingCampaign && <CampaignEditor />}
      {loading && <OverlayLoading />}
    </div>
  );
}

interface Props {
  campaignId: string;
  isAuthorized: boolean;
}
