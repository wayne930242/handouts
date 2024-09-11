"use client";

import { useEffect } from "react";
import { useSubscription } from "@supabase-cache-helpers/postgrest-react-query";

import useCampaignStore from "@/lib/store/useCampaignStore";
import { useClient } from "@/lib/supabase/client";

export default function useSubscribeCampaign(campaignId: string) {
  const supabase = useClient();

  const { setConnected, handleRealtimeUpdate } = useCampaignStore((state) => ({
    setConnected: state.setConnected,
    handleRealtimeUpdate: state.handleRealtimeUpdate,
  }));

  const { status: chapterStatus } = useSubscription(
    supabase,
    "chapters-changes",
    {
      event: "*",
      schema: "public",
      table: "chapters",
      filter: `campaign_id=eq.${campaignId}`,
    },
    ["id"],
    { callback: (payload) => handleRealtimeUpdate("chapters", payload as any) }
  );
  const { status: sectionStatus } = useSubscription(
    supabase,
    "sections-changes",
    {
      event: "*",
      schema: "public",
      table: "sections",
      filter: `campaign_id=eq.${campaignId}`,
    },
    ["id"],
    { callback: (payload) => handleRealtimeUpdate("sections", payload as any) }
  );

  const { status: handoutStatus } = useSubscription(
    supabase,
    "handouts-changes",
    {
      event: "*",
      schema: "public",
      table: "handouts",
      filter: `campaign_id=eq.${campaignId}`,
    },
    ["id"],
    { callback: (payload) => handleRealtimeUpdate("handouts", payload as any) }
  );

  useEffect(() => {
    if (
      chapterStatus === "SUBSCRIBED" &&
      sectionStatus === "SUBSCRIBED" &&
      handoutStatus === "SUBSCRIBED"
    ) {
      setConnected(true);
    } else {
      setConnected(false);
    }
  }, [chapterStatus, sectionStatus, handoutStatus]);
}
