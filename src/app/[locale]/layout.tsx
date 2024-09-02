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
import PassphraseDialog from "@/components/PassphraseDialog";
import { ReactQueryClientProvider } from "./ReactQueryClientProvider";
import { ThemeProvider } from "./ThemeProvider";
import { genSEO } from "@/lib/defaultSEO";

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
      <html lang={locale} className={font.className}>
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
              </NextIntlClientProvider>
            </main>
          </ThemeProvider>
        </body>
      </html>
    </ReactQueryClientProvider>
  );
}
