import { Database } from "@/types/database.types";
import { createBrowserClient } from "@supabase/ssr";
import { useMemo } from "react";

export const createClient = () =>
  createBrowserClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );

export const useClient = () => {
  const supabase = useMemo(() => createClient(), []);
  return supabase;
};
