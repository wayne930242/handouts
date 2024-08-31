"use client";
import { Doc } from "@/types/interfaces";
import Image from "next/image";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeToc from "@jsdevtools/rehype-toc";

export default function DocViewer({ doc }: Props) {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      {doc.banner_url && (
        <div className="relative aspect-[32/9] w-full">
          <Image
            className="object-cover"
            src={doc.banner_url}
            alt={doc.title}
            loader={({ src }) => src}
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
          rehypePlugins={[rehypeRaw, rehypeSlug, rehypeToc]}
        >
          {doc.content}
        </Markdown>
      </div>
    </div>
  );
}

interface Props {
  doc: Doc;
}
