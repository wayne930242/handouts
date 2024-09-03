"use client";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { ArrowLeft, Eye, Pen } from "lucide-react";
import { Link } from "@/navigation";
import { useTranslations } from "next-intl";
import { Doc } from "@/types/interfaces";
import DocMenu from "./DocMenu";
import { useClient } from "@/lib/supabase/client";

export default function Toolbar({
  doc,
  isOwner,
  isFavorite,
}: {
  doc: Doc;
  isOwner?: boolean;
  isFavorite?: boolean;
}) {
  const t = useTranslations("Toolbar");
  const supabase = useClient();

  const { editing, setEditing } = useAppStore((state) => ({
    editing: state.editingDoc,
    setEditing: state.setEditingDoc,
  }));

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
        {isOwner && (
          <Button
            size="sm"
            className="flex gap-2 items-center"
            variant={editing ? "outline" : "default"}
            onClick={() => setEditing(!editing)}
          >
            {editing ? (
              <Eye className="h-4 w-4" />
            ) : (
              <Pen className="h-4 w-4" />
            )}
            {editing ? t("closeEdit") : t("edit")}
          </Button>
        )}

        {doc && <DocMenu doc={doc} />}
      </div>
    </div>
  );
}
