import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { createClient } from "@/lib/supabase/server";
import { getPassphrase } from "@/lib/passphrase";
import { getCampaignDetail } from "@/lib/supabase/query/campaignQuery";

import Campaign from "./Campaign";

import { redirect } from "@/navigation";
import PageLayout from "@/components/layouts/PageLayout";

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

  const { data: isAuthorized, error: authError } = await supabase.rpc(
    "check_campaign_passphrase_rpc",
    {
      campaign_id: id,
      input_passphrase: passphrase ?? c_passphrase ?? "",
    }
  );

  if (!isAuthorized || authError) {
    return redirect("/?campaign_id=" + id);
  }

  const queryClient = new QueryClient();
  await prefetchQuery(queryClient, getCampaignDetail(supabase, id));

  return (
    <PageLayout>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Campaign campaignId={id} isAuthorized={isAuthorized} />
      </HydrationBoundary>
    </PageLayout>
  );
}
