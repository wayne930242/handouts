import { MySupabaseClient } from "@/types/interfaces";

export const getMyProfile = (supabase: MySupabaseClient, userId: string) => {
  return supabase.from("profiles").select("*").eq("id", userId).single();
};
