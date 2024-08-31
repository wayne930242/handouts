import { createClient } from "@/lib/supabase/server";
import { redirect } from "@/navigation";

import PageLayout from "@/components/layouts/PageLayout";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getTranslations, unstable_setRequestLocale } from "next-intl/server";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getDocsByOwnerId } from "@/lib/supabase/query/docsQuery";
import Docs from "./Docs";
import DataToolbar from "@/components/DataToolbar";

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

  await prefetchQuery(queryClient, getDocsByOwnerId(supabase, user.id));

  return (
    <PageLayout header={<DataToolbar tableKey="docs" />} needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Docs ownerId={user.id} />
      </HydrationBoundary>
    </PageLayout>
  );
}