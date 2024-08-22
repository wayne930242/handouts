import { createClient } from "@/utils/supabase/server";

import PageLayout from "@/components/layouts/PageLayout";
import { getPassphrase } from "@/lib/passphrase";

interface Props {
  params: {
    id: string;
  };
}

export default async function CampaignPage({ params: { id } }: Props) {
  const supabase = createClient();
  const passphrase = getPassphrase(id);

  const { data: isAuthorized, error: authError } = await supabase.rpc(
    "check_campaign_passphrase_rpc",
    {
      campaign_id: id,
      input_passphrase: passphrase,
    }
  );

  if (authError) {
    console.error("Error checking campaign access:", authError);
    throw new Error("Failed to check campaign access");
  }

  if (!isAuthorized) {
    throw new Error(
      "Access denied: Invalid passphrase or insufficient permissions"
    );
  }

  const { data, error } = await supabase
    .from("campaigns")
    .select(
      `
      id,
      gm_id,
      name,
      description,
      passphrase,
      chapters:chapters (
        id,
        campaign_id,
        title,
        order_num,
        sections:sections (
          id,
          chapter_id,
          title,
          order_num,
          handouts:handouts (
            id,
            title,
            content,
            is_public,
            section_id,
            type,
            owner_id,
            note,
            images:handout_images (
              id,
              handout_id,
              image_url,
              display_order,
              caption,
              type
            )
          )
        )
      )
    `
    )
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching campaigns:", error);
    return null;
  }
  console.log(data);

  return <PageLayout needsAuth>TEST</PageLayout>;
}
