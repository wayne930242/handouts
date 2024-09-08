import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { createClient } from "@/lib/supabase/server";
import { getPassphrase, removePassphrase } from "@/lib/passphrase";
import {
  getCampaignDetail,
  getCampaignSEO,
} from "@/lib/supabase/query/campaignsQuery";

import Campaign from "../../../../components/campaign/Campaign";

import { redirect } from "@/navigation";
import PageLayout from "@/components/layout/PageLayout";
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
    images: campaign?.banner_url
      ? [{ url: campaign.banner_url, width: 1200, height: 450 }]
      : undefined,
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
    data: { user },
  } = await supabase.auth.getUser();

  const queryClient = new QueryClient();
  await prefetchQuery(queryClient, getCampaignDetail(supabase, id, user?.id));

  return (
    <PageLayout>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        {isAuthorized && <Campaign campaignId={id} userId={user?.id} />}
      </HydrationBoundary>
    </PageLayout>
  );
}
