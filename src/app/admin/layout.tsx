import type { Metadata } from "next";

import { clientEnv } from "@/lib/config/client";
import { fontVariables } from "@/lib/fonts";
import { DEFAULT_THEME } from "@/lib/theme/theme";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(clientEnv.NEXT_PUBLIC_SITE_URL),
  title: { default: "Admin", template: "%s · Admin" },
  // The admin area is private and never indexed (Case 02 §13).
  robots: { index: false, follow: false },
};

/** Root layout for the admin area: English only, dark theme, no public shell. */
export default function AdminRootLayout({ children }: LayoutProps<"/admin">) {
  return (
    <html lang="en" data-theme={DEFAULT_THEME} className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col">{children}</body>
    </html>
  );
}
