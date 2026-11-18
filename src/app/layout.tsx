import type { Metadata } from "next";

import { clientEnv } from "@/lib/config/client";

import "./globals.css";

// Fonts, design tokens, and the sidebar shell arrive in M1 (design system).
export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  // Real title and description come from admin Site Settings (M4/M5).
  title: "Portfolio",
  description: "Personal developer portfolio.",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
