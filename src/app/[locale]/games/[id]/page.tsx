import { createClient } from "@/lib/supabase/server";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";

import PageLayout from "@/components/layout/PageLayout";
import { getGameDetail, getGameSEO } from "@/lib/supabase/query/gamesQuery";
import { genSEO } from "@/lib/defaultSEO";
import { BASE_URL } from "@/config/app";
import Game from "@/components/game/Game";
import { redirect } from "@/navigation";

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

  const queryClient = new QueryClient();

  if (user) {
    const { data: isValid } = await supabase.rpc("check_user_game_role", {
      p_user_id: user.id,
      p_game_id: id,
    });
    if (!isValid) return redirect("/games?message=notInGame");

    await prefetchQuery(queryClient, getGameDetail(supabase, id, user.id));
  }

  return (
    <PageLayout needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        {user && <Game gameId={id} userId={user.id} />}
      </HydrationBoundary>
    </PageLayout>
  );
}
