import { createClient } from "@/lib/supabase/server";

import PageLayout from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getGameInfo, getGameSEO } from "@/lib/supabase/query/gamesQuery";
import { redirect } from "@/navigation";

interface Props {
  params: {
    id: string;
    locale: string;
  };
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

  if (id !== "new") {
    await prefetchQuery(queryClient, getGameInfo(supabase, id, user.id));
  }

  return (
    <PageLayout needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        {/* <GameInfo id={id} userId={user.id} /> */}
      </HydrationBoundary>
      {id !== "new" && (
        <div className="mt-4 flex flex-col gap-4">
          <Separator />
          {/* <GameDeleteZone gameId={id} /> */}
        </div>
      )}
    </PageLayout>
  );
}
