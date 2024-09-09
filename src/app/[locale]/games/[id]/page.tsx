import { createClient } from "@/lib/supabase/server";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import { redirect } from "@/navigation";
import DataToolbar from "@/components/toolbar/DataToolbar";

import PageLayout from "@/components/layout/PageLayout";
import { getGameDetail, getGameSEO } from "@/lib/supabase/query/gamesQuery";
import { genSEO } from "@/lib/defaultSEO";
import { BASE_URL } from "@/config/app";
import Game from "@/components/game/Game";

interface Props {
  params: {
    id: string;
    locale: string;
  };
}

export async function generateMetadata({
  params: { id, locale },
}: Omit<Props, "children">) {
  const supabase = createClient();
  const { data: game, error } = await getGameSEO(supabase, id);

  if (error) {
    return await genSEO({ locale });
  }

  return await genSEO({
    locale,
    title: game?.title,
    description: game?.description ?? undefined,
    url: `${BASE_URL}/games/${id}`,
    images: game?.banner_url
      ? [{ url: game.banner_url, width: 1200, height: 450 }]
      : undefined,
  });
}

export default async function GamePage({ params: { id } }: Props) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    return redirect("/login");
  }

  const queryClient = new QueryClient();

  await prefetchQuery(queryClient, getGameDetail(supabase, id));

  return (
    <PageLayout header={<DataToolbar tableKey="games" />} needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Game gameId={id} userId={user.id} />
      </HydrationBoundary>
    </PageLayout>
  );
}
