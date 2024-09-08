"use client";

import dynamic from "next/dynamic";
import { getDocInfo } from "@/lib/supabase/query/docsQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
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
  userId?: string;
}

export default function Doc({ docId, userId }: Props) {
  const supabase = useClient();
  const {
    data: doc,
    isFetching,
    refetch,
  } = useQuery(getDocInfo(supabase, docId, userId));

  const { editingStage } = useAppStore((state) => ({
    editingStage: state.editingStage,
  }));

  return doc ? (
    <div className="w-full">
      <Toolbar
        doc={doc}
        isOwner={doc?.owner_id === userId}
        isJoined={!!doc?.players.find((p) => p?.user?.id === userId)}
        isFavorite={!!doc?.favorite?.length}
      />
      <div className="flex flex-col gap-2 w-full my-2 px-2">
        {editingStage === "doc" && <DocEditor doc={doc} callback={refetch} />}
        {editingStage !== "doc" && <DocViewer doc={doc} />}
      </div>
    </div>
  ) : (
    <div className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </div>
  );
}
