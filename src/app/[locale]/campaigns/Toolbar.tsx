"use client";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { useTranslations } from "next-intl";

export default function CampaignlistToolbar() {
  const { setPassphraseDialog } = useAppStore((state) => ({
    setPassphraseDialog: state.setPassphraseDialog,
  }));
  const t = useTranslations("CampaignlistToolbar");

  return (
    <div className="flex justify-between items-center w-full px-2">
      <div className="grow-1">
        <Button
          variant="outline"
          onClick={() => {
            setPassphraseDialog(true);
          }}
        >
          {t("joinCampaign")}
        </Button>
      </div>
      <div>
        <Link href="/campaigns/info/new">
          <Button>{t("newCampaign")}</Button>
        </Link>
      </div>
    </div>
  );
}
