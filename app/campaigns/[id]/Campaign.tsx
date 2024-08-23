"use client";

import useCampaignData from "@/lib/hooks/useCampaignData";
import { createClient } from "@/lib/supabase/client";
import Toolbar from "./CampaignToolbar";
import useAppStore from "@/lib/store/useAppStore";
import CampaignEditor from "./CampaignEditor";
import useSession from "@/lib/hooks/useSession";

export default function Campaign({ campaignId, isAuthorized }: Props) {
  const supabase = createClient();

  const { campaignData } = useCampaignData(supabase, campaignId, isAuthorized);
  const { editingCampaign } = useAppStore();

  const session = useSession();
  const canEdit = session?.user?.id === campaignData?.gm_id;

  return (
    <div className="w-full">
      {canEdit && (
        <Toolbar campaignId={campaignId} isAuthorized={isAuthorized} />
      )}
      {editingCampaign && <CampaignEditor />}
    </div>
  );
}

interface Props {
  campaignId: string;
  isAuthorized: boolean;
}
