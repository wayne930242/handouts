"use client";

import React, { useEffect } from "react";
import { PacmanLoader } from "react-spinners";

export default function OverlayLoading({ isLoading = true }) {
  useEffect(() => {
    if (isLoading) {
      document.body.style.overflow = "hidden";
      document.body.style.pointerEvents = "none";
    } else {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    }

    return () => {
      document.body.style.overflow = "";
      document.body.style.pointerEvents = "";
    };
  }, [isLoading]);

  if (!isLoading) return null;

  return (
    <div
      className="fixed inset-0 bg-foreground/60 flex justify-center items-center z-[9999]"
      style={{ pointerEvents: "auto" }}
      onClick={(e) => e.stopPropagation()}
      role="alert"
      aria-busy="true"
    >
      <PacmanLoader color="hsl(var(--foreground))" loading={true} />
    </div>
  );
}
