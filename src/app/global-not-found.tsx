import type { Metadata } from "next";
import Link from "next/link";

import { fontVariables } from "@/lib/fonts";

import "./globals.css";

export const metadata: Metadata = {
  title: "404 — Page not found",
};

/**
 * Shown for URLs that match no route at all (outside the locale and admin layouts).
 * It bypasses every layout, so it imports styles and fonts itself and stays in English.
 */
export default function GlobalNotFound() {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-mono text-sm text-primary">404</p>
        <h1 className="text-3xl font-semibold">Page not found</h1>
        <p className="text-muted-foreground">
          The page you&apos;re looking for doesn&apos;t exist or has moved.
        </p>
        <Link href="/en" className="text-primary underline-offset-4 hover:underline">
          Back to home
        </Link>
      </body>
    </html>
  );
}
