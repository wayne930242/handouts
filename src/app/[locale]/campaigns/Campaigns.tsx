"use client";

import { createClient } from "@/lib/supabase/client";
import { getOwnedCampaignList } from "@/lib/supabase/query/getOwnedCampaignList";
import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import CampaignCard from "./CampaignCard";
import { useTranslations } from "next-intl";
import OverlayLoading from "@/components/OverlayLoading";
import { PacmanLoader } from "react-spinners";

export default function Campaigns({ gmId }: { gmId: string }) {
  const supabase = createClient();
  const { data: campaigns, isFetching } = useQuery(
    getOwnedCampaignList(supabase, gmId)
  );
  const t = useTranslations("CampaignPage");

  return isFetching ? (
    <main className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetching} size={24} />
    </main>
  ) : !campaigns?.length ? (
    <main className="flex flex-col items-center justify-center gap-2 text-center py-12">
      <div className="text-2xl font-bold">{t("noCampaigns")}</div>
      <div className="text-sm text-muted-foreground">{t("createCampaign")}</div>
    </main>
  ) : (
    <main className="grid gap-2 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {campaigns?.map((campaign) => (
        <CampaignCard campaign={campaign} key={campaign.id} />
      ))}
    </main>
  );
}
