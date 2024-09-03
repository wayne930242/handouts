"use client";

import useCampaignStore from "@/lib/store/useCampaignStore";
import { useClient } from "@/lib/supabase/client";
import { useEffect, useRef } from "react";

export default function SubscriptCampaign({
  campaignId,
}: {
  campaignId: string;
}) {
  const supabase = useClient();

  const { setupRealtimeSubscription, connected } = useCampaignStore(
    (state) => ({
      setupRealtimeSubscription: state.setupRealtimeSubscription,
      connected: state.connected,
    })
  );
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (connected) return;
    const setupSubscription = () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      unsubscribeRef.current = setupRealtimeSubscription(supabase, campaignId);
    };

    setupSubscription();

    const handleFocus = () => {
      if (!connected) {
        setupSubscription();
      }
    };

    window.addEventListener("focus", handleFocus);

    return () => {
      window.removeEventListener("focus", handleFocus);
      if (unsubscribeRef.current) {
      unsubscribeRef.current();
      }
    };
  }, [connected, supabase, campaignId]);

  return <></>;
}
