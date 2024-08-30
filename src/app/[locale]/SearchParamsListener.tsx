"use client";

import useAppStore from "@/lib/store/useAppStore";
import { useSearchParams } from "next/navigation";
import { useEffect } from "react";

export default function SearchParamsListener() {
  const searchParams = useSearchParams();
  const { setPassphraseDialog } = useAppStore((state) => ({
    setPassphraseDialog: state.setAddPassphraseDialog,
  }));

  useEffect(() => {
    if (searchParams.get("campaign_id")) {
      setPassphraseDialog("campaigns");
    } else if (searchParams.get("rule_id")) {
      setPassphraseDialog("rules");
    }
  }, [searchParams]);

  return <></>;
}
