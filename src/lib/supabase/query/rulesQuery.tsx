import { MySupabaseClient } from "@/types/interfaces";

export const getRulesByOwnerId = (
  supabase: MySupabaseClient,
  ownerId: string
) => {
  return supabase.from("rules").select("*").eq("owner_id", ownerId);
};

export const getRuleInfo = (supabase: MySupabaseClient, ruleId: string) => {
  return supabase.from("rules").select("*").eq("id", ruleId).single();
};
