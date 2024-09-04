import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/navigation";
import DataToolbar from "@/components/DataToolbar";

import PageLayout from "@/components/layouts/PageLayout";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import {
  getMyCampaigns,
  getMyFavCampaigns,
  getOwnedCampaigns,
} from "@/lib/supabase/query/campaignsQuery";
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

  await prefetchQuery(queryClient, getOwnedCampaigns(supabase, user.id));
  await prefetchQuery(queryClient, getMyFavCampaigns(supabase, user.id));
  await prefetchQuery(queryClient, getMyCampaigns(supabase, user.id));

  return (
    <PageLayout header={<DataToolbar tableKey="campaigns" />} needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Campaigns userId={user.id} />
      </HydrationBoundary>
    </PageLayout>
  );
}
