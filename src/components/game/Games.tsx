"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

import { useClient } from "@/lib/supabase/client";
import {
  getMyFavGames,
  getMyGames,
  getOwnedGames,
} from "@/lib/supabase/query/gamesQuery";
import DataToolbar from "@/components/toolbar/DataToolbar";

import QueryListLayout from "../layout/itemsList/QueryListLayout";
import GameCard from "./GameCard";

export default function Games({ userId }: Props) {
  const t = useTranslations("GamesPage");
  const supabase = useClient();
  const {
    data: ownedGames,
    isFetching: isFetchingOwnedGames,
    refetch: refetchOwnedGames,
  } = useQuery(getOwnedGames(supabase, userId));
  const {
    data: myGames,
    isFetching: isFetchingMyGames,
    refetch: refetchMyGames,
  } = useQuery(getMyGames(supabase, userId));
  const {
    data: MyFavGames,
    isFetching: isFetchingMyFavGames,
    refetch: refetchMyFavGames,
  } = useQuery(getMyFavGames(supabase, userId));

  const isFetching =
    isFetchingOwnedGames || isFetchingMyGames || isFetchingMyFavGames;
  const hasData = !!(
    ownedGames?.length ||
    myGames?.length ||
    MyFavGames?.length
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <DataToolbar
        tableKey="games"
        isRefreshing={isFetching}
        handleRefresh={() => {
          refetchOwnedGames();
          refetchMyGames();
          refetchMyFavGames();
        }}
      />
      <QueryListLayout
        isLoading={isFetching}
        noItemTitle={t("noGames")}
        noItemDescription={t("createGame")}
        hasNoItem={!hasData}
        items={[
          {
            title: t("myFavorites"),
            icon: (
              <Star className="h-5 w-5 fill-yellow-300 stroke-yellow-300" />
            ),
            children: MyFavGames?.map((game) => (
              <GameCard game={game} key={`${game.id}-myfav`} />
            )),
          },
          {
            title: t("ownedGames"),
            children: ownedGames?.map((game) => (
              <GameCard game={game} key={`${game.id}-owned`} />
            )),
          },
          {
            title: t("myGames"),
            children: myGames?.map((game) => (
              <GameCard game={game} key={`${game.id}-my`} />
            )),
          },
        ]}
      />
    </div>
  );
}

interface Props {
  userId: string;
}
