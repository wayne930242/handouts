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
        <div className="cursor-zoom-in w-full">{children}</div>
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
