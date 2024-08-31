"use client";

import { createPortal } from "react-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { ArrowUpToLine, TableOfContents } from "lucide-react";
import { MultiDOMPortal } from "./Portal";

export default function TocSpeedDial({ sourceId: id, targetId }: Props) {
  return createPortal(
    <div className="fixed bottom-4 left-4 z-50 md:hidden block">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button size="icon" className="rounded-full h-14 w-14">
            <TableOfContents className="h-8 w-8" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          hideWhenDetached={true}
          align="start"
          className="data-[state=closed]:hidden"
        >
          <div className="flex gap-2 rounded-sm max-h-[40vh] w-[250px] overflow-y-auto mr-4 bg-secondary text-secondary-foreground px-4 flex-col items-center">
            <div className="bg-secondary text-secondary-foreground w-full">
              <a
                className="toc-link text-center flex items-center justify-center"
                href="#doc-top"
              >
                <Button
                  size="sm"
                  variant="secondary"
                  className="w-full flex items-center justify-center hover:text-[#007bff]"
                >
                  <ArrowUpToLine className="w-5 h-5" />
                </Button>
              </a>
            </div>
            <MultiDOMPortal sourceId={id} targetIds={[targetId]} hideOriginal />
            <div id={targetId}></div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>,
    document.body
  );
}

interface Props {
  sourceId: string;
  targetId: string;
}
