import { NextIntlClientProvider } from "next-intl";
import { Noto_Sans_TC } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import { locales } from "@/navigation";
import {
  getMessages,
  getTranslations,
  unstable_setRequestLocale,
} from "next-intl/server";
import ConfirmDialog from "@/components/ConfirmDialog";
import GlobalLoading from "./GlobalLoading";

const defaultUrl = "https://handouts.wayneh.tw";

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

interface Props {
  children: React.ReactNode;
  params: { locale: string };
}

export async function generateMetadata({
  params: { locale },
}: Omit<Props, "children">) {
  const t = await getTranslations({ locale, namespace: "LocaleLayout" });

  return {
    metadataBase: new URL(defaultUrl),
    title: t("title"),
    description: t("description"),
    openGraph: {
      type: "website",
      locale,
      url: defaultUrl,
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${defaultUrl}/img/og-img.webp`,
          width: 1200,
          height: 714,
          alt: "Handouts",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: t("title"),
      description: t("description"),
      images: [
        {
          url: `${defaultUrl}/img/og-img.webp`,
          width: 1200,
          height: 714,
          alt: "ShareHandouts",
        },
      ],
    },
  };
}

const font = Noto_Sans_TC({
  subsets: ["latin", "cyrillic"],
});

export default async function RootLayout({
  children,
  params: { locale },
}: Props) {
  unstable_setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} className={font.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          <NextIntlClientProvider messages={messages}>
            {children}
            <Toaster />
            <ConfirmDialog />
            <GlobalLoading />
          </NextIntlClientProvider>
        </main>
      </body>
    </html>
  );
}
