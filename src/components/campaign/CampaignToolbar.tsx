"use client";
import { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { Eye, Pen, Unplug } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useDeleteMutation,
  useInsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query";

import useAppStore from "@/lib/store/useAppStore";
import { useClient } from "@/lib/supabase/client";
import useCampaignStore from "@/lib/store/useCampaignStore";
import useSessionUser from "@/lib/hooks/useSession";
import { useRouter } from "@/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import CampaignMenu from "./CampaignMenu";
import OverlayLoading from "@/components/layout/OverlayLoading";
import FavoriteButton from "@/components/toolbar/FavoriteButton";

export default function Toolbar({
  campaignId,
  isOwner,
  isFavorite,
  isJoined,
}: {
  campaignId: string;
  isOwner?: boolean;
  isFavorite?: boolean;
  isJoined?: boolean;
}) {
  const supabase = useClient();
  const user = useSessionUser();
  const router = useRouter();
  const t = useTranslations("Toolbar");

  const [isLocalJoined, setIsLocalJoined] = useState(false);
  const [isLocalFavorite, setIsLocalFavorite] = useState(false);

  useEffect(() => {
    setIsLocalJoined(!!isJoined);
  }, [setIsLocalJoined, isJoined]);

  useEffect(() => {
    setIsLocalFavorite(!!isFavorite);
  }, [setIsLocalFavorite, isFavorite]);

  const { editingCampaign, setEditingCampaign } = useAppStore((state) => ({
    editingCampaign: state.editingCampaign,
    setEditingCampaign: state.setEditingCampaign,
  }));
  const { campaignData, connected, loading } =
    useCampaignStore((state) => ({
      campaignData: state.campaignData,
      connected: state.connected,
      loading: state.loading,
    }));

  const { mutateAsync: joinCampaign, isPending: isJoining } = useInsertMutation(
    supabase.from("campaign_players"),
    ["campaign_id", "user_id"]
  );
  const { mutateAsync: leaveCampaign, isPending: isLeaving } =
    useDeleteMutation(supabase.from("campaign_players"), [
      "campaign_id",
      "user_id",
    ]);
  const { mutateAsync: addFavorite, isPending: isFavoriting } =
    useInsertMutation(supabase.from("user_campaign_favorites"), [
      "campaign_id",
      "user_id",
    ]);
  const { mutateAsync: removeFavorite, isPending: isUnfavoriting } =
    useDeleteMutation(supabase.from("user_campaign_favorites"), [
      "campaign_id",
      "user_id",
    ]);
  const isLoading = isJoining || isLeaving || isFavoriting || isUnfavoriting;

  const handleAddOrRemoveFavorite = async () => {
    if (!campaignData) return;
    if (!user?.id) {
      router.push("/login");
      return;
    }

    if (!isLocalJoined && !isLocalFavorite) {
      await joinCampaign([
        {
          campaign_id: campaignData.id,
          user_id: user.id,
          role: isOwner ? "OWNER" : "PLAYER",
        },
      ]).then(() => {
        setIsLocalJoined(true);
      });
    }

    if (isLocalFavorite) {
      await removeFavorite({
        campaign_id: campaignData.id,
        user_id: user.id,
      }).then(() => {
        setIsLocalFavorite(false);
      });
    } else {
      await addFavorite([
        {
          campaign_id: campaignData.id,
          user_id: user.id,
        },
      ]).then(() => {
        setIsLocalFavorite(true);
      });
    }
  };

  const handleJoinOrLeave = async () => {
    if (!campaignData) return;
    if (!user?.id) {
      router.push("/login");
      return;
    }
    if (isLocalJoined) {
      await leaveCampaign({
        campaign_id: campaignData.id,
        user_id: user.id,
      }).then(() => {
        setIsLocalJoined(false);
      });
    } else {
      await joinCampaign([
        {
          campaign_id: campaignData.id,
          role: isOwner ? "OWNER" : "PLAYER",
          user_id: user.id,
        },
      ]).then(() => {
        setIsLocalJoined(true);
      });
    }
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="grow-1 flex gap-2 items-center"></div>
      <div className="flex gap-2 items-center">
        <PacmanLoader color="#bbb" loading={loading} size={12} />
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
          onClick={() => handleAddOrRemoveFavorite()}
        />
        {isOwner && (
          <Button
            size="sm"
            className="flex gap-2 items-center"
            variant={editingCampaign ? "outline" : "default"}
            onClick={() => setEditingCampaign(!editingCampaign)}
          >
            {editingCampaign ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Pen className="h-4 w-4" />
            )}
            {editingCampaign ? t("closeEdit") : t("edit")}
          </Button>
        )}
        {!isOwner && (
          <Button
            size="sm"
            className="flex gap-2 items-center"
            variant="outline"
            onClick={() => handleJoinOrLeave()}
          >
            {isLocalJoined ? t("leave") : t("join")}
          </Button>
        )}
        {campaignData && <CampaignMenu campaignData={campaignData} />}
      </div>
      {isLoading && <OverlayLoading />}
    </div>
  );
}
