"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { getDocInfo } from "@/lib/supabase/query/docsQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSession from "@/lib/hooks/useSession";
import Toolbar from "./DocToolbar";
import useAppStore from "@/lib/store/useAppStore";
import { PacmanLoader } from "react-spinners";

const DocEditor = dynamic(() => import("./DocEditor"), {
  ssr: false,
});
const DocViewer = dynamic(() => import("./DocViewer"), {
  ssr: false,
});

interface Props {
  docId: string;
}

export default function Doc({ docId }: Props) {
  const supabase = useMemo(() => createClient(), []);
  const { data: doc, isFetching, refetch } = useQuery(getDocInfo(supabase, docId));

  const { editingDoc } = useAppStore((state) => ({
    editingDoc: state.editingDoc,
  }));

  const session = useSession();
  const canEdit = doc?.owner_id === session?.user?.id;

  return doc ? (
    <div className="w-full">
      {canEdit && <Toolbar doc={doc} />}
      <div className="flex flex-col gap-2 w-full my-2 px-2">
        {editingDoc && <DocEditor doc={doc} callback={refetch} />}
        {!editingDoc && <DocViewer doc={doc} />}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </div>
  );
}
