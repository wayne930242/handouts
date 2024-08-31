"use client";

import { createClient } from "@/lib/supabase/client";
import { getDocsByOwnerId } from "@/lib/supabase/query/docsQuery";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useTranslations } from "next-intl";
import { PacmanLoader } from "react-spinners";
import DocCard from "./DocCard";

interface Props {
  ownerId: string;
}

export default function Docs({ ownerId }: Props) {
  const t = useTranslations("DocsPage");
  const supabase = createClient();

  const { data: docs, isFetching } = useQuery(
    getDocsByOwnerId(supabase, ownerId)
  );

  return isFetching ? (
    <main className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </main>
  ) : !docs?.length ? (
    <main className="flex flex-col items-center justify-center gap-2 text-center py-12">
      <div className="text-2xl font-bold">{t("noDocs")}</div>
      <div className="text-sm text-muted-foreground">{t("createCampaign")}</div>
    </main>
  ) : (
    <main className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {docs?.map((doc) => (
        <DocCard doc={doc} key={doc.id} />
      ))}
    </main>
  );
}
