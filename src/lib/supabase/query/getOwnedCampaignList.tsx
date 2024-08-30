import { MySupabaseClient } from "@/types/interfaces";

export const getOwnedCampaignList = (
  supabase: MySupabaseClient,
  userId: string
) => {
  return supabase.from("campaigns").select("*").eq("gm_id", userId);
};
