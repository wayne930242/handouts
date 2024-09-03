import { MySupabaseClient } from "@/types/interfaces";

export const getDocsByOwnerId = (
  supabase: MySupabaseClient,
  ownerId: string
) => {
  return supabase.from("docs").select("*").eq("owner_id", ownerId);
};

export const getDocInfo = (supabase: MySupabaseClient, docId: string) => {
  return supabase
    .from("docs")
    .select(
      `
      *,
      owner:profiles!docs_owner_id_fkey (
        id,
        display_name,
        avatar_url
      ),
      players:doc_players (
        role,
        user:profiles!doc_players_user_id_fkey1 (
          id,
          display_name,
          avatar_url
        )
      )
    `
    )
    .eq("id", docId)
    .single();
};

export const getDocSEO = (supabase: MySupabaseClient, docId: string) => {
  return supabase
    .from("docs")
    .select(
      `
        id,
        title,
        description,
        banner_url
      `
    )
    .eq("id", docId)
    .single();
};
