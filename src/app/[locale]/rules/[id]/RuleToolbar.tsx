"use client";
import { Button } from "@/components/ui/button";
import useAppStore from "@/lib/store/useAppStore";
import { ArrowLeft, Eye, Pen } from "lucide-react";
import { createClient } from "@/lib/supabase/client";
import { Link, useRouter } from "@/navigation";
import { useTranslations } from "next-intl";
import { Rule } from "@/types/interfaces";
import RuleMenu from "./RuleMenu";

export default function Toolbar({ rule }: { rule: Rule }) {
  const t = useTranslations("Toolbar");
  const router = useRouter();

  const { editing, setEditing } = useAppStore((state) => ({
    editing: state.editingRule,
    setEditing: state.setEditingRule,
  }));

  const supabase = createClient();

  return (
    <div className="flex justify-between items-center w-full">
      <div className="grow-1 flex gap-2 items-center">
        <Link href="/campaigns">
          <Button
            className="flex gap-1.5 items-center"
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{t("backToList")}</span>
          </Button>
        </Link>
      </div>
      <div className="flex gap-2 items-center">
        <Button
          size="sm"
          className="flex gap-2 items-center"
          variant={editing ? "outline" : "default"}
          onClick={() => setEditing(!editing)}
        >
          {editing ? <Eye className="h-4 w-4" /> : <Pen className="h-4 w-4" />}
          {editing ? t("closeEdit") : t("edit")}
        </Button>
        {rule && <RuleMenu rule={rule} />}
      </div>
    </div>
  );
}
