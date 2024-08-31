"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
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
import { Doc } from "@/types/interfaces";
import { Pencil } from "lucide-react";
import { Link } from "@/navigation";
import { BASE_URL } from "@/config/app";

export default function DocCard({ doc }: { doc: Doc }) {
  const t = useTranslations("DocsPage");

  const passphraseParams = doc.passphrase
    ? `&passphrase=${doc.passphrase}`
    : "";
  const docLinkWithPassphrase = `${BASE_URL}/?doc_id=${doc.id}${passphraseParams}`;

  return (
    <Card className="flex flex-col gap-y-1 w-full min-h-56">
      <CardHeader className="cursor-pointer hover:bg-accent">
        <Link
          href={`/docs/${doc.id}/info`}
          className="flex items-center gap-1.5 justify-between"
        >
          <CardTitle>{doc.title}</CardTitle>
          <Pencil className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="grow relative h-32 overflow-hidden">
        {doc.banner_url && (
          <Image
            className="object-cover"
            src={doc.banner_url}
            alt={doc.title}
            loader={({ src }) => src}
            unoptimized
            fill
          />
        )}
      </CardContent>
      <CardContent className="grow relative overflow-hidden py-2">
        <CardDescription className="bg-transparent">
          {doc.description}
        </CardDescription>
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
            <Button variant="secondary">{t("editView")}</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
