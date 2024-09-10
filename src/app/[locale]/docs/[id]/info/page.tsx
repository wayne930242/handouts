import { createClient } from "@/lib/supabase/server";

import DocForm from "@/components/doc/DocForm";
import PageLayout from "@/components/layout/PageLayout";
import { Separator } from "@/components/ui/separator";
import DocDeleteZone from "@/components/doc/DocDeleteZone";
import { hydrate, HydrationBoundary, QueryClient } from "@tanstack/react-query";
import { prefetchQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getDocInfo } from "@/lib/supabase/query/docsQuery";

interface Props {
  params: {
    id: string;
  };
}

export default async function DocPage({ params: { id } }: Props) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const queryClient = new QueryClient();

  if (id !== "new" && user) {
    await prefetchQuery(queryClient, getDocInfo(supabase, id, user.id));
  }

  return (
    <PageLayout needsAuth>
      {user && (
        <>
          <HydrationBoundary state={hydrate(queryClient, null)}>
            <DocForm id={id} userId={user.id} />
          </HydrationBoundary>
          {id !== "new" && (
            <div className="mt-4 flex flex-col gap-4">
              <Separator />
              <DocDeleteZone docId={id} />
            </div>
          )}
        </>
      )}
    </PageLayout>
  );
}
