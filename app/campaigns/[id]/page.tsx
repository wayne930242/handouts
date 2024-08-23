import { createClient } from "@/utils/supabase/server";

import PageLayout from "@/components/layouts/PageLayout";
import { getPassphrase } from "@/lib/passphrase";
import Campaign from "./Campaign";

interface Props {
  params: {
    id: string;
  };
  searchParams: {
    passphrase?: string;
  };
}

export default async function CampaignPage({
  params: { id },
  searchParams: { passphrase },
}: Props) {
  const supabase = createClient();
  const c_passphrase = getPassphrase(id);

  const { data: isAuthorized, error: authError } = await supabase.rpc(
    "check_campaign_passphrase_rpc",
    {
      campaign_id: id,
      input_passphrase: passphrase ?? c_passphrase,
    }
  );

  return (
    <PageLayout needsAuth>
      <Campaign campaignId={Number(id)} isAuthorized={isAuthorized} />
    </PageLayout>
  );
}
