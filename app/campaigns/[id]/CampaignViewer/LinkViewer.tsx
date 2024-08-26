"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Globe, Clipboard } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { PacmanLoader } from "react-spinners";
import { fetchUrlMetadata } from "@/lib/url";
import { Button } from "@/components/ui/button";

interface Metadata {
  url: string;
  title: string;
  description: string;
  image: string;
}

export default function LinkViewer({ content }: Props) {
  const [metadata, setMetadata] = useState<Metadata | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchMetadata = async () => {
      setLoading(true);
      if (!content) return;

      try {
        const data: Metadata | undefined = await fetchUrlMetadata(content);
        if (!data) {
          throw new Error("Failed to fetch metadata");
        }
        setMetadata(data);
      } catch (err) {
        console.error(err);
      }
      setLoading(false);
    };

    fetchMetadata();
  }, [content]);

  return (
    <Card>
      <div className="grow flex gap-x-2 items-center justify-between w-full">
        <a
          href={content}
          target="_blank"
          rel="noreferrer"
          className="grow w-full"
        >
          <CardHeader className="flex flex-row items-center space-x-2">
            <CardTitle className="text-sm font-medium">
              <div className="flex gap-x-2 items-center grow">
                <Globe className="h-4 w-4" />
                <p>{metadata ? metadata?.title : content}</p>
              </div>
            </CardTitle>
          </CardHeader>
        </a>
        <CardHeader>
          <Button
            size="icon"
            variant="outline"
            onClick={(e) => {
              e.stopPropagation();
              if (!content) return;
              navigator.clipboard.writeText(content);
              toast({
                title: "複製成功",
                description: "已複製到剪貼簿",
              });
            }}
          >
            <Clipboard className="h-4 w-4" />
          </Button>
        </CardHeader>
      </div>
      {metadata && (
        <a href={content} target="_blank" rel="noreferrer">
          <CardContent className="flex flex-col gap-y-3">
            {loading && (
              <div className="flex justify-center items-center h-24 w-full">
                <PacmanLoader color="#bbb" loading={loading} size={24} />
              </div>
            )}
            {metadata?.image && (
              <div className="relative h-24">
                <Image
                  className="object-cover"
                  src={metadata?.image}
                  loader={({ src }) => src}
                  alt={metadata?.title}
                  fill
                  unoptimized
                />
              </div>
            )}

            <div className="flex flex-col gap-y-2">
              <p className="text-sm text-gray-800">{metadata?.description}</p>
              <p className="text-xs text-muted-foreground">{metadata?.url}</p>
            </div>
          </CardContent>
        </a>
      )}
    </Card>
  );
}

interface Props {
  content?: string;
}
