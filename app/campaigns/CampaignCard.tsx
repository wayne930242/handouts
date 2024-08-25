"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { CampaignBase } from "@/types/interfaces";
import { Pencil } from "lucide-react";
import Link from "next/link";

export default function CampaignCard({ campaign }: { campaign: CampaignBase }) {
  return (
    <Card>
      <CardHeader className="cursor-pointer hover:bg-accent">
        <Link
          href={`/campaigns/info/${campaign.id}`}
          className="flex items-center gap-1.5 justify-between"
        >
          <CardTitle>{campaign.name}</CardTitle>
          <Pencil className="h-4 w-4" />
        </Link>
      </CardHeader>
      <CardContent>
        <CardDescription>{campaign.description}</CardDescription>
      </CardContent>

      <CardFooter>
        <div className="flex justify-between items-center gap-2 w-full">
          <Button
            type="button"
            onClick={() => {
              navigator.clipboard.writeText(campaign.id);
              toast({
                title: "ID 已複製到剪貼簿",
                description: `請將此 ID ——${campaign.id}——和你設定的通關密語分享給玩家。`,
              });
            }}
          >
            複製 ID
          </Button>
          <Link href={`/campaigns/${campaign.id}`}>
            <Button variant="secondary">編輯手邊資料</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
