import PageLayout from "@/components/layout/PageLayout";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import SearchParamsListener from "@/components/layout/context/SearchParamsListener";
import Hero from "@/components/index/Hero";
import Features from "@/components/index/Features";

interface Props {
  params: { locale: string };
}

export default async function Index({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations("Index");

  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <Hero />
      </div>

      <div className="flex flex-col items-center pt-6">
        <h1 className="text-2xl font-bold text-center text-muted-foreground mb-2">
          {t("welcome")}
        </h1>
        <div className="p-4">{t("siteDescription")}</div>
        <div className="mt-4">
          <Features />
        </div>
      </div>
      {/* <SearchParamsListener /> */}
    </PageLayout>
  );
}
