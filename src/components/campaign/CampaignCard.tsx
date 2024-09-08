"use client";
import { useTranslations } from "next-intl";
import { Settings } from "lucide-react";
import Image from "next/image";
import Markdown from "react-markdown";

import { Link } from "@/navigation";
import { BASE_URL } from "@/config/app";
import { getBannerUrl } from "@/lib/bannerUrl";
import useSessionUser from "@/lib/hooks/useSession";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CampaignInList } from "@/types/interfaces";

export default function CampaignCard({
  campaign,
}: {
  campaign: CampaignInList;
}) {
  const t = useTranslations("CampaignCard");
  const user = useSessionUser();
  const isOwner = user?.id === campaign.gm_id;

  const passphraseParams = campaign.passphrase
    ? `&passphrase=${campaign.passphrase}`
    : "";
  const campaignLink = `${BASE_URL}/?campaign_id=${campaign.id}`;
  const campaignLinkWithPassphrase = `${campaignLink}${passphraseParams}`;
  const info = `**${t("campaignId")}**: \`${campaign.id}\`
  **${t("passphrase")}**: \`${campaign.passphrase}\`
  **${t("campaignLinkWithPassphrase")}**: ${campaignLinkWithPassphrase}`;

  return (
    <Card className="flex flex-col gap-y-1 w-full min-h-56">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 justify-between">
          {campaign.name}

          {isOwner && (
            <Link href={`/campaigns/${campaign.id}/info`}>
              <Button size="icon" variant="ghost">
                <Settings className="h-5 w-5" />
              </Button>
            </Link>
          )}
        </CardTitle>
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
        <Avatar className="absolute bottom-2 right-2 border-2 border-border">
          <AvatarImage src={campaign.gm?.avatar_url ?? ""} />
          <AvatarFallback>{campaign.gm?.display_name ?? "GM"}</AvatarFallback>
        </Avatar>
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
            <Button variant="secondary">
              {isOwner ? t("editView") : t("view")}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
