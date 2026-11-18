"use client";

import { EyeIcon, PencilIcon } from "lucide-react";
import { useState } from "react";

import { Markdown } from "@/components/ui/markdown";
import { Textarea } from "@/components/ui/textarea";
import { routing } from "@/lib/i18n/routing";
import { cn } from "@/lib/utils/cn";

type Locale = (typeof routing.locales)[number];

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", id: "ID" };

/**
 * Bilingual Markdown editor with a live preview (Case 03 M4). The preview uses the same
 * renderer as the public site, without raw HTML.
 */
export function MarkdownField({
  label,
  hint,
  rows = 6,
  register,
  values,
  error,
}: {
  label: string;
  hint?: string;
  rows?: number;
  register: (locale: Locale) => Record<string, unknown>;
  /** Current text per locale, for the preview. */
  values: Record<Locale, string>;
  error?: string;
}) {
  const [locale, setLocale] = useState<Locale>("en");
  const [previewing, setPreviewing] = useState(false);

  return (
    <div className="flex flex-col gap-1.5">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <span className="text-sm font-medium">{label}</span>
        <div className="flex items-center gap-1">
          {routing.locales.map((option) => (
            <ToggleChip key={option} active={locale === option} onClick={() => setLocale(option)}>
              {LOCALE_LABELS[option]}
            </ToggleChip>
          ))}
          <span aria-hidden="true" className="mx-1 h-4 w-px bg-border" />
          <ToggleChip active={!previewing} onClick={() => setPreviewing(false)}>
            <PencilIcon aria-hidden="true" className="size-3" />
            Write
          </ToggleChip>
          <ToggleChip active={previewing} onClick={() => setPreviewing(true)}>
            <EyeIcon aria-hidden="true" className="size-3" />
            Preview
          </ToggleChip>
        </div>
      </div>

      {/* Both textareas stay mounted, so switching never drops a value. */}
      {routing.locales.map((option) => (
        <Textarea
          key={option}
          rows={rows}
          aria-label={`${label} (${LOCALE_LABELS[option]})`}
          className={cn("font-mono text-sm", (previewing || option !== locale) && "hidden")}
          {...register(option)}
        />
      ))}
      {previewing ? (
        <div className="min-h-24 rounded-md border bg-secondary/30 p-3">
          {values[locale].trim() ? (
            <Markdown>{values[locale]}</Markdown>
          ) : (
            <p className="text-sm text-muted-foreground">
              Nothing to preview. Empty sections are hidden on the site.
            </p>
          )}
        </div>
      ) : null}

      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </div>
  );
}

function ToggleChip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-pressed={active}
      onClick={onClick}
      className={cn(
        "inline-flex items-center gap-1 rounded-md px-2 py-0.5 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
        active ? "bg-primary/15 text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}
