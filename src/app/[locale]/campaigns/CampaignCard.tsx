"use client";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { CampaignBase } from "@/types/interfaces";
import { Pencil } from "lucide-react";
import { Link } from "@/navigation";

export default function CampaignCard({ campaign }: { campaign: CampaignBase }) {
  const t = useTranslations("CampaignCard");

  return (
    <Card>
      <CardHeader className="cursor-pointer hover:bg-accent">
        <Link
          href={`/campaigns/info/${campaign.id}`}
          className="flex items-center gap-1.5 justify-between"
        >
          <CardTitle>{campaign.name}</CardTitle>
          <Pencil className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <CardDescription>{campaign.description}</CardDescription>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              onClick={() => {
                const info = `
**${t("campaignId")}**: \`${campaign.id}\`
**${t("passphrase")}**: \`${campaign.passphrase}\`
**${t("campaignLink")}**: https://handouts.wayneh.tw/campaigns/${campaign.id}
`;
                navigator.clipboard.writeText(info);
                toast({
                  title: t("infoTitle"),
                  description: t("infoDescription"),
                });
              }}
            >
              {t("copyInfo")}
            </Button>
          </div>
          <Link href={`/campaigns/${campaign.id}`}>
            <Button variant="secondary">{t("editView")}</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
