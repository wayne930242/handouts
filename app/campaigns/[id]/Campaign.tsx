'use client'
import useCampaignData from "@/lib/hooks/useCampaignData"
import { createClient } from "@/utils/supabase/client"

export default function Campaign({ campaignId, isAuthorized }: Props) {
  const supabase = createClient()

  const { campaignData } = useCampaignData(supabase, campaignId, isAuthorized)

  return <div>Campaign</div>
}

interface Props {
  campaignId: number;
  isAuthorized: boolean;
}
