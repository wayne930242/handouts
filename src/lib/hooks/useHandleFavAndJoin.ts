import { MySupabaseClient } from "@/types/interfaces";
import { useClient } from "../supabase/client";
import { useRouter } from "@/navigation";
import { getCurrentUrl } from "../route";
import { useCallback, useMemo } from "react";

const RelatedTableMap = {
  docs: {
    favorite: "user_doc_favorites",
    join: "doc_players",
    itemIdKey: "doc_id",
    userIdKey: "user_id",
  },
  campaigns: {
    favorite: "user_campaign_favorites",
    join: "campaign_players",
    itemIdKey: "campaign_id",
    userIdKey: "user_id",
  },
  games: {
    favorite: "user_game_favorites",
    join: "game_players",
    itemIdKey: "game_id",
    userIdKey: "user_id",
  },
} as const;

type TableName = keyof typeof RelatedTableMap;

type RelatedTableInfo<T extends TableName> = (typeof RelatedTableMap)[T];

const getRelatedTableMap = <T extends TableName>(
  tableName: T
): RelatedTableInfo<T> => {
  return RelatedTableMap[tableName];
};

interface Props<T extends TableName> {
  tableName: T;
  userId: string | null | undefined;
  itemId: string | null | undefined;
  role: "OWNER" | "PLAYER";
  isJoined: boolean;
  isFavorite: boolean;
  setIsLoading?: (loading: boolean) => void;
  setIsJoined: (isLocalJoined: boolean) => void;
  setIsFavorite: (isLocalFavorite: boolean) => void;
}

export default function useHandleFavAndJoin<T extends TableName>({
  tableName,
  userId,
  itemId,
  role,
  isJoined,
  isFavorite,
  setIsLoading,
  setIsJoined,
  setIsFavorite,
}: Props<T>) {
  const supabase = useClient();
  const router = useRouter();
  const { favorite, join, itemIdKey, userIdKey } = useMemo(
    () => getRelatedTableMap(tableName),
    [tableName]
  );

  const addOrRemoveFavorite = useCallback(async () => {
    if (!itemId) return;
    if (!userId) {
      router.push(
        `/login?redirectTo=${getCurrentUrl({ includeSearchParams: true })}`
      );
      return;
    }
    setIsLoading?.(true);
    if (!isFavorite && !isJoined) {
      const { error } = await supabase
        .from(join)
        .insert({
          [itemIdKey]: itemId,
          [userIdKey]: userId,
          role,
        } as any)
        .select();
      if (!error) {
        setIsFavorite?.(true);
      }
    }
    if (isFavorite) {
      const { error } = await supabase
        .from(favorite)
        .delete()
        .eq(itemIdKey, itemId)
        .eq(userIdKey, userId)
        .select();
      if (!error) {
        setIsFavorite?.(false);
      }
    } else {
      const { error } = await supabase
        .from(favorite)
        .insert({
          [itemIdKey]: itemId,
          [userIdKey]: userId,
          role,
        })
        .select();
      if (!error) {
        setIsFavorite?.(true);
      }
    }
    setIsLoading?.(false);
  }, [
    itemId,
    userId,
    role,
    isFavorite,
    isJoined,
    setIsLoading,
    setIsFavorite,
    join,
    favorite,
    itemIdKey,
    userIdKey,
  ]);

  const joinOrLeave = useCallback(async () => {
    if (!itemId) return;
    if (!userId) {
      router.push(
        `/login?redirectTo=${getCurrentUrl({ includeSearchParams: true })}`
      );
      return;
    }
    setIsLoading?.(true);
    if (isJoined) {
      const { error } = await supabase
        .from(join)
        .delete()
        .eq(itemIdKey, itemId)
        .eq(userIdKey, userId)
        .select();
      if (!error) {
        setIsJoined?.(false);
      }
    } else {
      const { error } = await supabase
        .from(join)
        .insert({
          [itemIdKey]: itemId,
          [userIdKey]: userId,
          role,
        } as any)
        .select();
      if (!error) {
        setIsJoined?.(true);
      }
    }
    setIsLoading?.(false);
  }, [
    itemId,
    userId,
    role,
    isJoined,
    setIsLoading,
    setIsJoined,
    join,
    itemIdKey,
    userIdKey,
  ]);

  return {
    addOrRemoveFavorite,
    joinOrLeave,
  };
}
