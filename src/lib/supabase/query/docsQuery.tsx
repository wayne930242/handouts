import { MySupabaseClient } from "@/types/interfaces";

export const getDocsByOwnerId = (
  supabase: MySupabaseClient,
  ownerId: string
) => {
  return supabase.from("docs").select("*").eq("owner_id", ownerId);
};

export const getDocInfo = (
  supabase: MySupabaseClient,
  docId: string,
  userId?: string
) => {
  let query = supabase
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
      ),
      favorite:user_doc_favorites!left (
        id,
        added_at
      )
    `
    )
    .eq("id", docId);

  if (userId) {
    query = query.eq("user_doc_favorites.user_id", userId);
  }

  return query.single();
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

export const getMyDocs = (supabase: MySupabaseClient, userId: string) => {
  return supabase
    .from("docs")
    .select(
      `
      *,
      doc_players!inner (user_id)
    `
    )
    .eq("doc_players.user_id", userId);
};

export const getMyFavDocs = (supabase: MySupabaseClient, userId: string) => {
  return supabase
    .from("docs")
    .select(
      `
      *,
      user_doc_favorites!inner (user_id, added_at)
    `
    )
    .eq("user_doc_favorites.user_id", userId)
    .order("added_at", {
      referencedTable: "user_doc_favorites",
      ascending: false,
    });
};
