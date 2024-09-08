"use client";

import OverlayLoading from "@/components/layout/OverlayLoading";
import { checkPassphraseExists } from "@/lib/passphraseCli";
import useAppStore from "@/lib/store/useAppStore";
import { useRouter } from "@/navigation";
import { useSearchParams } from "next/navigation";
import { useEffect, useTransition } from "react";

export default function SearchParamsListener() {
  const searchParams = useSearchParams();
  const { setPassphraseDialog } = useAppStore((state) => ({
    setPassphraseDialog: state.setAddPassphraseDialog,
  }));
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(() => {
      if (searchParams.get("campaign_id")) {
        const id = searchParams.get("campaign_id") as string;
        const isExists = checkPassphraseExists(id, "campaigns");
        if (isExists) {
          router.push(`/campaigns/${id}`);
        } else {
          setPassphraseDialog("campaigns");
        }
      } else if (searchParams.get("doc_id")) {
        const id = searchParams.get("doc_id") as string;
        const isExists = checkPassphraseExists(id, "docs");
        if (isExists) {
          router.push(`/docs/${id}`);
        } else {
          setPassphraseDialog("docs");
        }
      }
    });
  }, [searchParams]);

  return isPending ? <OverlayLoading /> : null;
}
