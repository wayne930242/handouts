import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import Toolbar from "./Toolbar";
import CampaignCard from "./CampaignCard";
import PageLayout from "@/components/layouts/PageLayout";
import { Alert, AlertDescription } from "@/components/ui/alert";

export default async function ProtectedPage() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  const { data: campaigns } = await supabase
    .from("campaigns")
    .select("*")
    .eq("gm_id", user.id);

  return (
    <PageLayout header={<Toolbar />} needsAuth>
      <Alert variant="destructive">
        <AlertDescription>
          測試期間，每個使用者只能創建 1
          個戰役。如果你在此時想創建更多戰役，請聯絡作者。
        </AlertDescription>
      </Alert>
      <main className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {campaigns?.map((campaign) => (
          <CampaignCard campaign={campaign} key={campaign.id} />
        ))}
        {campaigns?.length === 0 && (
          <div className="flex flex-col items-center justify-center gap-2 text-center">
            <div className="text-2xl font-bold">No campaigns found</div>
            <div className="text-sm text-muted-foreground">
              You can create a new campaign.
            </div>
          </div>
        )}
      </main>
    </PageLayout>
  );
}
