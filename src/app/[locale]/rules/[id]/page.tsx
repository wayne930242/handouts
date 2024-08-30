import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { createClient } from "@/lib/supabase/server";
import { getPassphrase } from "@/lib/passphrase";
import { getCampaignDetail } from "@/lib/supabase/query/campaignsQuery";

import { redirect } from "@/navigation";
import PageLayout from "@/components/layouts/PageLayout";
import { getRuleInfo } from "@/lib/supabase/query/rulesQuery";
import Rule from "./Rule";

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

  const c_passphrase = await getPassphrase(id, "rules");

  const { data: isAuthorized, error: authError } = await supabase.rpc(
    "check_rule_passphrase_rpc",
    {
      input_passphrase: passphrase ?? c_passphrase ?? "",
      rule_id: id,
    }
  );

  if (!isAuthorized || authError) {
    console.log(authError, isAuthorized);
    return redirect("/?rule_id=" + id);
  }

  const queryClient = new QueryClient();
  await prefetchQuery(queryClient, getRuleInfo(supabase, id));

  return (
    <PageLayout needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Rule ruleId={id} />
      </HydrationBoundary>
    </PageLayout>
  );
}
