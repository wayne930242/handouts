"use client";

import { User } from "@/types/interfaces";
import { useClient } from "@/lib/supabase/client";
import useAppStore from "@/lib/store/useAppStore";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export default function useSessionUser() {
  const supabase = useClient();
  const { user, setUser } = useAppStore((state) => ({
    user: state.user,
    setUser: state.setUser,
  }));
  const { data: _user } = useQuery({
    queryKey: ["user"],
    queryFn: () => supabase.auth.getUser().then(({ data: { user: u } }) => u),
  });

  useEffect(() => {
    if (_user) {
      setUser(_user as User);
    }
  }, [_user]);

  return user;
}
