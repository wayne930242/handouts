import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

interface Props {
  params: {
    id: string;
  };
}

export default async function CampaignPage({ params: { id } }: Props) {
  const isNew = id === "new";

  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return redirect("/login");
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <NavBar isSupabaseConnected={true} />

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3"></div>

      <Footer />
    </div>
  );
}
