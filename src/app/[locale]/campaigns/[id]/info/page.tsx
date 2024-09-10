import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { getCampaignInfo } from "@/lib/supabase/query/campaignsQuery";
import { createClient } from "@/lib/supabase/server";

import CampaignForm from "@/components/campaign/CampaignForm";
import PageLayout from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import CampaignDeleteZone from "@/components/campaign/CampaignDeleteZone";

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

  const queryClient = new QueryClient();

  if (id !== "new" && user) {
    await prefetchQuery(queryClient, getCampaignInfo(supabase, id, user.id));
  }

  return (
    <PageLayout needsAuth>
      {user && (
        <>
          <HydrationBoundary state={hydrate(queryClient, null)}>
            <CampaignForm id={id} userId={user.id} />
          </HydrationBoundary>
          {id !== "new" && (
            <div className="mt-4 flex flex-col gap-4">
              <Separator />
              <CampaignDeleteZone campaignId={id} />
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
