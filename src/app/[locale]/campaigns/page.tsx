import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/navigation";
import CampaignlistToolbar from "./Toolbar";

import PageLayout from "@/components/layouts/PageLayout";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
// import { Alert, AlertDescription } from "@/components/ui/alert";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getOwnedCampaignList } from "@/lib/supabase/query/getOwnedCampaignList";
import Campaigns from "./Campaigns";

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

  const queryClient = new QueryClient();

  await prefetchQuery(queryClient, getOwnedCampaignList(supabase, user.id));

  return (
    <PageLayout header={<CampaignlistToolbar />} needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        {/* <Alert variant="destructive">
        <AlertDescription>{t("alert")}</AlertDescription>
      </Alert> */}
        <Campaigns gmId={user.id} />
      </HydrationBoundary>
    </PageLayout>
  );
}
