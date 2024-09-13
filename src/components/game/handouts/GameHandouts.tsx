import { useTranslations } from "next-intl";
import GameTabCardLayout from "../GameTabCardLayout";

export default function GameHandouts() {
  const t = useTranslations("GamePage");

  return (
    <GameTabCardLayout
      title={t("handouts")}
      action={<div>Add new handout</div>}
    >
      Game handouts
    </GameTabCardLayout>
  );
}
