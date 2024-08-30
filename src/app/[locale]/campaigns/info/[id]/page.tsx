import { createClient } from "@/lib/supabase/server";
import { CampaignData, FullCampaignData } from "@/types/interfaces";

import CampaignForm from "./CampaignForm";
import PageLayout from "@/components/layouts/PageLayout";
import { Separator } from "@/components/ui/separator";
import CampaignDeleteZone from "./DeleteZone";

interface Props {
  params: {
    id: string;
  };
}

export default async function CampaignPage({ params: { id } }: Props) {
  const isNew = id === "new";

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <></>;
  }

  const newCampaign: FullCampaignData = {
    id: "new",
    gm_id: user.id,
    name: "New Campaign",
    description: null,
    passphrase: null,
    status: "ACTIVE",
  };

  const getData = async () => {
    if (!isNew) {
      try {
        const result = await supabase
          .from("campaigns")
          .select("*")
          .eq("id", id)
          .single();
        if (!result.data) {
          throw new Error("Campaign not found");
        }
        return result.data;
      } catch (error) {
        return newCampaign;
      }
    } else {
      return newCampaign;
    }
  };

  return (
    <PageLayout needsAuth>
      <CampaignForm serverData={await getData()} />
      {id !== "new" && (
        <>
          <Separator />
          <CampaignDeleteZone campaignId={id} />
        </>
      )}
    </PageLayout>
  );
}
