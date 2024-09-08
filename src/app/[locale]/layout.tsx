import { Noto_Sans_TC } from "next/font/google";
import { getMessages, unstable_setRequestLocale } from "next-intl/server";
import { NextIntlClientProvider } from "next-intl";

import { genSEO } from "@/lib/defaultSEO";
import { locales } from "@/navigation";

import { Toaster } from "@/components/ui/toaster";
import ConfirmDialog from "@/components/dialog/ConfirmDialog";
import PassphraseDialog from "@/components/dialog/PassphraseDialog";

import { ThemeProvider } from "@/components/layout/context/ThemeProvider";
import { ReactQueryClientProvider } from "@/components/layout/context/ReactQueryClientProvider";
import GlobalLoading from "@/components/layout/context/GlobalLoading";
import ProfileQuery from "@/components/layout/context/ProfileQuery";

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
  return await genSEO({ locale });
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
    <ReactQueryClientProvider>
      <html lang={locale} className={font.className} suppressHydrationWarning>
        <body className="bg-background text-foreground">
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <main className="min-h-screen flex flex-col items-center">
              <NextIntlClientProvider messages={messages}>
                {children}
                <Toaster />
                <ConfirmDialog />
                <GlobalLoading />
                <PassphraseDialog />
                <ProfileQuery />
              </NextIntlClientProvider>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
