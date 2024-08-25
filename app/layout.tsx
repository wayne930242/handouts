import { Noto_Sans_TC } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { Metadata } from "next";

const defaultUrl = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "https://handouts.wayneh.tw";

export const metadata: Metadata = {
  metadataBase: new URL(defaultUrl),
  title: "ShareHandouts - a TRPG tool by WeiHung",
  description: "一個讓你方便分享遊戲手邊資料的簡單工具。",
  openGraph: {
    type: "website",
    locale: "zh_TW",
    url: defaultUrl,
    title: "ShareHandouts - a TRPG tool by WeiHung",
    description: "一個讓你方便分享遊戲手邊資料的簡單工具。",
    images: [
      {
        url: `${defaultUrl}/img/og-img.webp`,
        width: 1200,
        height: 630,
        alt: "ShareHandouts",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ShareHandouts - a TRPG tool by WeiHung",
    description: "一個讓你方便分享遊戲手邊資料的簡單工具。",
    images: [
      {
        url: `${defaultUrl}/img/og-img.webp`,
        width: 1200,
        height: 630,
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
