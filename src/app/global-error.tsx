"use client";

import { fontVariables } from "@/lib/fonts";

import "./globals.css";

/**
 * Last-resort page when even the site layout fails, e.g. the database is unreachable and
 * nothing is cached yet (CR-09). It replaces every layout, so it brings its own styles and
 * shows both languages, since the locale is unknown here.
 */
export default function GlobalError({ retry }: { error: unknown; retry: () => void }) {
  return (
    <html lang="en" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-4 p-6 text-center">
        <p className="font-mono text-sm text-primary">503</p>
        <h1 className="text-3xl font-semibold">Temporarily unavailable</h1>
        <p className="max-w-md text-muted-foreground">
          The site couldn&apos;t load right now. Please try again in a moment.
        </p>
        <p lang="id" className="max-w-md text-sm text-muted-foreground">
          Situs belum bisa dimuat sekarang. Silakan coba lagi sebentar lagi.
        </p>
        <button
          type="button"
          onClick={() => retry()}
          className="rounded-md border px-4 py-2 text-sm transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          Try again · Coba lagi
        </button>
      </body>
    </html>
  );
}
