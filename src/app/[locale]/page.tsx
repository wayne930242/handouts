import PageLayout from "@/components/layouts/PageLayout";
import PassphraseForm from "@/components/PassphraseForm";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

interface Props {
  searchParams: {
    campaign_id?: string;
  };
  params: { locale: string };
}

export default async function Index({
  searchParams: { campaign_id },
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations("Index");

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-center text-muted-foreground my-12">
        {t("welcome")}
      </h1>

      <div className="flex flex-col items-center">
        <PassphraseForm defaultId={campaign_id} />
      </div>
    </PageLayout>
  );
}
