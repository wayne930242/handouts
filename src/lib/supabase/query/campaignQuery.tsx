import { FullCampaignData, MySupabaseClient } from "@/types/interfaces";

export const getOwnedCampaignList = (
  supabase: MySupabaseClient,
  userId: string
) => {
  return supabase.from("campaigns").select("*").eq("gm_id", userId);
};

export const getCampaignInfo = (
  supabase: MySupabaseClient,
  campaignId: string,
  userId: string
) => {
  return supabase
    .from("campaigns")
    .select("*")
    .eq("id", campaignId)
    .eq("gm_id", userId)
    .single();
};
