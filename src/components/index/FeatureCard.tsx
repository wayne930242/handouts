import { Fragment } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/navigation";
import { cn } from "@/lib/utils";

export default function FeatureCard({
  title,
  description,
  icon,
  href = "",
}: Props) {
  const Wrapper = href
    ? Link
    : (props: any) => <Fragment>{props.children}</Fragment>;

  return (
    <Wrapper href={href!} className="h-full">
      <Card
        className={cn(
          "flex flex-col gap-y-1 w-full min-h-36 border-border hover:bg-accent/60 h-full",
          {
            "cursor-pointer": href,
          }
        )}
      >
        <CardHeader>
          <div className="flex justify-center w-full">{icon}</div>
          <CardTitle className="w-full text-center text-xl">{title}</CardTitle>
        </CardHeader>
        <CardContent className="grow">
          <CardDescription>{description}</CardDescription>
        </CardContent>
      </Card>
    </Wrapper>
  );
}

interface Props {
  title: string;
  description: string;
  icon: React.ReactNode;
  href?: string;
}
