import { MySupabaseClient } from "@/types/interfaces";

export const deleteInvitation = async (
  supabase: MySupabaseClient,
  code: string
) => {
  const { error } = await supabase
    .from("game_invitations")
    .delete()
    .eq("code", code)
    .select()
    .single();

  if (error) {
    return false;
  }
  return true;
};
