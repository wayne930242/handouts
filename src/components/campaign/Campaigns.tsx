"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useTranslations } from "next-intl";
import { PacmanLoader } from "react-spinners";
import { Star } from "lucide-react";

import { useClient } from "@/lib/supabase/client";
import {
  getMyCampaigns,
  getMyFavCampaigns,
  getOwnedCampaigns,
} from "@/lib/supabase/query/campaignsQuery";
import { cn } from "@/lib/utils";

import CampaignCard from "./CampaignCard";

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

export default function Campaigns({ userId }: { userId: string }) {
  const supabase = useClient();
  const { data: ownedCampaigns, isFetching: isFetchingOwnedCampaigns } =
    useQuery(getOwnedCampaigns(supabase, userId));
  const { data: myCampaigns, isFetching: isFetchingMyCampaigns } = useQuery(
    getMyCampaigns(supabase, userId)
  );
  const { data: MyFavCampaigns, isFetching: isFetchingMyFavCampaigns } =
    useQuery(getMyFavCampaigns(supabase, userId!));

  const t = useTranslations("CampaignPage");
  const isFetching =
    isFetchingOwnedCampaigns ||
    isFetchingMyCampaigns ||
    isFetchingMyFavCampaigns;
  const hasData = !!(
    ownedCampaigns?.length ||
    myCampaigns?.length ||
    MyFavCampaigns?.length
  );

  return isFetching ? (
    <main className="flex flex-col items-center justify-center h-96">
      <PacmanLoader color="#bbb" loading={isFetchingOwnedCampaigns} size={24} />
    </main>
  ) : !hasData ? (
    <main className="flex flex-col items-center justify-center gap-2 text-center py-12">
      <div className="text-2xl font-bold">{t("noCampaigns")}</div>
      <div className="text-sm text-muted-foreground">{t("createCampaign")}</div>
    </main>
  ) : (
    <main className="grid grid-cols-1 divide-y gap-y-4">
      <CardsArea
        title={t("myFavorites")}
        hidden={!MyFavCampaigns?.length}
        icon={<Star className="h-5 w-5 fill-yellow-300 stroke-yellow-300" />}
      >
        {MyFavCampaigns?.map((campaign) => (
          <CampaignCard campaign={campaign} key={campaign.id} />
        ))}
      </CardsArea>
      <CardsArea title={t("ownedCampaigns")} hidden={!ownedCampaigns?.length}>
        {ownedCampaigns?.map((campaign) => (
          <CampaignCard campaign={campaign} key={campaign.id} />
        ))}
      </CardsArea>
      <CardsArea title={t("myCampaigns")} hidden={!myCampaigns?.length}>
        {myCampaigns?.map((campaign) => (
          <CampaignCard campaign={campaign} key={campaign.id} />
        ))}
      </CardsArea>
    </main>
  );
}
