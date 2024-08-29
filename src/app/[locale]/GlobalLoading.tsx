"use client";

import OverlayLoading from "@/components/OverlayLoading";
import useAppStore from "@/lib/store/useAppStore";

export default function GlobalLoading() {
  const { isLoading } = useAppStore();

  return <>{isLoading && <OverlayLoading />}</>;
}
