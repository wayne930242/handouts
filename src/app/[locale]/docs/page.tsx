import { createClient } from "@/lib/supabase/server";

import PageLayout from "@/components/layout/PageLayout";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import {
  getDocsByOwnerId,
  getMyDocs,
  getMyFavDocs,
} from "@/lib/supabase/query/docsQuery";
import Docs from "@/components/doc/Docs";

interface Props {
  params: {
    locale: string;
  };
}

export default async function CampaignPage({ params: { locale } }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const queryClient = new QueryClient();

  if (user) {
    await prefetchQuery(queryClient, getDocsByOwnerId(supabase, user.id));
    await prefetchQuery(queryClient, getMyFavDocs(supabase, user.id));
    await prefetchQuery(queryClient, getMyDocs(supabase, user.id));
  }

  return (
    <PageLayout needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        {user && <Docs userId={user.id} />}
      </HydrationBoundary>
    </PageLayout>
  );
}
