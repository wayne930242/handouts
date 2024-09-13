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

const GameScreen = dynamic(() => import("./screen/GameScreen"));
const GameDocs = dynamic(() => import("./docs/GameDocs"));
const GameHandouts = dynamic(() => import("./handouts/GameHandouts"));
const GameNote = dynamic(() => import("./notes/GameNotes"));

import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import GameNotesSubscriber from "./GameNotesSubscriber";
import GameHandoutsSubscriber from "./GameHandoutsSubscriber";

interface Props {
  gameId: string;
  userId: string;
}

export default function Game({ gameId, userId }: Props) {
  const t = useTranslations("GamePage");

  const supabase = useClient();
  const { initGameData, setCurrentCampaignId, currentCampaignId } =
    useGameStore((state) => ({
      initGameData: state.initGameData,
      setCurrentCampaignId: state.setCurrentCampaignId,
      currentCampaignId: state.currentCampaignId,
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
      setCurrentCampaignId(game.campaign_id);
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
            <GameNote />
          </TabsContent>
          <TabsContent value="handouts">
            <GameHandouts />
          </TabsContent>
          <TabsContent value="docs">
            <GameDocs />
          </TabsContent>
          <TabsContent value="screen">
            <GameScreen />
          </TabsContent>
        </Tabs>
      </div>
      {game && <GameNotesSubscriber gameId={gameId} />}
      {currentCampaignId && (
        <GameHandoutsSubscriber campaign_id={currentCampaignId} />
      )}
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </div>
  );
}
