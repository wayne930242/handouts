"use client";
import { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { Eye, Pen, Unplug } from "lucide-react";
import { useTranslations } from "next-intl";

import useAppStore from "@/lib/store/useAppStore";
import useCampaignStore from "@/lib/store/useCampaignStore";
import useSessionUser from "@/lib/hooks/useSession";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CampaignMenu from "./CampaignMenu";
import OverlayLoading from "@/components/layout/OverlayLoading";
import FavoriteButton from "@/components/toolbar/FavoriteButton";
import ToolbarLayout from "../layout/ToolbarLayout";
import useHandleFavAndJoin from "@/lib/hooks/useHandleFavAndJoin";
import useGameStore from "@/lib/store/useGameStore";

export default function Toolbar({
  campaignId,
  isOwner,
  isFavorite,
  isJoined,
  gameId,
}: {
  campaignId: string;
  isOwner?: boolean;
  isFavorite?: boolean;
  isJoined?: boolean;
  gameId?: string;
}) {
  const user = useSessionUser();
  const t = useTranslations("Toolbar");

  const [isLocalJoined, setIsLocalJoined] = useState(false);
  const [isLocalFavorite, setIsLocalFavorite] = useState(false);

  useEffect(() => {
    setIsLocalJoined(!!isJoined);
  }, [setIsLocalJoined, isJoined]);

  useEffect(() => {
    setIsLocalFavorite(!!isFavorite);
  }, [setIsLocalFavorite, isFavorite]);

  const {
    campaignData,
    connected,
    loading,
    editingStage,
    setEditingStage,
    setEditingId,
  } = useCampaignStore((state) => ({
    campaignData: state.campaignData,
    connected: state.connected,
    loading: state.loading,
    editingStage: state.editingStage,
    setEditingStage: state.setEditingStage,
    setEditingId: state.setEditingId,
  }));

  const [isLoading, setIsLoading] = useState(false);

  const {
    addOrRemoveFavorite: handleAddOrRemoveFavorite,
    joinOrLeave: handleJoinOrLeave,
  } = useHandleFavAndJoin({
    tableName: "campaigns",
    userId: user?.id,
    itemId: campaignId,
    setIsLoading,
    isJoined: isLocalJoined,
    isFavorite: isLocalFavorite,
    setIsJoined: setIsLocalJoined,
    setIsFavorite: setIsLocalFavorite,
  });

  return (
    <ToolbarLayout>
      <PacmanLoader color="#bbb" loading={loading} size={12} />
      {!!campaignData && !connected && (
        <Badge
          variant="outline"
          className="text-destructive border-transparent animate-pulse"
        >
          <Unplug className="h-4 w-4" />
        </Badge>
      )}
      {!gameId && (
        <FavoriteButton
          isFavorite={isLocalFavorite}
          onClick={() => handleAddOrRemoveFavorite()}
        />
      )}
      {isOwner && (
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant={editingStage === "campaign" ? "outline" : "default"}
          onClick={() => {
            if (editingStage === "campaign") {
              setEditingStage(null);
              setEditingId(null);
            } else {
              setEditingStage("campaign");
              setEditingId(campaignId);
            }
          }}
        >
          {editingStage === "campaign" ? (
            <Eye className="h-4 w-4" />
          ) : (
            <Pen className="h-4 w-4" />
          )}
          {editingStage === "campaign" ? t("closeEdit") : t("edit")}
        </Button>
      )}
      {!isOwner && !gameId && (
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant="outline"
          onClick={() => handleJoinOrLeave()}
        >
          {isLocalJoined ? t("leave") : t("join")}
        </Button>
      )}
      {campaignData && (
        <CampaignMenu
          campaignData={campaignData}
          isOwner={isOwner}
          gameId={gameId}
        />
      )}

      {isLoading && <OverlayLoading />}
    </ToolbarLayout>
  );
}
