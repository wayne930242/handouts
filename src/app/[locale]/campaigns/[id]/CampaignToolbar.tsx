"use client";
import { PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { ArrowLeft, Eye, Pen, Unplug } from "lucide-react";
import useCampaignStore from "@/lib/store/useCampaignStore";
import { Badge } from "@/components/ui/badge";
import { createClient } from "@/lib/supabase/client";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";

export default function Toolbar({
  campaignId,
  isAuthorized,
}: {
  campaignId: string;
  isAuthorized: boolean;
}) {
  const t = useTranslations("Toolbar");
  const { editingCampaign, setEditingCampaign } = useAppStore();
  const { connected, setupRealtimeSubscription, resetConnectedAttempts } =
    useCampaignStore();
  const { loading } = useCampaignStore();
  const supabase = createClient();

  return (
    <div className="flex justify-between items-center w-full">
      <div className="grow-1 flex gap-2 items-center">
        <Link href="/campaigns">
          <Button
            className="flex gap-1.5 items-center"
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("backToList")}</span>
          </Button>
        </Link>
      </div>
      <div className="flex gap-1.5 items-center">
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
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant={editingCampaign ? "outline" : "secondary"}
          onClick={() => setEditingCampaign(!editingCampaign)}
        >
          {editingCampaign ? (
            <Eye className="h-4 w-4" />
          ) : (
            <Pen className="h-4 w-4" />
          )}
          {editingCampaign ? t("closeEdit") : t("edit")}
        </Button>
      </div>
    </div>
  );
}
