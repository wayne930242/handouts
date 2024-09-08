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

  const handleAddOrRemoveFavorite = async () => {
    if (!doc) return;
    if (!user?.id) {
      router.push("/login");
      return;
    }
    setIsLoading(true);

    if (!isLocalFavorite && !isLocalJoined) {
      const { error } = await supabase
        .from("doc_players")
        .insert({
          doc_id: doc.id,
          user_id: user.id,
          role: isOwner ? "OWNER" : "PLAYER",
        })
        .select();
      if (!error) {
        setIsLocalJoined(true);
      }
    }

    if (!isLocalFavorite) {
      const { error } = await supabase
        .from("user_doc_favorites")
        .insert({
          doc_id: doc.id,
          user_id: user.id,
        })
        .select();
      if (!error) {
        setIsLocalFavorite(true);
      }
    } else {
      const { error } = await supabase
        .from("user_doc_favorites")
        .delete()
        .eq("doc_id", doc.id)
        .eq("user_id", user.id);
      if (!error) {
        setIsLocalFavorite(false);
      }
    }
    setIsLoading(false);
  };

  const handleJoinOrLeave = async () => {
    if (!doc) return;
    if (!user?.id) {
      router.push("/login");
      return;
    }
    setIsLoading(true);

    if (isLocalJoined) {
      const { error } = await supabase
        .from("doc_players")
        .delete()
        .eq("doc_id", doc.id)
        .eq("user_id", user.id);
      if (!error) {
        setIsLocalJoined(false);
      }
    } else {
      const { error } = await supabase
        .from("doc_players")
        .insert({
          doc_id: doc.id,
          role: isOwner ? "OWNER" : "PLAYER",
          user_id: user.id,
        })
        .select();
      if (!error) {
        setIsLocalJoined(true);
      }
    }
    setIsLoading(false);
  };

  return (
    <div className="flex justify-between items-center w-full">
      <div className="grow-1 flex gap-2 items-center">
        {/* <Link href="/campaigns">
          <Button
            className="flex gap-1.5 items-center"
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("backToList")}</span>
          </Button>
        </Link> */}
      </div>
      <div className="flex gap-2 items-center">
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
      </div>
      {isLoading && <OverlayLoading />}
    </div>
  );
}