"use client";

import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogTitle,
  DialogHeader,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import VisuallyHidden from "./ui/visuallyhidden";
import { Button } from "./ui/button";

export default function LightBoxWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="relative w-full h-96 overflow-hidden cursor-zoom-in">
          <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-b h-24 from-transparent to-card pointer-events-none" />
          <div className="w-full h-full overflow-y-hidden">{children}</div>
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-2 w-full p-4 max-w-4xl max-h-screen overflow-y-auto">
        <DialogHeader>
          <VisuallyHidden>
            <DialogTitle>Lightbox</DialogTitle>
          </VisuallyHidden>
        </DialogHeader>
        <VisuallyHidden>
          <DialogDescription>A LightBox</DialogDescription>
        </VisuallyHidden>
        {children}
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" size="lg">
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
