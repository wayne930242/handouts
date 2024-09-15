"use client";

import { useQuery } from "@supabase-cache-helpers/postgrest-react-query";
import { getMyProfile } from "@/lib/supabase/query/profileQuery";
import { useEffect, useRef } from "react";
import { useClient } from "@/lib/supabase/client";
import useSessionUser from "@/lib/hooks/useSession";
import useProfileStore from "@/lib/store/useProfileStore";

export default function ProfileQuery() {
  const { setProfile } = useProfileStore((state) => ({
    setProfile: state.setProfile,
  }));

  const supabase = useClient();
  const user = useSessionUser();
  const userId = user?.id;

  const { data: profileData } = useQuery(getMyProfile(supabase, userId!), {
    enabled: !!userId,
  });

  const isMounted = useRef(false);
  useEffect(() => {
    if (!profileData || isMounted.current) return;
    isMounted.current = true;
    setProfile(profileData);
  }, [profileData, setProfile]);

  return <></>;
}
