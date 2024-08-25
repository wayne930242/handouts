"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import { Globe } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PacmanLoader } from "react-spinners";
import { fetchUrlMetadata } from "@/lib/url";

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
      if (!content) return;

      try {
        const data: Metadata = await fetchUrlMetadata(content);
        console.log(data);
        setMetadata(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
      }
    };

    fetchMetadata();
  }, [content]);

  return (
    <a href={content} target="_blank" rel="noreferrer">
      <Card>
        <CardHeader className="flex flex-row items-center space-x-2">
          <CardTitle className="text-sm font-medium flex gap-x-2 items-center">
            <Globe className="h-4 w-4" />
            <p>{metadata?.title}</p>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading && (
            <div className="flex justify-center items-center h-40 w-40">
              <PacmanLoader color="#bbb" loading={loading} size={24} />
            </div>
          )}
          {metadata?.image && (
            <div className="relative h-40">
              <Image
                className="object-cover"
                src={metadata?.image}
                loader={({ src }) => src}
                alt={metadata?.title}
                layout="fill"
              />
            </div>
          )}

          <div>
            <p className="text-gray-800">{metadata?.description}</p>
            <p className="text-xs text-gray-500">{metadata?.url}</p>
          </div>
        </CardContent>
      </Card>
    </a>
  );
}

interface Props {
  content?: string;
}
