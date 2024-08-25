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
          <div className="flex gap-2 items-center">
            <Button
              type="button"
              onClick={() => {
                const info = {
                  id: campaign.id,
                  passphrase: campaign.passphrase,
                  url: `https://handouts.wayneh.tw/campaigns/${campaign.id}`,
                };

                navigator.clipboard.writeText(JSON.stringify(info, null, 2));

                toast({
                  title: "資訊已複製到剪貼簿",
                  description: `將資訊分享給玩家，就可以開始遊戲了。`,
                });
              }}
            >
              複製資訊
            </Button>
          </div>
          <Link href={`/campaigns/${campaign.id}`}>
            <Button variant="secondary">編輯 / 檢視</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
