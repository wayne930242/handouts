import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/navigation";

import PageLayout from "@/components/layout/PageLayout";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getDocsByOwnerId } from "@/lib/supabase/query/docsQuery";
import Docs from "@/components/doc/Docs";
import DataToolbar from "@/components/toolbar/DataToolbar";

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
    await prefetchQuery(queryClient, getDocsByOwnerId(supabase, user.id));
  }

  return (
    <PageLayout header={<DataToolbar tableKey="docs" />} needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        {user && <Docs userId={user.id} />}
      </HydrationBoundary>
    </PageLayout>
  );
}
