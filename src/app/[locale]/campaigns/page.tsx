import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/navigation";
import CampaignlistToolbar from "./Toolbar";
import CampaignCard from "./CampaignCard";
import PageLayout from "@/components/layouts/PageLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";

interface Props {
  params: {
    locale: string;
  };
}

export default async function CampaignPage({ params: { locale } }: Props) {
  unstable_setRequestLocale(locale);

  const t = await getTranslations("CampaignPage");
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }
  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("gm_id", user.id);

  return (
    <PageLayout header={<CampaignlistToolbar />} needsAuth>
      <Alert variant="destructive">
        <AlertDescription>{t("alert")}</AlertDescription>
      </Alert>
      <main className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns?.map((campaign) => (
          <CampaignCard campaign={campaign} key={campaign.id} />
        ))}
        {campaigns?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-2xl font-bold">{t("noCampaigns")}</div>
            <div className="text-sm text-muted-foreground">
              {t("createCampaign")}
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
