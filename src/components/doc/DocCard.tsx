"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Markdown from "react-markdown";
import { Settings } from "lucide-react";

import { BASE_URL } from "@/config/app";
import { Link } from "@/navigation";
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

import { DocInList } from "@/types/interfaces";

export default function DocCard({ doc }: { doc: DocInList }) {
  const t = useTranslations("DocsPage");

  const user = useSessionUser();
  const isOwner = user?.id === doc.owner_id;

  const passphraseParams = doc.passphrase
    ? `&passphrase=${doc.passphrase}`
    : "";
  const docLinkWithPassphrase = `${BASE_URL}/?doc_id=${doc.id}${passphraseParams}`;

  return (
    <Card className="flex flex-col gap-y-1 w-full min-h-56">
      <CardHeader>
        <CardTitle className="flex items-center gap-1.5 justify-between">
          {doc.title}

          {isOwner && (
            <Link href={`/docs/${doc.id}/info`}>
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
          src={doc.banner_url ?? getBannerUrl(doc.id)}
          alt={doc.title}
          loader={({ src }) => src}
          unoptimized
          fill
        />
        <Avatar className="absolute bottom-2 right-2 border-2 border-border">
          <AvatarImage src={doc.owner?.avatar_url ?? ""} />
          <AvatarFallback>{doc.owner?.display_name ?? "GM"}</AvatarFallback>
        </Avatar>
      </CardContent>
      <CardContent className="grow px-4 pt-2">
        <Markdown className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground">
          {doc.description}
        </Markdown>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              onClick={() => {
                const info = `
**${t("docId")}**: \`${doc.id}\`
**${t("passphrase")}**: \`${doc.passphrase}\`
**${t("docLinkWithPassphrase")}**: ${docLinkWithPassphrase}
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
          <Link href={`/docs/${doc.id}`}>
            <Button variant="secondary">
              {isOwner ? t("editView") : t("view")}
            </Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
