"use client";
import { PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { ArrowLeft, Eye, Pen, Unplug } from "lucide-react";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Badge } from "@/components/ui/badge";
import { useClient } from "@/lib/supabase/client";
import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import CampaignMenu from "./CampaignMenu";

export default function Toolbar({
  campaignId,
  isOwner,
  isFavorite,
}: {
  campaignId: string;
  isOwner?: boolean;
  isFavorite?: boolean;
}) {
  const supabase = useClient();
  const t = useTranslations("Toolbar");

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

  return (
    <div className="flex justify-between items-center w-full">
      <div className="grow-1 flex gap-2 items-center">
        {/* <Link href="/campaigns">
          <Button
            className="flex gap-1.5 items-center"
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("backToList")}</span>
          </Button>
        </Link> */}
      </div>
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
        {campaignData && <CampaignMenu campaignData={campaignData} />}
      </div>
    </div>
  );
}
