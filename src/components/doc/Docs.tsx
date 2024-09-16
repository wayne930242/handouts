"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

import { useClient } from "@/lib/supabase/client";
import {
  getDocsByOwnerId,
  getMyDocs,
  getMyFavDocs,
} from "@/lib/supabase/query/docsQuery";

import DocCard from "./DocCard";
import DataToolbar from "@/components/toolbar/DataToolbar";
import QueryListLayout from "../layout/itemsList/QueryListLayout";

interface Props {
  userId: string;
}

export default function Docs({ userId }: Props) {
  const t = useTranslations("DocsPage");
  const supabase = useClient();

  const {
    data: ownedDocs,
    isFetching: isFetchingOwnedDocs,
    refetch: refetchOwnedDocs,
  } = useQuery(getDocsByOwnerId(supabase, userId));
  const {
    data: favoriteDocs,
    isFetching: isFetchingFavoriteDocs,
    refetch: refetchFavoriteDocs,
  } = useQuery(getMyFavDocs(supabase, userId));
  const {
    data: myDocs,
    isFetching: isFetchingMyDocs,
    refetch: refetchMyDocs,
  } = useQuery(getMyDocs(supabase, userId));
  const isFetching =
    isFetchingOwnedDocs || isFetchingFavoriteDocs || isFetchingMyDocs;
  const hasNoItem = !(
    ownedDocs?.length ||
    favoriteDocs?.length ||
    myDocs?.length
  );

  return (
    <div className="w-full flex flex-col gap-2">
      <DataToolbar
        tableKey="docs"
        isRefreshing={isFetching}
        handleRefresh={() => {
          refetchOwnedDocs();
          refetchFavoriteDocs();
          refetchMyDocs();
        }}
      />
      <QueryListLayout
        isLoading={isFetching}
        noItemTitle={t("noDocs")}
        noItemDescription={t("createDoc")}
        hasNoItem={hasNoItem}
        items={[
          {
            title: t("myFavorites"),
            icon: (
              <Star className="h-5 w-5 fill-yellow-300 stroke-yellow-300" />
            ),
            children: favoriteDocs?.map((doc) => (
              <DocCard doc={doc} key={`${doc.id}-favorite`} />
            )),
          },
          {
            title: t("ownedDocs"),
            children: ownedDocs?.map((doc) => (
              <DocCard doc={doc} key={`${doc.id}-owned`} />
            )),
          },
          {
            title: t("myDocs"),
            children: myDocs?.map((doc) => (
              <DocCard doc={doc} key={`${doc.id}-my`} />
            )),
          },
        ]}
      />
    </div>
  );
}
