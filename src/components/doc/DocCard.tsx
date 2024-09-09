"use client";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Markdown from "react-markdown";
import { Settings } from "lucide-react";

import { BASE_URL } from "@/config/app";
import { Link } from "@/navigation";
import { getBannerUrl } from "@/lib/bannerUrl";
import useSessionUser from "@/lib/hooks/useSession";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { toast } from "@/components/ui/use-toast";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { DocInList } from "@/types/interfaces";
import ItemCard from "../card/ItemCard";

export default function DocCard({ doc }: { doc: DocInList }) {
  return (
    <ItemCard
      tableName="docs"
      ownerInfo={{
        id: doc.owner_id,
        display_name: doc.owner?.display_name,
        avatar_url: doc.owner?.avatar_url,
      }}
      bannerUrl={doc.banner_url}
      title={doc.title}
      description={doc.description}
      id={doc.id}
      passphrase={doc.passphrase}
    />
  );
}
