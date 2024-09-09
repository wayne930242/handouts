"use client";

import { User } from "@/types/interfaces";
import { useClient } from "@/lib/supabase/client";
import useAppStore from "../store/useAppStore";
import { useQuery } from "@tanstack/react-query";

export default function useSessionUser() {
  const supabase = useClient();
  const { user, setUser } = useAppStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const {} = useQuery({
    queryKey: ["user"],
    queryFn: () =>
      supabase.auth.getUser().then(({ data: { user: u } }) => {
        setUser(u as User);
        return u;
      }),
  });

  return user;
}
