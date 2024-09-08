import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { Construction } from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { createClient } from "@/lib/supabase/server";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import {
  getMyFavGames,
  getMyGames,
  getOwnedGames,
} from "@/lib/supabase/query/gamesQuery";
import { redirect } from "@/navigation";

interface Props {
  params: {
    locale: string;
  };
}

export default async function Generators({ params: { locale } }: Props) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const queryClient = new QueryClient();

  await prefetchQuery(queryClient, getOwnedGames(supabase, user.id));
  await prefetchQuery(queryClient, getMyGames(supabase, user.id));
  await prefetchQuery(queryClient, getMyFavGames(supabase, user.id));

  return (
    <PageLayout>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Games userId={user.id} />
      </HydrationBoundary>
    </PageLayout>
  );
}
