import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import Toolbar from "@/components/campaigns/Toolbar";

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
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <div className="w-full">
        <div className="py-4 font-medium bg-accent text-accent-foreground text-center">
          Hello, GM! You can manage your campaigns here.
        </div>

        <NavBar isSupabaseConnected={true} />
        <div className="mt-2">
          <Toolbar />
        </div>
      </div>
      <div className="w-full grow">
        <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 justify-start w-full justify-self-stretch">
          <main className="flex-1 flex flex-col gap-6"></main>
        </div>
      </div>

      <Footer />
    </div>
  );
}
