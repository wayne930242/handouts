import { Session } from "@/types/interfaces";
import { createClient } from "@/utils/supabase/client";
import { useEffect, useState } from "react";

export default function useSession() {
  const supabase = createClient();

  const [session, setSession] = useState<Session | null>(null);

  useEffect(() => {
    const getSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session as Session);
    };
    getSession();
  }, []);

  return session;
}
