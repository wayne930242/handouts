import { useTranslations } from "next-intl";
import GameTabCardLayout from "../GameTabCardLayout";

export default function GameNote() {
  const t = useTranslations("GamePage");

  return (
    <GameTabCardLayout title={t("notes")} action={<div>Add new note</div>}>
      Game notes
    </GameTabCardLayout>
  );
}
