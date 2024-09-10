import { MySupabaseClient } from "@/types/interfaces";

export const checkInvitation = async (
  supabase: MySupabaseClient,
  code: string
) => {
  const { data, error } = await supabase
    .rpc("check_game_invitation", { p_code: code })
    .single();

  if (error || !data) {
    return {
      isValid: false,
      gameId: null,
    };
  }
  return data;
};
