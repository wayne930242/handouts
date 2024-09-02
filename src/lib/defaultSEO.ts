import { BASE_URL } from "@/config/app";
import { Metadata } from "next";
import { getTranslations } from "next-intl/server"

export const genSEO = async ({
  locale,
  title,
  description,
  url,
  images,
}: {
  locale: string,
  title?: string,
  description?: string,
  url?: string,
  images?: {
    url: string,
    width?: number,
    height?: number,
    alt?: string,
  }[]
}): Promise<Metadata> => {
  const t = await getTranslations("DefaultSEO");
  const defaultUrl = BASE_URL;

  const defaultImage = {
    url: `${defaultUrl}/img/og-img.webp`,
    width: 1200,
    height: 714,
    alt: "Handouts",
  } as const;

  return {
    metadataBase: new URL(defaultUrl),
    title: title ?? t("title"),
    description: description ?? t("description"),
    openGraph: {
      type: "website",
      locale,
      url: url ?? defaultUrl,
      title: title ?? t("title"),
      description: description ?? t("description"),
      images: [
        ...(images ?? []),
        defaultImage],
    },
    twitter: {
      card: "summary_large_image",
      title: title ?? t("title"),
      description: description ?? t("description"),
      images: [
        ...(images ?? []),
        defaultImage
      ],
    },
  }
}