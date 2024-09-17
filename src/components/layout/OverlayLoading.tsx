"use client";
import React, { useEffect } from "react";
import { createPortal } from "react-dom";
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

  const overlay = (
    <div
      className="fixed inset-0 bg-foreground/60 flex justify-center items-center pointer-events-auto z-[9999]"
      onClick={(e) => e.stopPropagation()}
      role="alert"
      aria-busy="true"
    >
      <PacmanLoader color="hsl(var(--foreground))" loading={true} />
    </div>
  );

  return createPortal(overlay, document.body);
}
