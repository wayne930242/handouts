import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { CampaignBase } from "@/types/interfaces";
import Link from "next/link";

export default function CampaignCard({ campaign }: { campaign: CampaignBase }) {
  return (
    <Card>
      <CardHeader className="cursor-pointer hover:bg-accent">
        <Link href={`/campaigns/${campaign.id}`}>
          <CardTitle>{campaign.name}</CardTitle>
        </Link>
      </CardHeader>
      <CardContent>
        <CardDescription>{campaign.description}</CardDescription>
      </CardContent>

      <CardFooter>
        <div className="flex justify-end items-center gap-2 w-full">
          <Link href={`/campaigns/info/${campaign.id}`}>
            <Button variant="secondary">Edit</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
