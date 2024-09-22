import { useTranslations } from "next-intl";
import GameTabCardLayout from "../GameTabCardLayout";
import useGameStore from "@/lib/store/useGameStore";

export default function GameNote() {
  const t = useTranslations("GamePage");

  const { gameData } = useGameStore((state) => ({
    gameData: state.gameData,
  }));
  const notes = gameData?.notes ?? [];

  return <GameTabCardLayout title={t("notes")}>Game notes</GameTabCardLayout>;
}
