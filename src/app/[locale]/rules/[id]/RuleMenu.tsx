"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button, ItemButton } from "@/components/ui/button";
import { Info, Settings, X } from "lucide-react";
import { useTranslations } from "next-intl";
import { Rule } from "@/types/interfaces";
import Link from "next/link";

interface Props {
  rule: Rule;
}

export default function RuleMenu({ rule }: Props) {
  const t = useTranslations("RuleMenu");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Toggle rule menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={`/rules/${rule.id}/info`}>
          <ItemButton>
            <Info className="h-4 w-4" />
            {t("info")}
          </ItemButton>
        </Link>

        <DropdownMenuSeparator />
        <Link href={`/rules/${rule.id}/info`}>
          <ItemButton className="text-destructive">
            <X className="h-4 w-4" />
            {t("delete")}
          </ItemButton>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
