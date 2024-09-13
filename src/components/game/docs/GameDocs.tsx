import { useTranslations } from "next-intl";
import GameTabCardLayout from "../GameTabCardLayout";
import useGameStore from "@/lib/store/useGameStore";
import DocViewer from "../../doc/DocViewer";
import AddDocAction from "./AddDocAction";
import { DocInGame } from "@/types/interfaces";

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
      {docs.map((d) => (
        <DocViewer doc={d.doc!} key={d.doc!.id} />
      ))}
    </GameTabCardLayout>
  );
}
