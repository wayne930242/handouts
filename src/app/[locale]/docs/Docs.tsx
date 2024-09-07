"use client";

import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { PacmanLoader } from "react-spinners";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { useClient } from "@/lib/supabase/client";
import {
  getDocsByOwnerId,
  getMyDocs,
  getMyFavDocs,
} from "@/lib/supabase/query/docsQuery";
import { cn } from "@/lib/utils";

import DocCard from "./DocCard";

interface Props {
  userId: string;
}

const CardsArea = ({
  title,
  children,
  hidden,
  icon,
}: {
  title: string;
  children: React.ReactNode;
  hidden?: boolean;
  icon?: React.ReactNode;
}) => {
  return (
    <div className={cn("w-full flex flex-col gap-2 py-4 px-2", { hidden })}>
      <h2 className="text-2xl font-bold flex items-center gap-x-2">
        <span>{title}</span>
        <span>{icon}</span>
      </h2>
      <div className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {children}
      </div>
    </div>
  );
};

export default function Docs({ userId }: Props) {
  const t = useTranslations("DocsPage");
  const supabase = useClient();

  const { data: ownedDoc, isFetching: isFetchingOwnedDocs } = useQuery(
    getDocsByOwnerId(supabase, userId)
  );
  const { data: favoriteDocs, isFetching: isFetchingFavoriteDocs } = useQuery(
    getMyFavDocs(supabase, userId)
  );
  const { data: myDocs, isFetching: isFetchingMyDocs } = useQuery(
    getMyDocs(supabase, userId)
  );
  const isFetching =
    isFetchingOwnedDocs || isFetchingFavoriteDocs || isFetchingMyDocs;
  const hasData = !!(
    ownedDoc?.length ||
    favoriteDocs?.length ||
    myDocs?.length
  );

  return isFetching ? (
    <main className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetchingOwnedDocs} size={24} />
    </main>
  ) : !hasData ? (
    <main className="flex flex-col items-center justify-center gap-2 text-center py-12">
      <div className="text-2xl font-bold">{t("noDocs")}</div>
      <div className="text-sm text-muted-foreground">{t("createCampaign")}</div>
    </main>
  ) : (
    <main className="grid grid-cols-1 divide-y gap-y-4">
      <CardsArea
        title={t("myFavorites")}
        hidden={!favoriteDocs?.length}
        icon={<Star className="h-5 w-5 fill-yellow-300 stroke-yellow-300" />}
      >
        {favoriteDocs?.map((doc) => (
          <DocCard doc={doc} key={doc.id} />
        ))}
      </CardsArea>
      <CardsArea title={t("ownedDocs")} hidden={!ownedDoc?.length}>
        {ownedDoc?.map((doc) => (
          <DocCard doc={doc} key={doc.id} />
        ))}
      </CardsArea>
      <CardsArea title={t("myDocs")} hidden={!myDocs?.length}>
        {myDocs?.map((doc) => (
          <DocCard doc={doc} key={doc.id} />
        ))}
      </CardsArea>
    </main>
  );
}
