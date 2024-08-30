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
import { Rule } from "@/types/interfaces";
import { Pencil } from "lucide-react";
import { Link } from "@/navigation";
import { BASE_URL } from "@/config/app";

export default function RuleCard({ rule }: { rule: Rule }) {
  const t = useTranslations("RulesPage");

  const passphraseParams = rule.passphrase
    ? `&passphrase=${rule.passphrase}`
    : "";
  const ruleLink = `${BASE_URL}/?rule_id=${rule.id}`;
  const ruleLinkWithPassphrase = `${BASE_URL}/?rule_id=${rule.id}${passphraseParams}`;

  return (
    <Card className="flex flex-col gap-y-1 w-full min-h-56">
      <CardHeader className="cursor-pointer hover:bg-accent">
        <Link
          href={`/rules/info/${rule.id}`}
          className="flex items-center gap-1.5 justify-between"
        >
          <CardTitle>{rule.title}</CardTitle>
          <Pencil className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent className="grow relative h-32 overflow-hidden">
        {rule.banner_url && (
          <Image
            className="object-cover"
            src={rule.banner_url}
            alt={rule.title}
            loader={({ src }) => src}
            unoptimized
            fill
          />
        )}
      </CardContent>
      <CardContent className="grow relative overflow-hidden py-2">
        <CardDescription className="bg-transparent">
          {rule.description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              onClick={() => {
                const info = `
**${t("ruleId")}**: \`${rule.id}\`
**${t("passphrase")}**: \`${rule.passphrase}\`
**${t("ruleLink")}**: ${ruleLink}
**${t("ruleLinkWithPassphrase")}**: ${ruleLinkWithPassphrase}
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
          <Link href={`/rules/${rule.id}`}>
            <Button variant="secondary">{t("editView")}</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
