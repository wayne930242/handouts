import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { Campaign } from "@/types/interfaces";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import CampaignForm from "./CampaignForm";

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

  let data: Campaign = {
    id: "new",
    gm_id: user.id,
    name: "New Campaign",
    description: undefined,
    passphrase: undefined,
  };

  if (!isNew) {
    const result = await supabase
      .from("campaigns")
      .select("*")
      .eq("id", id)
      .single();

    data = {
      id: result.data.id,
      gm_id: result.data.gm_id,
      name: result.data.name,
      description: result.data.description ?? undefined,
      passphrase: result.data.passphrase ?? undefined,
    };
  }

  return (
    <div className="flex-1 w-full flex flex-col gap-20 items-center">
      <NavBar isSupabaseConnected={true} />

      <div className="flex-1 flex flex-col gap-20 max-w-4xl px-3 w-full">
        <CampaignForm serverData={data} />
      </div>

      <Footer />
    </div>
  );
}
