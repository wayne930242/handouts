"use client";

import { CampaignInList } from "@/types/interfaces";
import ItemCard from "../card/ItemCard";

export default function CampaignCard({
  campaign,
}: {
  campaign: CampaignInList;
}) {
  return (
    <ItemCard
      tableName="campaigns"
      ownerInfo={{
        id: campaign.gm_id,
        display_name: campaign.gm?.display_name,
        avatar_url: campaign.gm?.avatar_url,
      }}
      bannerUrl={campaign.banner_url}
      title={campaign.name}
      description={campaign.description}
      id={campaign.id}
      passphrase={campaign.passphrase}
    />
  );
}
