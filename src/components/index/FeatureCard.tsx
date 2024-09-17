"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useRouter } from "@/navigation";
import { cn } from "@/lib/utils";
import { useTransition } from "react";
import OverlayLoading from "../layout/OverlayLoading";

export default function FeatureCard({
  title,
  description,
  icon,
  href = "",
}: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <Card
      className={cn(
        "flex flex-col gap-y-1 w-full min-h-36 border-border hover:bg-accent/60 h-full",
        {
          "cursor-pointer": href,
        }
      )}
      onClick={() => {
        if (!href) return;
        startTransition(() => {
          router.push(href);
        });
      }}
    >
      <CardHeader>
        <div className="flex justify-center w-full">{icon}</div>
        <CardTitle className="w-full text-center text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="grow">
        <CardDescription>{description}</CardDescription>
      </CardContent>
      {isPending && <OverlayLoading />}
    </Card>
  );
}

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}
