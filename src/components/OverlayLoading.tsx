"use client";

import { PacmanLoader } from "react-spinners";

export default function OverlayLoading() {
  return (
    <div className="fixed inset-0 bg-foreground/30 flex justify-center items-center z-[9999] pointer-events-none">
      <PacmanLoader color="hsl(var(--foreground))" loading={true} />
    </div>
  );
}
