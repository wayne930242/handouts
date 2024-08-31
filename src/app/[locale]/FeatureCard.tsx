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
    <Wrapper href={href!}>
      <Card
        className={cn(
          "flex flex-col gap-y-1 w-full min-h-48 bg-accent text-accent-foreground hover:bg-accent/80",
          {
            "cursor-pointer": href,
          }
        )}
      >
        <CardHeader>
          <div className="flex justify-center w-full">{icon}</div>
          <CardTitle className="w-full text-center">{title}</CardTitle>
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
