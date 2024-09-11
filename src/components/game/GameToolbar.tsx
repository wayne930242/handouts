"use client";
import { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { Eye, Pen, Unplug } from "lucide-react";
import { useTranslations } from "next-intl";

import { GameInList } from "@/types/interfaces";
import useAppStore from "@/lib/store/useAppStore";
import { useClient } from "@/lib/supabase/client";
import useSessionUser from "@/lib/hooks/useSession";
import { useRouter } from "@/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OverlayLoading from "@/components/layout/OverlayLoading";
import FavoriteButton from "@/components/toolbar/FavoriteButton";
import ToolbarLayout from "../layout/ToolbarLayout";

import useGameStore from "@/lib/store/useGameStore";
import useHandleFavAndJoin from "@/lib/hooks/useHandleFavAndJoin";
import GameMenu from "./GameMenu";

export default function GameToolbar({
  game,
  isOwner,
  isFavorite,
  isJoined,
}: Props) {
  const { connected, loading, needConnect } = useGameStore((state) => ({
    connected: state.connected,
    loading: state.loading,
    needConnect: state.needConnect,
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

  return (
    <ToolbarLayout>
      <PacmanLoader color="#bbb" loading={loading} size={12} />
      {needConnect && !connected && (
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
}
