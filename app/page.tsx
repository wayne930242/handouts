import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

import PageLayout from "@/components/layouts/PageLayout";
import PassphraseForm from "@/components/PassphraseForm";

interface Props {
  searchParams: {
    campaign_id?: string;
  };
}

export default async function Index({ searchParams: { campaign_id } }: Props) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    return redirect("/campaigns");
  }

  return (
    <PageLayout>
      <h1 className="text-2xl font-bold text-center text-muted-foreground my-12">
        歡迎使用 ShareHandouts！
      </h1>

      <div className="flex flex-col items-center">
        <PassphraseForm defaultId={campaign_id} />
      </div>
    </PageLayout>
  );
}
