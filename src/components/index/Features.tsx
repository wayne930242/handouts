import { useTranslations } from "next-intl";
import FeatureCard from "./FeatureCard";
import { BookHeart, LandPlot, Swords } from "lucide-react";

export default function Features() {
  const t = useTranslations("Index");

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-h-64 auto-rows-fr">
      <FeatureCard
        title={t("campaignsTitle")}
        description={t("campaignsDescription")}
        icon={<LandPlot className="h-8 w-8" />}
        href="/campaigns"
      />
      <FeatureCard
        title={t("docsTitle")}
        description={t("docsDescription")}
        icon={<BookHeart className="h-8 w-8" />}
        href="/docs"
      />
      <FeatureCard
        title={t("gamesTitle")}
        description={t("gamesDescription")}
        icon={<Swords className="h-8 w-8" />}
        href="/generators"
      />
    </div>
  );
}
