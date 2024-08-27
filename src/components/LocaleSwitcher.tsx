"use client";

import { useLocale, useTranslations } from "next-intl";
import { Link, usePathname } from "@/navigation";
import { Button } from "./ui/button";

export default function LocaleSwitcher() {
  const t = useTranslations("LocaleSwitcher");
  const locale = useLocale();
  const otherLocale = locale === "en" ? "tw" : "en";
  const pathname = usePathname();

  return (
    <Link href={pathname} locale={otherLocale}>
      <Button variant="ghost" size="sm">
        {t("switchLocale", { locale: otherLocale })}
      </Button>
    </Link>
  );
}
