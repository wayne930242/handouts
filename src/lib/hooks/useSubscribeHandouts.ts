"use client";

import { useEffect } from "react";
import { useSubscription } from "@supabase-cache-helpers/postgrest-react-query";
import { useClient } from "@/lib/supabase/client";

import { HandoutsTreeTable } from "@/types/handouts";
import { RealtimePayload } from "@/types/interfaces";

export default function useSubscribeHandouts (
  campaignId: string | null,
  handleRealtimeUpdate: <T extends { id: string }>(
    table: HandoutsTreeTable,
    payload: RealtimePayload<T>
  ) => void,
  onConnect?: () => void,
  onDisconnect?: () => void,
) {
  const { status: chapterStatus } = useSubscription(
    useClient(),
    "chapters-changes",
    {
      event: "*",
      schema: "public",
      table: "chapters",
      filter: `campaign_id=eq.${campaignId}`,
    },
    ["id"],
    { callback: (payload) => handleRealtimeUpdate("chapters", payload) }
  );

  const { status: sectionStatus } = useSubscription(
    useClient(),
    "sections-changes",
    {
      event: "*",
      schema: "public",
      table: "sections",
      filter: `campaign_id=eq.${campaignId}`,
    },
    ["id"],
    { callback: (payload) => handleRealtimeUpdate("sections", payload) }
  );

  const { status: handoutStatus } = useSubscription(
    useClient(),
    "handouts-changes",
    {
      event: "*",
      schema: "public",
      table: "handouts",
      filter: `campaign_id=eq.${campaignId}`,
    },
    ["id"],
    { callback: (payload) => handleRealtimeUpdate("handouts", payload) }
  );

  useEffect(() => {
    if (
      chapterStatus === "SUBSCRIBED" &&
      sectionStatus === "SUBSCRIBED" &&
      handoutStatus === "SUBSCRIBED"
    ) {
      onConnect?.();
    } else {
      onDisconnect?.();
    }
  }, [chapterStatus, sectionStatus, handoutStatus]);
}
