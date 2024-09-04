import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { createClient } from "@/lib/supabase/server";
import { getPassphrase, removePassphrase } from "@/lib/passphrase";
import {
  getCampaignDetail,
  getCampaignSEO,
} from "@/lib/supabase/query/campaignsQuery";

import Campaign from "./Campaign";

import { redirect } from "@/navigation";
import PageLayout from "@/components/layouts/PageLayout";
import { genSEO } from "@/lib/defaultSEO";
import { BASE_URL } from "@/config/app";

interface Props {
  params: {
    id: string;
    locale: string;
  };
  searchParams: {
    passphrase?: string;
  };
}

export async function generateMetadata({
  params: { id, locale },
}: Omit<Props, "children">) {
  const supabase = createClient();
  const { data: campaign, error } = await getCampaignSEO(supabase, id);

  if (error) {
    return await genSEO({ locale });
  }

  return await genSEO({
    locale,
    title: campaign?.name,
    description: campaign?.description ?? undefined,
    url: `${BASE_URL}/campaigns/${id}`,
    images: campaign?.banner_url ? [{ url: campaign.banner_url }] : undefined,
  });
}

export default async function CampaignPage({
  params: { id },
  searchParams: { passphrase },
}: Props) {
  const supabase = createClient();

  const c_passphrase = await getPassphrase(id, "campaigns");

  const { data: isAuthorized, error: authError } = await supabase.rpc(
    "check_campaign_passphrase_rpc",
    {
      campaign_id: id,
      input_passphrase: passphrase ?? c_passphrase ?? "",
    }
  );

  if (!isAuthorized || authError) {
    await removePassphrase(id, "campaigns");
    console.error(authError);
    return redirect("/?campaign_id=" + id);
  }

  const {
    data: { session },
  } = await supabase.auth.getSession();

  const queryClient = new QueryClient();
  await prefetchQuery(
    queryClient,
    getCampaignDetail(supabase, id, session?.user?.id)
  );

  return (
    <PageLayout>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Campaign
          campaignId={id}
          isAuthorized={isAuthorized}
          userId={session?.user?.id}
        />
      </HydrationBoundary>
    </PageLayout>
  );
}
