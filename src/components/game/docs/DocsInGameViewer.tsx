"use client";

import { useState } from "react";
import Image from "next/image";
import { DocInGame } from "@/types/interfaces";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { getBannerUrl } from "@/lib/bannerUrl";
import DocViewer from "@/components/doc/DocViewer";
import { cn } from "@/lib/utils";

export default function DocsInGameViewer({
  docs,
  gameId,
}: {
  docs: DocInGame[];
  gameId: string;
}) {
  const [selectedDoc, setSelectedDoc] = useState<DocInGame>(docs?.[0]);

  return (
    <div>
      <ScrollArea className="w-full">
        <div className="w-full space-x-4 flex">
          {docs.map((doc) => (
            <Card
              key={doc.id}
              className={cn("w-64 cursor-pointer", {
                "bg-foreground text-background hover:bg-foreground/70":
                  selectedDoc.id === doc.id,
                "hover:bg-accent hover:text-accent-foreground":
                  selectedDoc.id !== doc.id,
              })}
              onClick={() => setSelectedDoc(doc)}
            >
              <CardHeader className="p-3">
                <CardTitle className="text-base">{doc.title}</CardTitle>
              </CardHeader>
              <CardContent className="px-3 pt-0 pb-3">
                <div className="w-full relative aspect-[24/9]">
                  <Image
                    className="object-cover"
                    src={doc.banner_url ?? getBannerUrl(doc.id)}
                    alt={doc.title}
                    loader={({ src }) => src}
                    unoptimized
                    fill
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
      <div className="mt-4">
        {selectedDoc && <DocViewer doc={selectedDoc} />}
      </div>
    </div>
  );
}
