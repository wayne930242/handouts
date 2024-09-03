'use client'

import { Session } from "@/types/interfaces";
import { useClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useSession() {
  const supabase = useClient();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session as Session);
    };
    getSession();
  }, [supabase]);

  return session;
}
