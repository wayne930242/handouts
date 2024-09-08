import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";

import { createClient } from "@/lib/supabase/server";
import { getPassphrase, removePassphrase } from "@/lib/passphrase";

import { redirect } from "@/navigation";
import PageLayout from "@/components/layout/PageLayout";
import { getDocInfo, getDocSEO } from "@/lib/supabase/query/docsQuery";
import Doc from "../../../../components/doc/Doc";
import { BASE_URL } from "@/config/app";
import { genSEO } from "@/lib/defaultSEO";

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
  const { data: doc, error } = await getDocSEO(supabase, id);

  if (error) {
    return await genSEO({ locale });
  }

  return await genSEO({
    locale,
    title: doc?.title,
    description: doc?.description ?? undefined,
    url: `${BASE_URL}/docs/${id}`,
    images: doc?.banner_url
      ? [{ url: doc.banner_url, width: 1200, height: 450 }]
      : undefined,
  });
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
    await removePassphrase(id, "docs");
    console.error(authError);
    return redirect("/?doc_id=" + id);
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const queryClient = new QueryClient();
  await prefetchQuery(queryClient, getDocInfo(supabase, id, user?.id));

  return (
    <PageLayout>
      <HydrationBoundary state={hydrate(queryClient, null)}>
        <Doc docId={id} userId={user?.id} />
      </HydrationBoundary>
    </PageLayout>
  );
}
