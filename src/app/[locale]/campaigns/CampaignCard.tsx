"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { FullCampaignData } from "@/types/interfaces";
import { Settings } from "lucide-react";
import { Link } from "@/navigation";
import { BASE_URL } from "@/config/app";
import Markdown from "react-markdown";
import { getBannerUrl } from "@/lib/bannerUrl";

export default function CampaignCard({
  campaign,
}: {
  campaign: FullCampaignData;
}) {
  const t = useTranslations("CampaignCard");

  const passphraseParams = campaign.passphrase
    ? `&passphrase=${campaign.passphrase}`
    : "";
  const campaignLinkWithPassphrase = `${BASE_URL}/?campaign_id=${campaign.id}${passphraseParams}`;

  return (
    <Card className="flex flex-col gap-y-1 w-full min-h-56">
      <CardHeader className="cursor-pointer hover:bg-accent">
        <Link
          href={`/campaigns/${campaign.id}/info`}
          className="flex items-center gap-1.5 justify-between"
        >
          <CardTitle>{campaign.name}</CardTitle>
          <Settings className="h-5 w-5" />
        </Link>
      </CardHeader>
      <CardContent className="grow relative overflow-hidden aspect-[24/9]">
        <Image
          className="object-cover"
          src={campaign.banner_url ?? getBannerUrl(campaign.id)}
          alt={campaign.name}
          loader={({ src }) => src}
          unoptimized
          fill
        />
      </CardContent>
      <CardContent className="grow px-4 pt-2">
        <Markdown className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
          {campaign.description}
        </Markdown>
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
