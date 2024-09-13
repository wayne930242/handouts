"use client";

import { useTranslations } from "next-intl";
import GameTabCardLayout from "../GameTabCardLayout";
import useGameStore from "@/lib/store/useGameStore";
import AddDocAction from "./AddDocAction";
import { DocInGame } from "@/types/interfaces";
import DocsInGameViewer from "./DocsInGameViewer";

export default function GameScreen() {
  const t = useTranslations("GamePage");

  const { gameData } = useGameStore((state) => ({
    gameData: state.gameData,
  }));
  const docs = gameData?.docs ?? [];

  return (
    <GameTabCardLayout
      title={t("docs")}
      action={
        <AddDocAction
          docs={docs.map((d) => d.doc as DocInGame)}
          gameId={gameData?.id!}
        />
      }
    >
      {docs.length === 0 && (
        <div className="text-center h-96 flex items-center justify-center">
          <div className="font-bold text-muted-foreground">{t("noDocs")}</div>
        </div>
      )}
      {docs.length > 0 && (
        <DocsInGameViewer
          docs={docs.map((d) => d.doc as DocInGame)}
          gameId={gameData?.id!}
        />
      )}
    </GameTabCardLayout>
  );
}
