import { createClient } from "@/lib/supabase/server";
import { CampaignBase } from "@/types/interfaces";

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

  let data: CampaignBase = {
    id: "new",
    gm_id: user.id,
    name: "New Campaign",
    description: undefined,
    passphrase: undefined,
  };

  if (!isNew) {
    const result = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    data = {
      id: result.data.id,
      gm_id: result.data.gm_id,
      name: result.data.name,
      description: result.data.description ?? undefined,
      passphrase: result.data.passphrase ?? undefined,
    };
  }

  return (
    <PageLayout needsAuth>
      <CampaignForm serverData={data} />
      {id !== "new" && (
        <>
          <Separator />
          <CampaignDeleteZone campaignId={id} />
        </>
      )}
    </PageLayout>
  );
}
