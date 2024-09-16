import { useTranslations } from "next-intl";
import GameTabCardLayout from "../GameTabCardLayout";

import useGameStore from "@/lib/store/useGameStore";
import ImportCampaignAction from "./ImportCampaignAction";
import useSessionUser from "@/lib/hooks/useSession";
import useCampaignData from "@/lib/hooks/campaign/useCampaignData";
import CampaignBoard from "@/components/campaign/CampaignBoard";
import Loading from "@/components/ui/loading";

export default function GameHandouts() {
  const t = useTranslations("GamePage");
  const user = useSessionUser();

  const { gameData } = useGameStore((state) => ({
    gameData: state.gameData,
  }));

  const { campaignData, isFetching } = useCampaignData(
    gameData?.campaign_id,
    user?.id
  );

  return (
    <GameTabCardLayout
      title={t("handouts")}
      action={<ImportCampaignAction gameId={gameData?.id!} />}
    >
      {campaignData && (
        <CampaignBoard campaignData={campaignData} userId={user!.id} gameId={gameData?.id!} />
      )}
      {!campaignData && !isFetching && (
        <div className="text-center h-96 flex items-center justify-center">
          <p className="font-bold text-muted-foreground">{t("noCampaigns")}</p>
        </div>
      )}
      {isFetching && (
        <div className="text-center h-96 flex items-center justify-center">
          <Loading loading={isFetching} />
        </div>
      )}
    </GameTabCardLayout>
  );
}
