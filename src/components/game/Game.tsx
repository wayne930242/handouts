"use client";

import { getGameDetail } from "@/lib/supabase/query/gamesQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useTranslations } from "next-intl";
import { PacmanLoader } from "react-spinners";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";

import { useRouter } from "@/navigation";
import { useClient } from "@/lib/supabase/client";
import useGameStore from "@/lib/store/useGameStore";
import GameToolbar from "./GameToolbar";

const GameScreen = dynamic(() => import("./GameScreen"));
const GameDocs = dynamic(() => import("./GameDocs"));
const GameHandouts = dynamic(() => import("./GameHandouts"));
const GameNote = dynamic(() => import("./GameNote"));

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface Props {
  gameId: string;
  userId: string;
}

export default function Game({ gameId, userId }: Props) {
  const t = useTranslations("GamePage");

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

  const isOwner = game?.gm_id === userId;
  const [currentTab, setCurrentTab] = useState("notes");

  if (!game) return <></>;

  return game ? (
    <div className="w-full mt-3 overflow-x-auto">
      <GameToolbar
        game={game}
        isOwner={game?.gm_id === userId}
        isJoined={!!game?.players.find((p) => p?.player?.id === userId)}
        isFavorite={!!game?.favorite?.length}
      />
      <div className="px-1 py-3">
        <Select value={currentTab} onValueChange={(v) => setCurrentTab(v)}>
          <SelectTrigger className="w-full flex sm:hidden">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="notes">{t("notes")}</SelectItem>
            <SelectItem value="handouts">{t("handouts")}</SelectItem>
            <SelectItem value="docs">{t("docs")}</SelectItem>
            {isOwner && <SelectItem value="screen">{t("screen")}</SelectItem>}
          </SelectContent>
        </Select>
        <Tabs
          value={currentTab}
          onValueChange={(v) => {
            setCurrentTab(v);
          }}
          className="w-full"
        >
          <TabsList className="w-full grid-cols-4 hidden sm:grid">
            <TabsTrigger value="notes">{t("notes")}</TabsTrigger>
            <TabsTrigger value="handouts">{t("handouts")}</TabsTrigger>
            <TabsTrigger value="docs">{t("docs")}</TabsTrigger>
            {isOwner && <TabsTrigger value="screen">{t("screen")}</TabsTrigger>}
          </TabsList>
          <TabsContent value="notes">
            <Card>
              <CardHeader>
                <CardTitle>{t("notes")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GameNote />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="handouts">
            <Card>
              <CardHeader>
                <CardTitle>{t("handouts")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GameHandouts />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="docs">
            <Card>
              <CardHeader>
                <CardTitle>{t("docs")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GameDocs />
              </CardContent>
            </Card>
          </TabsContent>
          <TabsContent value="screen">
            <Card>
              <CardHeader>
                <CardTitle>{t("screen")}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <GameScreen />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </div>
  );
}
