"use client";

import { useTranslations } from "next-intl";
import { useRef, useState, useTransition } from "react";

import { useRouter } from "@/navigation";
import { Button } from "@/components/ui/button";
import { useClient } from "@/lib/supabase/client";
import CampaignImporter from "@/lib/supabase/CampaignImporter";
import { Campaign } from "@/types/interfaces";
import OverlayLoading from "../layout/OverlayLoading";

export default function ImportCampaignButton() {
  const t = useTranslations("CampaignPage");
  const router = useRouter();
  const supabase = useClient();
  const [isLoading, setIsLoading] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleImport = async (file: File) => {
    if (!file) {
      inputRef.current!.value = "";
      return;
    }
    setIsLoading(true);
    const json = await file.text();
    if (!json) return;

    const importingCampaignData = JSON.parse(json) as Campaign;
    const campaignImporter = new CampaignImporter(
      supabase,
      importingCampaignData
    );
    const newCampaign = await campaignImporter.importCampaign();

    startTransition(() => {
      router.push(`/campaigns/${newCampaign.id}`);
    });
  };
  const inputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        onClick={() => {
          inputRef.current?.click();
        }}
      >
        {t("importCampaign")}
      </Button>
      <input
        type="file"
        hidden
        ref={inputRef}
        onChange={(e) => handleImport(e.target.files![0])}
      />
      {(isPending || isLoading) && <OverlayLoading />}
    </div>
  );
}
