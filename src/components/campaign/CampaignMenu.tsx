"use client";

import { FileDown, HardDriveUpload, Info, Settings, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Campaign } from "@/types/interfaces";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, ItemButton } from "@/components/ui/button";
import CampaignImporter from "@/lib/supabase/CampaignImporter";
import { useRouter } from "@/navigation";
import { useClient } from "@/lib/supabase/client";
import { useRef, useState } from "react";
import { toast } from "../ui/use-toast";
import OverlayLoading from "../layout/OverlayLoading";

interface Props {
  campaignData: Campaign;
  isOwner?: boolean;
  gameId?: string;
}

export default function CampaignMenu({ campaignData, isOwner, gameId }: Props) {
  const t = useTranslations("CampaignMenu");
  const [loading, setLoading] = useState(false);

  const handleExport = async () => {
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
  };

  const router = useRouter();
  const supabase = useClient();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Toggle campaign menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isOwner && (
          <Link href={`/campaigns/${campaignData.id}/info`}>
            <ItemButton>
              <Info className="h-4 w-4" />
              {t("info")}
            </ItemButton>
          </Link>
        )}

        {isOwner && (
          <ItemButton onClick={handleExport}>
            <FileDown className="h-4 w-4" />
            <span>{t("export")}</span>
          </ItemButton>
        )}

        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <Link href={`/campaigns/${campaignData.id}/info`}>
              <ItemButton variant="destructive">
                <X className="h-4 w-4" />
                {t("delete")}
              </ItemButton>
            </Link>
          </>
        )}
      </DropdownMenuContent>
      {loading && <OverlayLoading />}
    </DropdownMenu>
  );
}
