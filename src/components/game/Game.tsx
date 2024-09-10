"use client";

import { getGameDetail } from "@/lib/supabase/query/gamesQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { PacmanLoader } from "react-spinners";
import { useClient } from "@/lib/supabase/client";
import { useEffect, useRef } from "react";
import useGameStore from "@/lib/store/useGameStore";
import { useRouter } from "next/navigation";
import GameToolbar from "./GameToolbar";

interface Props {
  gameId: string;
  userId: string;
}

export default function Game({ gameId, userId }: Props) {
  const supabase = useClient();
  const { initGameData } = useGameStore((state) => ({
    initGameData: state.initGameData,
  }));

  const {
    data: game,
    isFetching,
    isFetched,
  } = useQuery(getGameDetail(supabase, gameId, userId));

  const isInit = useRef(false);
  useEffect(() => {
    if (isInit.current) return;
    if (game) {
      isInit.current = true;
      initGameData(game);
    }
  }, [game]);

  const router = useRouter();

  useEffect(() => {
    if (!game && isFetched) {
      router.push("/games");
    }
  }, [game]);

  if (!game) return <></>;

  return game ? (
    <div className="w-full">
      <GameToolbar
        game={game}
        isOwner={game?.gm_id === userId}
        isJoined={!!game?.players.find((p) => p?.player?.id === userId)}
        isFavorite={!!game?.favorite?.length}
      />
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </div>
  );
}
