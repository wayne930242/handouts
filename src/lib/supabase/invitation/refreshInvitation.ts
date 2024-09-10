import { MySupabaseClient } from "@/types/interfaces";
import { createInvitation, ExpireTime } from "./createInvitation";
import { deleteInvitation } from "./deleteInvitation";

export const refreshInvitation = async (
  supabase: MySupabaseClient,
  code: string,
  gameId: string,
  expireTime: number = ExpireTime
) => {
  const deleted = await deleteInvitation(supabase, code);
  if (!deleted) {
    return null;
  }

  return createInvitation(supabase, gameId, expireTime);
};
