import { useTranslations } from "next-intl";
import GameTabCardLayout from "../GameTabCardLayout";

export default function GameScreen() {
  const t = useTranslations("GamePage");

  return (
    <GameTabCardLayout title={t("screen")} action={<div>Add new screen</div>}>
      Game screen
    </GameTabCardLayout>
  );
}
