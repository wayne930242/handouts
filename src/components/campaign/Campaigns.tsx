"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { useTranslations } from "next-intl";
import { Star } from "lucide-react";

import { useClient } from "@/lib/supabase/client";
import {
  getMyCampaigns,
  getMyFavCampaigns,
  getOwnedCampaigns,
} from "@/lib/supabase/query/campaignsQuery";

import CampaignCard from "./CampaignCard";
import QueryListLayout from "../layout/itemsList/QueryListLayout";

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
  const hasNoItem = !(
    ownedCampaigns?.length ||
    myCampaigns?.length ||
    MyFavCampaigns?.length
  );

  return (
    <QueryListLayout
      isLoading={isFetching}
      noItemTitle={t("noCampaigns")}
      noItemDescription={t("createCampaign")}
      hasNoItem={hasNoItem}
      items={[
        {
          title: t("myFavorites"),
          icon: <Star className="h-5 w-5 fill-yellow-300 stroke-yellow-300" />,
          children: MyFavCampaigns?.map((campaign) => (
            <CampaignCard campaign={campaign} key={campaign.id} />
          )),
        },
        {
          title: t("ownedCampaigns"),
          children: ownedCampaigns?.map((campaign) => (
            <CampaignCard campaign={campaign} key={campaign.id} />
          )),
        },
        {
          title: t("myCampaigns"),
          children: myCampaigns?.map((campaign) => (
            <CampaignCard campaign={campaign} key={campaign.id} />
          )),
        },
      ]}
    />
  );
}
