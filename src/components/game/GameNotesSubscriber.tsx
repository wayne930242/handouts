"use client";
import { useEffect } from "react";
import { useSubscription } from "@supabase-cache-helpers/postgrest-react-query";
import { useClient } from "@/lib/supabase/client";
import useGameStore from "@/lib/store/useGameStore";
import { RealtimePostgresChangesPayload } from "@supabase/supabase-js";

export default function GameNotesSubscriber({ gameId }: { gameId: string }) {
  const supabase = useClient();
  const { setConnected, handleRealtimeUpdateNotes } = useGameStore((state) => ({
    setConnected: state.setNotesConnected,
    handleRealtimeUpdateNotes: state.handleRealtimeUpdateNotes,
  }));

  const { status } = useSubscription(
    supabase,
    "notes-changes",
    {
      event: "*",
      schema: "public",
      table: "notes",
      filter: `game_id=eq.${gameId}`,
    },
    ["id"],
    {
      callback: (
        payload: RealtimePostgresChangesPayload<{ [key: string]: any }>
      ) => {
        handleRealtimeUpdateNotes(payload);
      },
    }
  );

  useEffect(() => {
    if (status === "SUBSCRIBED") {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [status, setConnected]);

  return null;
}
