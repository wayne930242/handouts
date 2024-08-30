"use client";
import { Rule } from "@/types/interfaces";
import Image from "next/image";

import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import rehypeSlug from "rehype-slug";
import rehypeToc from "@jsdevtools/rehype-toc";

export default function RuleViewer({ rule }: Props) {
  return (
    <div className="flex flex-col gap-y-2 w-full">
      {rule.banner_url && (
        <div className="relative aspect-[32/9] w-full">
          <Image
            className="object-cover"
            src={rule.banner_url}
            alt={rule.title}
            loader={({ src }) => src}
            unoptimized
            fill
          />
        </div>
      )}
      <div className="flex flex-col gap-y-2 w-full">
        <h1 className="text-4xl font-bold text-center py-2">{rule.title}</h1>
        <div className="text-center text-sm text-muted-foreground">
          {rule.description}
        </div>
        <Markdown
          className="prose prose-sm max-w-none"
          remarkPlugins={[remarkGfm]}
          rehypePlugins={[rehypeRaw, rehypeSlug, rehypeToc]}
        >
          {rule.content}
        </Markdown>
      </div>
    </div>
  );
}

interface Props {
  rule: Rule;
}
