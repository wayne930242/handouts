"use client";
import { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { Unplug } from "lucide-react";
import { useTranslations } from "next-intl";

import { GameInList } from "@/types/interfaces";
import useSessionUser from "@/lib/hooks/useSession";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OverlayLoading from "@/components/layout/OverlayLoading";
import FavoriteButton from "@/components/toolbar/FavoriteButton";
import ToolbarLayout from "../layout/ToolbarLayout";

import useGameStore from "@/lib/store/useGameStore";
import useHandleFavAndJoin from "@/lib/hooks/useHandleFavAndJoin";
import GameMenu from "./GameMenu";
import { getBannerUrl } from "@/lib/bannerUrl";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import useCampaignStore from "@/lib/store/useCampaignStore";

export default function GameToolbar({
  game,
  isOwner,
  isFavorite,
  isJoined,
  hasCampaign,
}: Props) {
  const { loadingCampaigns, campaignConnected, campaignData } =
    useCampaignStore((state) => ({
      loadingCampaigns: state.loading,
      campaignData: state.campaignData,
      campaignConnected: state.connected,
    }));

  const { notesConnectd, loading: loadingNotes } = useGameStore((state) => ({
    notesConnectd: state.notesConnected,
    loading: state.loading,
  }));

  const t = useTranslations("Toolbar");
  const user = useSessionUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isLocalJoined, setIsLocalJoined] = useState(false);
  const [isLocalFavorite, setIsLocalFavorite] = useState(false);

  useEffect(() => {
    setIsLocalJoined(!!isJoined);
  }, [setIsLocalJoined, isJoined]);

  useEffect(() => {
    setIsLocalFavorite(!!isFavorite);
  }, [setIsLocalFavorite, isFavorite]);

  const { joinOrLeave, addOrRemoveFavorite } = useHandleFavAndJoin({
    tableName: "games",
    userId: user?.id,
    itemId: game?.id,
    isJoined: isLocalJoined,
    isFavorite: isLocalFavorite,
    setIsLoading,
    setIsJoined: setIsLocalJoined,
    setIsFavorite: setIsLocalFavorite,
  });

  const connected = notesConnectd && (campaignConnected || hasCampaign);
  const realtimeLoading = loadingCampaigns || loadingNotes;

  return (
    <ToolbarLayout
      leftSec={
        <div className="flex justify-center items-center w-full gap-x-2">
          <Avatar className="w-8 h-8">
            <AvatarImage src={game.banner_url ?? getBannerUrl(game?.id)} />
            <AvatarFallback>{game.title}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col">
            <div className="text-lg font-semibold ">{game?.title}</div>
          </div>
        </div>
      }
    >
      <PacmanLoader color="#bbb" loading={realtimeLoading} size={12} />
      {!connected && (
        <Badge
          variant="outline"
          className="text-destructive border-transparent animate-pulse"
        >
          <Unplug className="h-4 w-4" />
        </Badge>
      )}
      <FavoriteButton
        isFavorite={isLocalFavorite}
        onClick={() => addOrRemoveFavorite()}
      />
      {!isOwner && (
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant="outline"
          onClick={() => joinOrLeave()}
        >
          {isLocalJoined ? t("leave") : t("join")}
        </Button>
      )}
      {game && <GameMenu game={game} isOwner={isOwner} />}
      {isLoading && <OverlayLoading />}
    </ToolbarLayout>
  );
}

interface Props {
  game: GameInList;
  isOwner?: boolean;
  isFavorite?: boolean;
  isJoined?: boolean;
  hasCampaign?: boolean;
}
