"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { getRuleInfo } from "@/lib/supabase/query/rulesQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSession from "@/lib/hooks/useSession";
import Toolbar from "./RuleToolbar";
import useAppStore from "@/lib/store/useAppStore";
import { PacmanLoader } from "react-spinners";

const RuleEditor = dynamic(() => import("./RuleEditor"), {
  ssr: false,
});
const RuleViewer = dynamic(() => import("./RuleViewer"), {
  ssr: false,
});

interface Props {
  ruleId: string;
}

export default function Rule({ ruleId }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const { data: rule, isFetching } = useQuery(getRuleInfo(supabase, ruleId));

  const { editingRule } = useAppStore((state) => ({
    editingRule: state.editingRule,
  }));

  const session = useSession();
  const canEdit = rule?.owner_id === session?.user?.id;

  return rule ? (
    <div className="w-full">
      {canEdit && <Toolbar rule={rule} />}
      <div className="flex flex-col gap-2 w-full my-2 px-2">
        {editingRule && <RuleEditor rule={rule} />}
        {!editingRule && <RuleViewer rule={rule} />}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </div>
  );
}
