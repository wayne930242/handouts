import { useTranslations } from "next-intl";
import FeatureCard from "./FeatureCard";
import { BookHeart, Swords } from "lucide-react";

export default function Features() {
  const t = useTranslations("Index");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 w-full min-h-64">
      <FeatureCard
        title={t("campaignsTitle")}
        description={t("campaignsDescription")}
        icon={<Swords className="h-12 w-12" />}
        href="/campaigns"
      />
      <FeatureCard
        title={t("docsTitle")}
        description={t("docsDescription")}
        icon={<BookHeart className="h-12 w-12" />}
        href="/docs"
      />
    </div>
  );
}
