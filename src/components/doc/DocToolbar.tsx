"use client";
import { useState, useEffect } from "react";
import { Eye, Pen } from "lucide-react";
import { useTranslations } from "next-intl";

import useAppStore from "@/lib/store/useAppStore";
import useSessionUser from "@/lib/hooks/useSession";

import DocMenu from "./DocMenu";
import { Button } from "@/components/ui/button";
import FavoriteButton from "@/components/toolbar/FavoriteButton";
import OverlayLoading from "@/components/layout/OverlayLoading";

import { DocInList } from "@/types/interfaces";
import ToolbarLayout from "../layout/ToolbarLayout";
import useHandleFavAndJoin from "@/lib/hooks/useHandleFavAndJoin";
import useDocStore from "@/lib/store/useDocStore";

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
  const user = useSessionUser();

  const [isLoading, setIsLoading] = useState(false);
  const [isLocalFavorite, setIsLocalFavorite] = useState(false);
  const [isLocalJoined, setIsLocalJoined] = useState(false);

  useEffect(() => {
    setIsLocalJoined(!!isJoined);
  }, [setIsLocalJoined, isJoined]);

  useEffect(() => {
    setIsLocalFavorite(!!isFavorite);
  }, [setIsLocalFavorite, isFavorite]);

  const { isEditing, setIsEditing, setEditingId } = useDocStore((state) => ({
    isEditing: state.isEditing,
    setIsEditing: state.setIsEditing,
    setEditingId: state.setEditingId,
  }));

  const {
    addOrRemoveFavorite: handleAddOrRemoveFavorite,
    joinOrLeave: handleJoinOrLeave,
  } = useHandleFavAndJoin({
    tableName: "docs",
    userId: user?.id,
    itemId: doc?.id,
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
          variant={isEditing ? "outline" : "default"}
          onClick={() => {
            if (isEditing) {
              setIsEditing(false);
              setEditingId(null);
            } else {
              setIsEditing(true);
              setEditingId(doc.id);
            }
          }}
        >
          {isEditing ? (
            <Eye className="h-4 w-4" />
          ) : (
            <Pen className="h-4 w-4" />
          )}
          {isEditing ? t("closeEdit") : t("edit")}
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

      {doc && <DocMenu doc={doc} isOwner={isOwner} />}
      {isLoading && <OverlayLoading />}
    </ToolbarLayout>
  );
}
