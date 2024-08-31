import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { createClient } from "@/lib/supabase/server";
import { getPassphrase } from "@/lib/passphrase";

import { redirect } from "@/navigation";
import PageLayout from "@/components/layouts/PageLayout";
import { getDocInfo } from "@/lib/supabase/query/docsQuery";
import Doc from "./Doc";

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

  const c_passphrase = await getPassphrase(id, "docs");

  const { data: isAuthorized, error: authError } = await supabase.rpc(
    "check_doc_passphrase_rpc",
    {
      input_passphrase: passphrase ?? c_passphrase ?? "",
      doc_id: id,
    }
  );

  if (!isAuthorized || authError) {
    console.log(authError, isAuthorized);
    return redirect("/?doc_id=" + id);
  }

  const queryClient = new QueryClient();
  await prefetchQuery(queryClient, getDocInfo(supabase, id));

  return (
    <PageLayout needsAuth>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Doc docId={id} />
      </HydrationBoundary>
    </PageLayout>
  );
}
