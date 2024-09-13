import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function GameTabCardLayout({
  title,
  children,
  action,
}: {
  title: string;
  children?: React.ReactNode;
  action?: React.ReactNode;
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-x-2">
          <p>{title}</p>
          <div className="flex items-center justify-center">{action}</div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">{children}</CardContent>
    </Card>
  );
}
