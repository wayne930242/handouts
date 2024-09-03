"use client";
import { PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { Eye, Pen, Unplug } from "lucide-react";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Badge } from "@/components/ui/badge";
import { useClient } from "@/lib/supabase/client";
import { useTranslations } from "next-intl";
import CampaignMenu from "./CampaignMenu";
import useSession from "@/lib/hooks/useSession";
import { useEffect, useState } from "react";
import OverlayLoading from "@/components/OverlayLoading";
import { useRouter } from "next/navigation";
import FavoriteButton from "@/components/FavoriteButton";

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
  const session = useSession();
  const router = useRouter();
  const t = useTranslations("Toolbar");

  const [isLoading, setIsLoading] = useState(false);
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
  const {
    campaignData,
    connected,
    setupRealtimeSubscription,
    resetConnectedAttempts,
    loading,
  } = useCampaignStore((state) => ({
    campaignData: state.campaignData,
    connected: state.connected,
    setupRealtimeSubscription: state.setupRealtimeSubscription,
    resetConnectedAttempts: state.resetConnectedAttempts,
    loading: state.loading,
  }));

  const handleAddOrRemoveFavorite = async () => {
    if (!campaignData) return;
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    setIsLoading(true);

    if (!isLocalJoined && !isLocalFavorite) {
      const { error } = await supabase
        .from("campaign_players")
        .insert({
          campaign_id: campaignData.id,
          user_id: session.user.id,
          role: isOwner ? "OWNER" : "PLAYER",
        })
        .select();
      if (!error) {
        setIsLocalJoined(true);
      }
    }

    if (isLocalFavorite) {
      const { error } = await supabase
        .from("user_campaign_favorites")
        .delete()
        .eq("campaign_id", campaignData.id)
        .eq("user_id", session.user.id);
      if (!error) {
        setIsLocalFavorite(false);
      }
    } else {
      const { error } = await supabase
        .from("user_campaign_favorites")
        .insert({
          campaign_id: campaignData.id,
          user_id: session.user.id,
        })
        .select();
      if (!error) {
        setIsLocalFavorite(true);
      }
    }
    setIsLoading(false);
  };

  const handleJoinOrLeave = async () => {
    if (!campaignData) return;
    if (!session?.user?.id) {
      router.push("/login");
      return;
    }
    setIsLoading(true);

    if (isLocalJoined) {
      const { error } = await supabase
        .from("campaign_players")
        .delete()
        .eq("campaign_id", campaignData.id)
        .eq("user_id", session.user.id);
      if (!error) {
        setIsLocalJoined(false);
      }
    } else {
      const { error } = await supabase
        .from("campaign_players")
        .insert({
          campaign_id: campaignData.id,
          role: isOwner ? "OWNER" : "PLAYER",
          user_id: session.user.id,
        })
        .select();
      if (!error) {
        setIsLocalJoined(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="grow-1 flex gap-2 items-center"></div>
      <div className="flex gap-2 items-center">
        <PacmanLoader color="#bbb" loading={loading} size={12} />
        {!connected && (
          <Badge
            variant="outline"
            className="text-destructive border-transparent animate-pulse cursor-pointer"
            onClick={() => {
              resetConnectedAttempts();
              setupRealtimeSubscription(supabase, campaignId);
            }}
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
