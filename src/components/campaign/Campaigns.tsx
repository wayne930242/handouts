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
import ImportCampaignButton from "@/components/campaign/ImportCampaignButton";
import DataToolbar from "@/components/toolbar/DataToolbar";

export default function Campaigns({ userId }: { userId: string }) {
  const supabase = useClient();
  const {
    data: ownedCampaigns,
    isFetching: isFetchingOwnedCampaigns,
    refetch: refetchOwnedCampaigns,
  } = useQuery(getOwnedCampaigns(supabase, userId));
  const {
    data: myCampaigns,
    isFetching: isFetchingMyCampaigns,
    refetch: refetchMyCampaigns,
  } = useQuery(getMyCampaigns(supabase, userId));
  const {
    data: MyFavCampaigns,
    isFetching: isFetchingMyFavCampaigns,
    refetch: refetchMyFavCampaigns,
  } = useQuery(getMyFavCampaigns(supabase, userId!));

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
    <div className="w-full flex flex-col gap-2">
      <DataToolbar
        tableKey="campaigns"
        isRefreshing={isFetching}
        handleRefresh={() => {
          refetchOwnedCampaigns();
          refetchMyCampaigns();
          refetchMyFavCampaigns();
        }}
      >
        <ImportCampaignButton />
      </DataToolbar>

      <QueryListLayout
        isLoading={isFetching}
        noItemTitle={t("noCampaigns")}
        noItemDescription={t("createCampaign")}
        hasNoItem={hasNoItem}
        items={[
          {
            title: t("myFavorites"),
            icon: (
              <Star className="h-5 w-5 fill-yellow-300 stroke-yellow-300" />
            ),
            children: MyFavCampaigns?.map((campaign) => (
              <CampaignCard campaign={campaign} key={`${campaign.id}-myfav`} />
            )),
          },
          {
            title: t("ownedCampaigns"),
            children: ownedCampaigns?.map((campaign) => (
              <CampaignCard campaign={campaign} key={`${campaign.id}-owned`} />
            )),
          },
          {
            title: t("myCampaigns"),
            children: myCampaigns?.map((campaign) => (
              <CampaignCard campaign={campaign} key={`${campaign.id}-my`} />
            )),
          },
        ]}
      />
    </div>
  );
}
