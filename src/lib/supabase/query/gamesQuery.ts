import { MySupabaseClient } from "@/types/interfaces";

export const getGameDetail = (
  supabase: MySupabaseClient,
  gameId: string,
  userId?: string
) => {
  let query = supabase
    .from("games")
    .select(
      `
      id,
      title,
      description,
      campaign:campaigns (
        id,
        name,
        description,
        banner_url,
        chapters:chapters (
          id,
          title,
          order_num,
          sections:sections (
            id,
            title,
            order_num,
            handouts:handouts (
              id,
              title,
              content,
              is_public,
              type,
              owner_id,
              note,
              order_num
            )
          )
        )
      ),
      docs:game_docs (
        doc:docs (
          id,
          title,
          description,
          banner_url,
          content
        )
      ),
      screen:screens (
        id,
        chapters:chapters (
          id,
          title,
          order_num,
          sections:sections (
            id,
            title,
            order_num,
            handouts:handouts (
              id,
              title,
              content,
              is_public,
              type,
              owner_id,
              note,
              order_num
            )
          )
        ),
        generators:screen_generators (
          generator:generators (
            id,
            name,
            description,
            type,
            fields:generator_fields (
              id,
              name,
              type,
              content,
              order_num
            )
          )
        )
      ),
      notes:notes (
        id,
        owner_id,
        order_num,
        type,
        content,
        is_public,
        metadata
      ),
      gm:profiles!games_gm_id_fkey (
        id,
        display_name,
        avatar_url
      ),
      players:game_players (
        player:profiles (
          id,
          display_name,
          avatar_url
        )
      ),
      favorite:user_game_favorites!left (
        id,
        added_at
      )
    `
    )
    .eq("id", gameId)
    .order("order_num", {
      referencedTable: "notes",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "campaigns.chapters",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "campaigns.chapters.sections",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "campaigns.chapters.sections.handouts",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "screens.chapters",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "screens.chapters.sections",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "screens.chapters.sections.handouts",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "screens.generators.generator.fields",
      ascending: true,
    })
    .order("order_num", { referencedTable: "notes", ascending: true });

  if (userId) {
    query = query.eq("user_game_favorites.user_id", userId);
  }
  return query.single();
};

export const getOwnedGames = (supabase: MySupabaseClient, userId: string) => {
  return supabase
    .from("games")
    .select(
      `
      *,
      gm:profiles!games_gm_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("gm_id", userId);
};

export const getMyGames = (supabase: MySupabaseClient, userId: string) => {
  return supabase
    .from("games")
    .select(
      `
      *,
      game_players!inner (player_id),
      gm:profiles!games_gm_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("game_players.player_id", userId)
    .neq("gm_id", userId);
};

export const getMyFavGames = (supabase: MySupabaseClient, userId: string) => {
  return supabase
    .from("games")
    .select(
      `
      *,
      user_game_favorites!inner (user_id, added_at),
      gm:profiles!games_gm_id_fkey (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("user_game_favorites.user_id", userId)
    .order("added_at", {
      referencedTable: "user_game_favorites",
      ascending: false,
    });
};

export const getGameSEO = (supabase: MySupabaseClient, gameId: string) => {
  return supabase
    .from("games")
    .select(
      `
      id,
      title,
      description,
      banner_url
    `
    )
    .eq("id", gameId)
    .single();
};

export const getGameInfo = (
  supabase: MySupabaseClient,
  gameId: string,
  userId: string
) => {
  return supabase
    .from("games")
    .select(`*`)
    .eq("id", gameId)
    .eq("gm_id", userId)
    .single();
};
