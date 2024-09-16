"use client";

import { DocInGame, DocInList } from "@/types/interfaces";
import Image from "next/image";
import { useTranslations } from "next-intl";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeToc, { HtmlElementNode } from "@jsdevtools/rehype-toc";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Toc from "@/components/toc/MagicToc";

export default function DocViewer({ doc, withoutHeader = false }: Props) {
  const t = useTranslations("DocViewer");

  if (doc === null) return null;

  return (
    <div className="flex gap-x-2 w-full relative" id="doc-top">
      <Toc sourceId="doc-toc" id="toc" />
      <div className="flex flex-col gap-y-2 w-full grow">
        {doc.banner_url && !withoutHeader && (
          <div className="relative aspect-[24/9] w-full">
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
          {!withoutHeader && (
            <>
              <h1 className="text-4xl font-bold text-center py-2">
                {doc.title}
              </h1>
              <div className="flex justify-center items-center gap-x-2 w-full mb-4 mt-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src={doc.owner?.avatar_url ?? ""} />
                  <AvatarFallback>
                    {doc.owner?.display_name ?? "GM"}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center text-sm text-muted-foreground">
                  {t("createdBy", { user: doc.owner?.display_name ?? "GM" })}
                </div>
              </div>
              <Markdown className="prose prose-sm max-w-none dark:prose-invert text-muted-foreground text-center">
                {doc.description}
              </Markdown>
            </>
          )}
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
  doc: DocInList | DocInGame | null;
  withoutHeader?: boolean;
}
