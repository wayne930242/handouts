"use client";

import OverlayLoading from "@/components/OverlayLoading";
import useAppStore from "@/lib/store/useAppStore";

export default function GlobalLoading() {
  const { isLoading } = useAppStore((state) => ({
    isLoading: state.isLoading,
  }));

  return <>{isLoading && <OverlayLoading />}</>;
}
