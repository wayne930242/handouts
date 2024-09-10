"use client";
import { useState, useEffect } from "react";
import { Eye, Pen } from "lucide-react";
import { useTranslations } from "next-intl";

import { useRouter } from "@/navigation";

import useAppStore from "@/lib/store/useAppStore";
import { useClient } from "@/lib/supabase/client";
import useSessionUser from "@/lib/hooks/useSession";

import DocMenu from "./DocMenu";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/toolbar/FavoriteButton";
import OverlayLoading from "@/components/layout/OverlayLoading";

import { DocInList } from "@/types/interfaces";
import ToolbarLayout from "../layout/ToolbarLayout";
import { getCurrentUrl } from "@/lib/route";
import useHandleFavAndJoin from "@/lib/hooks/useHandleFavAndJoin";

export default function Toolbar({
  doc,
  isOwner,
  isFavorite,
  isJoined,
}: {
  doc: DocInList;
  isOwner?: boolean;
  isFavorite?: boolean;
  isJoined?: boolean;
}) {
  const t = useTranslations("Toolbar");
  const supabase = useClient();
  const user = useSessionUser();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(false);
  const [isLocalFavorite, setIsLocalFavorite] = useState(false);
  const [isLocalJoined, setIsLocalJoined] = useState(false);

  useEffect(() => {
    setIsLocalJoined(!!isJoined);
  }, [setIsLocalJoined, isJoined]);

  useEffect(() => {
    setIsLocalFavorite(!!isFavorite);
  }, [setIsLocalFavorite, isFavorite]);

  const { editingStage, setEditingStage, setEditingId } = useAppStore(
    (state) => ({
      editingStage: state.editingStage,
      setEditingStage: state.setEditingStage,
      setEditingId: state.setEditingId,
    })
  );

  const {
    addOrRemoveFavorite: handleAddOrRemoveFavorite,
    joinOrLeave: handleJoinOrLeave,
  } = useHandleFavAndJoin({
    tableName: "docs",
    userId: user?.id,
    itemId: doc?.id,
    role: doc?.owner_id === user?.id ? "OWNER" : "PLAYER",
    isJoined: isLocalJoined,
    isFavorite: isLocalFavorite,
    setIsLoading,
    setIsJoined: setIsLocalJoined,
    setIsFavorite: setIsLocalFavorite,
  });

  return (
    <ToolbarLayout>
      <FavoriteButton
        isFavorite={isLocalFavorite}
        onClick={() => handleAddOrRemoveFavorite()}
      />
      {isOwner && (
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant={editingStage === "doc" ? "outline" : "default"}
          onClick={() => {
            if (editingStage === "doc") {
              setEditingStage(null);
              setEditingId(null);
            } else {
              setEditingStage("doc");
              setEditingId(doc.id);
            }
          }}
        >
          {editingStage === "doc" ? (
            <Eye className="h-4 w-4" />
          ) : (
            <Pen className="h-4 w-4" />
          )}
          {editingStage === "doc" ? t("closeEdit") : t("edit")}
        </Button>
      )}
      {!isOwner && (
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant="outline"
          onClick={() => handleJoinOrLeave()}
        >
          {isLocalJoined ? t("leave") : t("join")}
        </Button>
      )}

      {doc && <DocMenu doc={doc} />}
      {isLoading && <OverlayLoading />}
    </ToolbarLayout>
  );
}
