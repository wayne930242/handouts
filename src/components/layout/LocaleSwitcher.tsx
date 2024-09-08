"use client";
import React, { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useParams, useSearchParams } from "next/navigation";
import { usePathname, useRouter } from "@/navigation";
import { locales } from "@/navigation";
import OverlayLoading from "@/components/layout/OverlayLoading";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function LocaleSwitcher(): React.ReactElement {
  const t = useTranslations("LocaleSwitcher");
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const locale = useLocale();
  const pathname = usePathname();
  const params = useParams();
  const searchParams = useSearchParams();

  const handleLocaleChange = (nextLocale: string): void => {
    startTransition(() => {
      let newPath = pathname;

      Object.entries(params as Record<string, string>).forEach(
        ([key, value]) => {
          newPath = newPath.replace(`[${key}]`, value);
        }
      );

      const queryString = searchParams.toString();
      if (queryString) {
        newPath += `?${queryString}`;
      }

      router.replace(newPath, { locale: nextLocale as any });
    });
  };

  return (
    <Select onValueChange={handleLocaleChange}>
      <SelectTrigger className="w-18 px-2 h-9 border-transparent focus:ring-transparent">
        <SelectValue placeholder={t("switchLocale", { locale })} />
      </SelectTrigger>
      <SelectContent>
        {locales.map((l) => (
          <SelectItem key={l} value={l}>
            {t("switchLocale", { locale: l })}
          </SelectItem>
        ))}
      </SelectContent>

      {isPending && <OverlayLoading />}
    </Select>
  );
}
