"use client";
import { PacmanLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import {
  ArrowLeft,
  Eye,
  FileDown,
  HardDriveUpload,
  Pen,
  Unplug,
} from "lucide-react";
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
  const {
    campaignData,
    connected,
    setupRealtimeSubscription,
    resetConnectedAttempts,
  } = useCampaignStore();
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
        <Button
          variant="destructive"
          size="sm"
          className="flex gap-2 items-center"
          disabled
        >
          <HardDriveUpload className="h-4 w-4" />
          <span className="sr-only">{t("import")}</span>
        </Button>
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant="secondary"
          onClick={() => {
            // Convert campaignData to JSON string
            const jsonString = JSON.stringify(campaignData, null, 2);

            // Create a Blob with the JSON data
            const blob = new Blob([jsonString], { type: "application/json" });

            // Create a temporary URL for the Blob
            const url = URL.createObjectURL(blob);

            // Create a temporary anchor element and trigger the download
            const link = document.createElement("a");
            link.href = url;
            link.download = `campaign-${campaignData?.id}.json`;
            document.body.appendChild(link);
            link.click();

            // Clean up
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
          }}
        >
          <FileDown className="h-4 w-4" />
          <span className="sr-only">{t("export")}</span>
        </Button>
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
      </div>
    </div>
  );
}
