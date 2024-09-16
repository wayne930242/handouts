"use client";
import { Link } from "@/navigation";
import { Button } from "@/components/ui/button";
import { useTranslations } from "next-intl";
import { PassphraseDialogKey } from "@/types/interfaces";
import { RefreshCw } from "lucide-react";

const SaddledKeyMap = {
  campaigns: "Campaign",
  games: "Game",
  docs: "Doc",
} as const;

export default function DataToolbar({
  tableKey,
  children,
  isRefreshing,
  handleRefresh,
}: {
  tableKey: PassphraseDialogKey;
  children?: React.ReactNode;
  isRefreshing?: boolean;
  handleRefresh?: () => void;
}) {
  const t = useTranslations("DataToolbar");

  const saddledKey = SaddledKeyMap[tableKey];

  return (
    <div className="flex justify-between items-center w-full px-2">
      <div className="grow-1">{children}</div>
      <div className="flex gap-2">
        {handleRefresh && (
          <Button
            onClick={handleRefresh}
            size="icon"
            variant="outline"
            disabled={isRefreshing}
          >
            <RefreshCw className="h-5 w-5" />
          </Button>
        )}
        <Link href={`/${tableKey}/new/info`}>
          <Button>{t(`new${saddledKey}`)}</Button>
        </Link>
      </div>
    </div>
  );
}
