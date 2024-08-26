import { useEffect } from "react";
import { createClient } from "../supabase/client";
import useCampaignStore from "../store/useCampaignStore";

export default function useIsWhitelisted() {
  const { inWhiteList, fetchWhiteList } = useCampaignStore();
  const supabase = createClient();

  useEffect(() => {
    fetchWhiteList(supabase);
  }, [supabase]);

  return inWhiteList;
}
