import { useTranslations } from "next-intl";
import { useEffect, useRef } from "react";
import GameTabCardLayout from "../GameTabCardLayout";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import useGameStore from "@/lib/store/useGameStore";
import { getCampaignDetail } from "@/lib/supabase/query/campaignsQuery";
import { useClient } from "@/lib/supabase/client";
import OverlayLoading from "@/components/layout/OverlayLoading";
import useCampaignStore from "@/lib/store/useCampaignStore";
import useAppStore from "@/lib/store/useAppStore";
import CampaignEditor from "@/components/campaign/CampaignEditor";
import CampaignViewer from "@/components/campaign/CampaignViewer";
import ImportCampaignAction from "./ImportCampaignAction";

export default function GameHandouts() {
  const t = useTranslations("GamePage");

  const { gameData } = useGameStore((state) => ({
    gameData: state.gameData,
  }));

  const { campaignData, initCampaignData } = useCampaignStore((state) => ({
    campaignData: state.campaignData,
    initCampaignData: state.initCampaignData,
  }));

  const campaignId = gameData?.campaign_id;
  const supabase = useClient();

  const { data: campaign, isFetching } = useQuery(
    getCampaignDetail(supabase, campaignId!),
    {
      enabled: !!campaignId,
    }
  );

  const isInit = useRef(false);
  useEffect(() => {
    if (isInit.current) return;
    if (campaign) {
      isInit.current = true;
      initCampaignData(campaign);
    }
  }, [campaign]);

  return (
    <GameTabCardLayout
      title={t("handouts")}
      action={<ImportCampaignAction gameId={gameData?.id!} />}
    >
      {campaignData && (
        <div className="flex flex-col gap-2 w-full my-2 px-2">
          <CampaignViewer />
        </div>
      )}
      {!campaignData && (
        <div className="text-center h-96 flex items-center justify-center">
          <p className="font-bold text-muted-foreground">{t("noCampaigns")}</p>
        </div>
      )}

      {isFetching && <OverlayLoading />}
    </GameTabCardLayout>
  );
}
