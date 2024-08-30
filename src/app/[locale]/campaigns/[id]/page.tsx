import { createClient } from "@/lib/supabase/server";

import PageLayout from "@/components/layouts/PageLayout";
import { getPassphrase } from "@/lib/passphrase";
import Campaign from "./Campaign";
import { redirect } from "@/navigation";

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

  const c_passphrase = await getPassphrase(id);

  if (!c_passphrase) {
    return redirect("/?campaign_id=" + id);
  }

  const { data: isAuthorized, error: authError } = await supabase.rpc(
    "check_campaign_passphrase_rpc",
    {
      campaign_id: id,
      input_passphrase: passphrase ?? c_passphrase,
    }
  );

  if (!isAuthorized || authError) {
    return redirect("/?campaign_id=" + id);
  }

  return (
    <PageLayout>
      <Campaign campaignId={id} isAuthorized={isAuthorized} />
    </PageLayout>
  );
}
