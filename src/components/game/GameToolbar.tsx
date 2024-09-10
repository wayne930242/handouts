"use client";
import { useEffect, useState } from "react";
import { PacmanLoader } from "react-spinners";
import { Eye, Pen, Unplug } from "lucide-react";
import { useTranslations } from "next-intl";
import {
  useDeleteMutation,
  useInsertMutation,
} from "@supabase-cache-helpers/postgrest-react-query";

import { GameInList } from "@/types/interfaces";
import useAppStore from "@/lib/store/useAppStore";
import { useClient } from "@/lib/supabase/client";
import useSessionUser from "@/lib/hooks/useSession";
import { useRouter } from "@/navigation";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import OverlayLoading from "@/components/layout/OverlayLoading";
import FavoriteButton from "@/components/toolbar/FavoriteButton";
import ToolbarLayout from "../layout/ToolbarLayout";

import useGameStore from "@/lib/store/useGameStore";

export default function GameToolbar({ game }: Props) {
  const { connected, loading } = useGameStore((state) => ({
    connected: state.connected,
    loading: state.loading,
  }));

  const handleAddOrRemoveFavorite = async () => {}
  

  return <ToolbarLayout>
    <PacmanLoader color="#bbb" loading={loading} size={12} />
    {!connected && (
      <Badge
        variant="outline"
        className="text-destructive border-transparent animate-pulse"
      >
        <Unplug className="h-4 w-4" />
      </Badge>
    )}

  </ToolbarLayout>;
}

interface Props {
  game: GameInList;
  isOwner?: boolean;
  isFavorite?: boolean;
  isJoined?: boolean;
}
