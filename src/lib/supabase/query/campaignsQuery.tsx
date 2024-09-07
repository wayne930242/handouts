import { MySupabaseClient } from "@/types/interfaces";

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

export const getCampaignDetail = (
  supabase: MySupabaseClient,
  campaignId: string,
  userId?: string
) => {
  let query = supabase
    .from("campaigns")
    .select(
      `
      id,
      gm_id,
      name,
      description,
      passphrase,
      status,
      banner_url,
      gm:profiles!campaigns_gm_id_fkey1 (
        id,
        display_name,
        avatar_url
      ),
      players:campaign_players (
        role,
        user:profiles!campaign_players_user_id_fkey1 (
          id,
          display_name,
          avatar_url
        )
      ),
      chapters:chapters (
        id,
        campaign_id,
        title,
        order_num,
        sections:sections (
          id,
          chapter_id,
          title,
          order_num,
          handouts:handouts (
            id,
            title,
            content,
            is_public,
            section_id,
            type,
            owner_id,
            note,
            order_num
          )
        )
      ),
      docs:campaign_docs (
        doc:docs (
          id,
          title,
          description,
          is_public,
          content,
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
          )
        )
      ),
      generators:campaign_generators (
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
      favorite:user_campaign_favorites!left (
        id,
        added_at
      )
    `
    )
    .eq("id", campaignId)
    .order("order_num", {
      referencedTable: "chapters",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "chapters.sections",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "chapters.sections.handouts",
      ascending: true,
    })
    .order("order_num", {
      referencedTable: "campaign_generators.generator.generator_fields",
      ascending: true,
    });
  if (userId) {
    query = query.eq("user_campaign_favorites.user_id", userId);
  }
  return query.single();
};

export const getCampaignSEO = (
  supabase: MySupabaseClient,
  campaignId: string
) => {
  return supabase
    .from("campaigns")
    .select(
      `
      id,
      name,
      description,
      banner_url
    `
    )
    .eq("id", campaignId)
    .single();
};

export const getCampaignWithPlayers = (
  supabase: MySupabaseClient,
  campaignId: string
) => {
  return supabase
    .from("campaign_players")
    .select(
      `
      user_id,
      role,
      profiles!campaign_players_user_id_fkey1 (
        id,
        avatar_url,
        display_name
      )
    `
    )
    .eq("campaign_id", campaignId);
};


export const getOwnedCampaigns = (
  supabase: MySupabaseClient,
  userId: string
) => {
  return supabase
    .from("campaigns")
    .select(
      `
      *,
      gm:profiles!campaigns_gm_id_fkey1 (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("gm_id", userId);
};

export const getMyCampaigns = (supabase: MySupabaseClient, userId: string) => {
  return supabase
    .from("campaigns")
    .select(
      `
      *,
      campaign_players!inner (user_id),
      gm:profiles!campaigns_gm_id_fkey1 (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("campaign_players.user_id", userId)
    .neq("gm_id", userId);
};

export const getMyFavCampaigns = (
  supabase: MySupabaseClient,
  userId: string
) => {
  return supabase
    .from("campaigns")
    .select(
      `
      *,
      user_campaign_favorites!inner (user_id, added_at),
      gm:profiles!campaigns_gm_id_fkey1 (
        id,
        display_name,
        avatar_url
      )
    `
    )
    .eq("user_campaign_favorites.user_id", userId)
    .order("added_at", {
      referencedTable: "user_campaign_favorites",
      ascending: false,
    });
};
