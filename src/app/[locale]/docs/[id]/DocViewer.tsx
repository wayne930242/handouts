"use client";
import { Doc } from "@/types/interfaces";
import Image from "next/image";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeToc, { HtmlElementNode } from "@jsdevtools/rehype-toc";

import { MultiDOMPortal } from "@/components/Portal";
import { cn } from "@/lib/utils";
import useSmoothScroll from "@/lib/hooks/useSmoothScroll";
import { ArrowUpToLine } from "lucide-react";
import { Button } from "@/components/ui/button";
import TocSpeedDial from "@/components/SpeedDial";

export default function DocViewer({ doc, canEdit }: Props) {
  useSmoothScroll();

  return (
    <div className="flex gap-x-2 w-full relative" id="doc-top">
      <MultiDOMPortal
        sourceId="doc-toc"
        targetIds={["desktop-toc"]}
        hideOriginal
      />
      <TocSpeedDial />
      <div
        className={cn(
          "hidden md:block max-w-[275px] sticky top-0 overflow-y-auto pr-4",
          canEdit ? "h-layout" : "h-layout-full"
        )}
      >
        <div>
          <a
            className="toc-link text-center flex items-center justify-center"
            href="#doc-top"
          >
            <Button
              size="sm"
              variant="link"
              className="w-full flex items-center justify-center hover:text-[#007bff]"
            >
              <ArrowUpToLine className="w-5 h-5" />
            </Button>
          </a>
        </div>
        <div id="desktop-toc" />
      </div>
      <div className="flex flex-col gap-y-2 w-full grow">
        {doc.banner_url && (
          <div className="relative aspect-[32/9] w-full">
            <Image
              className="object-cover"
              src={doc.banner_url}
              alt={doc.title}
              loader={({ src }) => src}
              priority
              unoptimized
              fill
            />
          </div>
        )}
        <div className="flex flex-col gap-y-2 w-full">
          <h1 className="text-4xl font-bold text-center py-2">{doc.title}</h1>
          <div className="text-center text-sm text-muted-foreground">
            {doc.description}
          </div>
          <Markdown
            className="prose max-w-none"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              rehypeSlug,
              [
                rehypeToc,
                {
                  customizeTOC: (toc: HtmlElementNode) => {
                    toc.properties.id = "doc-toc";
                    return toc;
                  },
                },
              ],
            ]}
          >
            {doc.content}
          </Markdown>
        </div>
      </div>
    </div>
  );
}

interface Props {
  doc: Doc;
  canEdit?: boolean;
}
