"use client";

import { User } from "@/types/interfaces";
import { useClient } from "@/lib/supabase/client";
import { useEffect, useState } from "react";

export default function useSessionUser() {
  const supabase = useClient();

  const [session, setSession] = useState<User | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setSession(user as User);
    };
    getSession();
  }, [supabase]);

  return session;
}
