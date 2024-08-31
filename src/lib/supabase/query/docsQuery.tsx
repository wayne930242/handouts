import { MySupabaseClient } from "@/types/interfaces";

export const getDocsByOwnerId = (
  supabase: MySupabaseClient,
  ownerId: string
) => {
  return supabase.from("docs").select("*").eq("owner_id", ownerId);
};

export const getDocInfo = (supabase: MySupabaseClient, docId: string) => {
  return supabase.from("docs").select("*").eq("id", docId).single();
};
