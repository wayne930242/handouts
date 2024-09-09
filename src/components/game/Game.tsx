"use client";

import { getGameDetail } from "@/lib/supabase/query/gamesQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { PacmanLoader } from "react-spinners";
import { useClient } from "@/lib/supabase/client";

interface Props {
  gameId: string;
  userId: string;
}

export default function Game({ gameId, userId }: Props) {
  const supabase = useClient();

  const { data: game, isFetching } = useQuery(
    getGameDetail(supabase, gameId, userId),
    {
      enabled: gameId !== "new",
    }
  );

  return game ? (
    <div className="w-full"></div>
  ) : (
    <div className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </div>
  );
}
