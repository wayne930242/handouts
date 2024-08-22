import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Campaign } from "@/types/interfaces";
import Link from "next/link";

export default function CampaignCard({ campaign }: { campaign: Campaign }) {
  return (
    <Card className="cursor-pointer">
      <CardHeader>
        <CardTitle>{campaign.name}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription>{campaign.description}</CardDescription>
      </CardContent>

      <CardFooter>
        <div className="flex justify-end items-center gap-2 w-full">
          <Link href={`/campaigns/${campaign.id}`}>
            <Button variant="secondary">Edit</Button>
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
