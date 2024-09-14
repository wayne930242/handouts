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
}

export default function CampaignMenu({ campaignData, isOwner }: Props) {
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

  const handleImport = async (file: File) => {
    if (!file) {
      inputRef.current!.value = "";
      return;
    }
    const json = await file.text();
    if (!json) return;

    setLoading(true);
    try {
      const importingCampaignData = JSON.parse(json) as Campaign;
      const campaignImporter = new CampaignImporter(
        supabase,
        importingCampaignData
      );
      const newCampaign = await campaignImporter.importCampaign();
      router.push(`/campaigns/${newCampaign.id}`);
    } catch (error) {
      toast({
        title: t("importFailed"),
        description: t("importFailedDescription"),
        variant: "destructive",
      });
    }
    setLoading(false);

    inputRef.current!.value = "";
  };
  const inputRef = useRef<HTMLInputElement>(null);

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
          <ItemButton onClick={() => inputRef.current?.click()}>
            <HardDriveUpload className="h-4 w-4" />
            <span>{t("import")}</span>
            <input
              type="file"
              hidden
              ref={inputRef}
              onChange={(e) => handleImport(e.target.files![0])}
            />
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
