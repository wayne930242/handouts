"use client";

import dynamic from "next/dynamic";
import { useMemo } from "react";
import { getDocInfo } from "@/lib/supabase/query/docsQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import useSession from "@/lib/hooks/useSession";
import Toolbar from "./DocToolbar";
import useAppStore from "@/lib/store/useAppStore";
import { PacmanLoader } from "react-spinners";
import { useClient } from "@/lib/supabase/client";

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
  const supabase = useClient();
  const {
    data: doc,
    isFetching,
    refetch,
  } = useQuery(getDocInfo(supabase, docId));

  const { editingDoc } = useAppStore((state) => ({
    editingDoc: state.editingDoc,
  }));

  const session = useSession();

  return doc ? (
    <div className="w-full">
      <Toolbar doc={doc} isOwner={doc?.owner_id === session?.user?.id} />
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
