import { createClient } from "@/lib/supabase/server";

import PageLayout from "@/components/layout/PageLayout";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import {
  getMyCampaigns,
  getMyFavCampaigns,
  getOwnedCampaigns,
} from "@/lib/supabase/query/campaignsQuery";
import Campaigns from "@/components/campaign/Campaigns";

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

  const queryClient = new QueryClient();

  if (user) {
    await prefetchQuery(queryClient, getOwnedCampaigns(supabase, user.id));
    await prefetchQuery(queryClient, getMyFavCampaigns(supabase, user.id));
    await prefetchQuery(queryClient, getMyCampaigns(supabase, user.id));
  }

  return (
    <PageLayout needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        {user && <Campaigns userId={user.id} />}
      </HydrationBoundary>
    </PageLayout>
  );
}
