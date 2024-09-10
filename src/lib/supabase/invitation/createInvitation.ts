import { MySupabaseClient } from "@/types/interfaces";
import { v4 as uuidv4 } from "uuid";

export const ExpireTime = 60 * 60 * 1000 * 24 * 30; // 30 days

export const createInvitation = async (
  supabase: MySupabaseClient,
  gameId: string,
  expireTime: number = ExpireTime
) => {
  const code = uuidv4().replace(/-/g, "").slice(0, 16);

  const { data: invitation, error } = await supabase
    .from("game_invitations")
    .insert([
      {
        code,
        game_id: gameId,
        expires_at: new Date(Date.now() + expireTime).toISOString(), // Expire in 1 hour
      },
    ])
    .select()
    .single();

  if (error || !invitation) {
    return null;
  }
  return invitation;
};
