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
import { FullCampaignData } from "@/types/interfaces";
import { Pencil } from "lucide-react";
import { Link } from "@/navigation";
import { BASE_URL } from "@/config/app";

export default function CampaignCard({ campaign }: { campaign: FullCampaignData }) {
  const t = useTranslations("CampaignCard");

  const passphraseParams = campaign.passphrase
    ? `&passphrase=${campaign.passphrase}`
    : "";
  const campaignLink = `${BASE_URL}/?campaign_id=${campaign.id}`;
  const campaignLinkWithPassphrase = `${BASE_URL}/?campaign_id=${campaign.id}${passphraseParams}`;

  return (
    <Card className="flex flex-col gap-y-1 w-full min-h-56">
      <CardHeader className="cursor-pointer hover:bg-accent">
        <Link
          href={`/campaigns/info/${campaign.id}`}
          className="flex items-center gap-1.5 justify-between"
        >
          <CardTitle>{campaign.name}</CardTitle>
          <Pencil className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="grow">
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
**${t("campaignLinkWithPassphrase")}**: ${campaignLinkWithPassphrase}
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
