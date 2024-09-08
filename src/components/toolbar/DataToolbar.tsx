"use client";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { useTranslations } from "next-intl";
import { PassphraseDialogKey } from "@/types/interfaces";

const SaddledKeyMap = {
  campaigns: "Campaign",
  games: "Game",
  docs: "Doc",
} as const;

export default function DataToolbar({
  tableKey,
}: {
  tableKey: PassphraseDialogKey;
}) {
  const { setAddCampaignDialog } = useAppStore((state) => ({
    setAddCampaignDialog: state.setAddPassphraseDialog,
  }));
  const t = useTranslations("DataToolbar");

  const saddledKey = SaddledKeyMap[tableKey];

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
        <Link href={`/${tableKey}/new/info`}>
          <Button>{t(`new${saddledKey}`)}</Button>
        </Link>
      </div>
    </div>
  );
}
