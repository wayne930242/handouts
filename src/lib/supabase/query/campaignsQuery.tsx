import { MySupabaseClient } from "@/types/interfaces";

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

export const getCampaignDetail = (
  supabase: MySupabaseClient,
  campaignId: string
) => {
  return supabase
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
    .single();
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
        avatar_url,
        display_name
      )
    `
    )
    .eq("campaign_id", campaignId);
};
