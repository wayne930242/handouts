import PageLayout from "@/components/layouts/PageLayout";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import SearchParamsListener from "./SearchParamsListener";
import Hero from "./Hero";
import Features from "./Features";

interface Props {
  params: { locale: string };
}

export default async function Index({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations("Index");

  return (
    <PageLayout>
      <div className="flex flex-col items-center">
        <Hero imageClassName="object-top" />
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
      <SearchParamsListener />
    </PageLayout>
  );
}
