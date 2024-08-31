import PageLayout from "@/components/layouts/PageLayout";
import PassphraseForm from "@/components/PassphraseForm";
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
        <Hero imageClassName="object-top rounded-t-xl rounded-b-xl md:rounded-b-none" />
      </div>

      <div className="flex flex-col items-center pt-6 md:border-r-2 md:border-l-2 md:border-border">
        <h1 className="text-2xl font-bold text-center text-muted-foreground mb-2">
          {t("welcome")}
        </h1>
        <div className="p-4">{t("siteDescription")}</div>
        <div className="mt-4">
          <Features />
        </div>
      </div>
      <div className="flex-col items-center hidden md:flex">
        <Hero
          imageClassName="object-bottom rounded-b-xl"
          containerClassName="h-12 lg:h-24"
        />
      </div>
      <SearchParamsListener />
    </PageLayout>
  );
}
