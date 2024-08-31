import { createClient } from "@/lib/supabase/server";

import CampaignForm from "./CampaignForm";
import PageLayout from "@/components/layouts/PageLayout";
import { Separator } from "@/components/ui/separator";
import CampaignDeleteZone from "./CampaignDeleteZone";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getCampaignInfo } from "@/lib/supabase/query/campaignsQuery";

interface Props {
  params: {
    id: string;
  };
}

export default async function CampaignPage({ params: { id } }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return <></>;
  }

  const queryClient = new QueryClient();

  if (id !== "new") {
    await prefetchQuery(queryClient, getCampaignInfo(supabase, id, user.id));
  }

  return (
    <PageLayout needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <CampaignForm id={id} userId={user.id} />
      </HydrationBoundary>

      {id !== "new" && (
        <div className="mt-4 flex flex-col gap-4">
          <Separator />
          <CampaignDeleteZone campaignId={id} />
        </div>
      )}
    </PageLayout>
  );
}