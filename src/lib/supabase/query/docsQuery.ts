import { MySupabaseClient } from "@/types/interfaces";

export const getDocInfo = (
  supabase: MySupabaseClient,
  docId: string,
  userId: string
) => {
  return supabase
    .from("docs")
    .select(`*`)
    .eq("id", docId)
    .eq("owner_id", userId)
    .single();
};

export const getDocDetail = (
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
      generators:doc_generators (
        generator:generators (
          id,
          name,
          description,
          type,
          fields:generator_fields (
            id,
            name,
            content,
            order_num
          )
        )
      ),
      favorite:user_doc_favorites!left (
        id,
        added_at
      )
    `
    )
    .eq("id", docId)
    .order("order_num", {
      referencedTable: "doc_generators.generator.generator_fields",
      ascending: true,
    });

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

export const getDocsByOwnerId = (
  supabase: MySupabaseClient,
  ownerId: string
) => {
  return supabase
    .from("docs")
    .select(
      `
      *,
      owner:profiles!docs_owner_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("owner_id", ownerId);
};

export const getMyDocs = (supabase: MySupabaseClient, userId: string) => {
  return supabase
    .from("docs")
    .select(
      `
      *,
      doc_players!inner (user_id),
      owner:profiles!docs_owner_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("doc_players.user_id", userId)
    .neq("owner_id", userId);
};

export const getMyFavDocs = (supabase: MySupabaseClient, userId: string) => {
  return supabase
    .from("docs")
    .select(
      `
      *,
      user_doc_favorites!inner (user_id, added_at),
      owner:profiles!docs_owner_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("user_doc_favorites.user_id", userId)
    .order("added_at", {
      referencedTable: "user_doc_favorites",
      ascending: false,
    });
};
