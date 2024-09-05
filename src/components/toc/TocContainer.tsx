"use client";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { ArrowUpToLine, TableOfContents } from "lucide-react";
import useSmoothScroll from "@/lib/hooks/useSmoothScroll";

interface Props {
  children: React.ReactNode;
  mobileChildren?: React.ReactNode;
  topId?: string;
}

export default function TocContainer({
  children,
  mobileChildren,
  topId = "doc-top",
}: Props) {
  useSmoothScroll();

  return (
    <>
      <div className="hidden md:flex w-[305px] sticky top-0 overflow-y-auto mr-4 bg-secondary text-secondary-foreground px-4 py-2 flex-col items-center h-layout">
        <div className="w-full">
          <a
            className="toc-link text-center flex items-center justify-center mb-2"
            href={`#${topId}`}
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
        {children}
      </div>
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
            <div className="flex gap-2 rounded-sm max-h-[40vh] w-[250px] overflow-y-auto bg-secondary text-secondary-foreground px-4 py-2 flex-col items-center">
              <div className="bg-secondary text-secondary-foreground w-full">
                <a
                  className="toc-link text-center flex items-center justify-center"
                  href={`#${topId}`}
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
              {mobileChildren ?? children}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
}
