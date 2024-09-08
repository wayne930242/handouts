import { QueryClient } from "@tanstack/react-query";
import { Construction } from "lucide-react";

import PageLayout from "@/components/layout/PageLayout";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: {
    locale: string;
  };
}

export default async function Generators({ params: { locale } }: Props) {
  const supabase = createClient();

  const queryClient = new QueryClient();

  return (
    <PageLayout>
      <div className="w-full h-96 flex justify-center items-center">
        <Construction className="h-36 w-72 text-yellow-500" />
      </div>
    </PageLayout>
  );
}
