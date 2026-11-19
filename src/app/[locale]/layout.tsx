import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { locale as rootLocale } from "next/root-params";
import { hasLocale, NextIntlClientProvider } from "next-intl";
import { getTranslations } from "next-intl/server";

import { AppShell } from "@/components/layout/app-shell";
import { ThemeScript } from "@/components/layout/theme-script";
import { MotionProvider } from "@/components/motion/motion-provider";
import { clientEnv } from "@/lib/config/client";
import { fontVariables } from "@/lib/fonts";
import { routing } from "@/lib/i18n/routing";
import { DEFAULT_THEME } from "@/lib/theme/theme";

import "../globals.css";

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");

  return {
    metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
    // Real title and description come from admin Site Settings (M4/M5).
    title: { default: t("title"), template: `%s · ${t("title")}` },
    description: t("description"),
    alternates: {
      languages: Object.fromEntries(routing.locales.map((locale) => [locale, `/${locale}`])),
    },
  };
}

export default async function LocaleLayout({ children }: LayoutProps<"/[locale]">) {
  const locale = await rootLocale();
  if (!hasLocale(routing.locales, locale)) notFound();

  return (
    <html
      lang={locale}
      data-theme={DEFAULT_THEME}
      className={`${fontVariables} h-full antialiased`}
      // The theme script may switch data-theme before React hydrates.
      suppressHydrationWarning
    >
      <body className="flex min-h-full flex-col">
        <ThemeScript />
        <NextIntlClientProvider>
          <MotionProvider>
            <AppShell>{children}</AppShell>
          </MotionProvider>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
