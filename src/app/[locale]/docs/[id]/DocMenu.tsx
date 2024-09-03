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
import { Doc } from "@/types/interfaces";
import Link from "next/link";

interface Props {
  doc: Doc;
  isOwner?: boolean;
}

export default function DocMenu({ doc, isOwner }: Props) {
  const t = useTranslations("DocMenu");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Toggle doc menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <Link href={`/docs/${doc.id}/info`}>
          <ItemButton>
            <Info className="h-4 w-4" />
            {t("info")}
          </ItemButton>
        </Link>

        <DropdownMenuSeparator />
        <Link href={`/docs/${doc.id}/info`}>
          <ItemButton variant="destructive">
            <X className="h-4 w-4" />
            {t("delete")}
          </ItemButton>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
