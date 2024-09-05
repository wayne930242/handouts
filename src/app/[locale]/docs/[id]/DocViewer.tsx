"use client";

import { Doc } from "@/types/interfaces";
import Image from "next/image";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeToc, { HtmlElementNode } from "@jsdevtools/rehype-toc";

import Toc from "@/components/toc/MagicToc";
import useSmoothScroll from "@/lib/hooks/useSmoothScroll";

export default function DocViewer({ doc }: Props) {
  useSmoothScroll();

  return (
    <div className="flex gap-x-2 w-full relative" id="doc-top">
      <Toc sourceId="doc-toc" id="toc" />
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
            className="prose max-w-none dark:prose-invert"
            remarkPlugins={[remarkGfm]}
            rehypePlugins={[
              rehypeRaw,
              rehypeSlug,
              [
                rehypeToc,
                {
                  headings: ["h1", "h2", "h3", "h4", "h5", "h6"],
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
