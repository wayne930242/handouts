"use client";

import { Settings } from "lucide-react";
import Image from "next/image";
import Markdown from "react-markdown";

import { BASE_URL } from "@/config/app";
import { Button } from "../ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getBannerUrl } from "@/lib/bannerUrl";
import { toast } from "../ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { useTranslations } from "next-intl";
import useSessionUser from "@/lib/hooks/useSession";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import OverlayLoading from "../layout/OverlayLoading";

export default function ItemCard({
  tableName,
  ownerInfo,
  bannerUrl,
  title,
  description,
  id,
  passphrase,
}: Props) {
  const t = useTranslations("ItemCard");
  const user = useSessionUser();
  const isOwner = user?.id === ownerInfo?.id;

  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const passphraseParams = passphrase ? `?passphrase=${passphrase}` : "";
  const link = `${BASE_URL}/${tableName}/${id}${passphraseParams}`;

  return (
    <Card className="flex flex-col gap-y-1 w-full min-h-56">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 justify-between">
          {title}

          {isOwner && (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => {
                startTransition(() => {
                  router.push(`/${tableName}/${id}/info`);
                });
              }}
            >
              <Settings className="h-5 w-5" />
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="grow relative overflow-hidden aspect-[24/9]">
        <Image
          className="object-cover"
          src={!bannerUrl ? getBannerUrl(id) : bannerUrl}
          alt={title}
          loader={({ src }) => src}
          unoptimized
          fill
        />
        <Avatar className="absolute bottom-2 right-2 border-2 border-border">
          <AvatarImage src={ownerInfo?.avatar_url ?? ""} />
          <AvatarFallback>{ownerInfo?.display_name ?? "GM"}</AvatarFallback>
        </Avatar>
      </CardContent>
      <CardContent className="grow px-4 pt-2">
        <Markdown className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
          {description}
        </Markdown>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(link);
                toast({
                  title: t("infoTitle"),
                  description: t("infoDescription"),
                });
              }}
            >
              {t("copyLink")}
            </Button>
          </div>
          <Button
            variant="secondary"
            onClick={() => {
              startTransition(() => {
                router.push(`/${tableName}/${id}`);
              });
            }}
          >
            {t("editView")}
          </Button>
        </div>
      </CardFooter>
      {isPending && <OverlayLoading />}
    </Card>
  );
}

interface Props {
  tableName: "docs" | "games" | "campaigns";
  ownerInfo: {
    id: string | null;
    display_name?: string | null;
    avatar_url?: string | null;
  } | null;
  bannerUrl: string | null;
  title: string;
  description: string | null;
  id: string;
  passphrase?: string | null;
}
