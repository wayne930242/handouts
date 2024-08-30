"use client";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { useTranslations } from "next-intl";
import { PassphraseDialogKey } from "@/types/interfaces";

export default function DataToolbar({
  tableKey,
}: {
  tableKey: PassphraseDialogKey;
}) {
  const { setAddCampaignDialog } = useAppStore((state) => ({
    setAddCampaignDialog: state.setAddPassphraseDialog,
  }));
  const t = useTranslations("DataToolbar");

  const saddledKey = tableKey === "campaigns" ? "Campaign" : "Rule";

  return (
    <div className="flex justify-between items-center w-full px-2">
      <div className="grow-1">
        <Button
          variant="outline"
          onClick={() => {
            setAddCampaignDialog(tableKey);
          }}
        >
          {t(`join${saddledKey}`)}
        </Button>
      </div>
      <div>
        <Link href={`/${tableKey}/info/new`}>
          <Button>{t(`new${saddledKey}`)}</Button>
        </Link>
      </div>
    </div>
  );
}
