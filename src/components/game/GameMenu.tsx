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
import { GameInList } from "@/types/interfaces";
import Link from "next/link";

interface Props {
  game: GameInList;
  isOwner?: boolean;
}

export default function GameMenu({ game, isOwner }: Props) {
  const t = useTranslations("GameMenu");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary" size="icon" className="rounded-full">
          <Settings className="h-5 w-5" />
          <span className="sr-only">Toggle game menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {isOwner && (
          <Link href={`/games/${game.id}/info`}>
            <ItemButton>
              <Info className="h-4 w-4" />
              {t("info")}
            </ItemButton>
          </Link>
        )}

        {isOwner && (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSeparator />
            <Link href={`/games/${game.id}/info`}>
              <ItemButton variant="destructive">
                <X className="h-4 w-4" />
                {t("delete")}
              </ItemButton>
            </Link>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
