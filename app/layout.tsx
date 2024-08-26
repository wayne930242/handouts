import { Noto_Sans_TC } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Metadata } from "next";

const defaultUrl = "https://handouts.wayneh.tw";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ShareHandouts - a TRPG tool by WeiHung",
  description:
    "一個讓你方便分享、管理 TRPG 遊戲的手邊資料的簡單工具。由洪偉開發製作。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: defaultUrl,
    title: "ShareHandouts - a TRPG tool by WeiHung",
    description:
      "一個讓你方便分享、管理 TRPG 遊戲的手邊資料的簡單工具。由洪偉開發製作。",
    images: [
      {
        url: `${defaultUrl}/img/og-img.webp`,
        width: 1200,
        height: 714,
        alt: "ShareHandouts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShareHandouts - a TRPG tool by WeiHung",
    description:
      "一個讓你方便分享、管理 TRPG 遊戲的手邊資料的簡單工具。由洪偉開發製作。",
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

const font = Noto_Sans_TC({
  subsets: ["latin", "cyrillic"],
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={font.className}>
      <body className="bg-background text-foreground">
        <main className="min-h-screen flex flex-col items-center">
          {children}
          <Toaster />
        </main>
      </body>
    </html>
  );
}
