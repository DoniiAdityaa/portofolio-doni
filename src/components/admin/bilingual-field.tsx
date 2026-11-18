"use client";

import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { routing } from "@/lib/i18n/routing";

type Locale = (typeof routing.locales)[number];

const LOCALE_LABELS: Record<Locale, string> = { en: "EN", id: "ID" };

/**
 * One translatable field with EN / ID tabs (Case 03 M4). `register` comes from
 * react-hook-form, e.g. `(locale) => register(\`headline.${locale}\`)`.
 */
export function BilingualField({
  label,
  hint,
  multiline = false,
  rows = 4,
  register,
  errors,
}: {
  label: string;
  hint?: string;
  multiline?: boolean;
  rows?: number;
  register: (locale: Locale) => Record<string, unknown>;
  errors?: Partial<Record<Locale, string | undefined>>;
}) {
  const baseId = useId();
  const error = errors?.en ?? errors?.id;

  return (
    <Tabs defaultValue="en" className="flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-medium">{label}</span>
        <TabsList className="h-7">
          {routing.locales.map((locale) => (
            <TabsTrigger key={locale} value={locale} className="px-2 text-xs">
              {LOCALE_LABELS[locale]}
              {errors?.[locale] ? <span className="sr-only"> (has an error)</span> : null}
            </TabsTrigger>
          ))}
        </TabsList>
      </div>

      {routing.locales.map((locale) => {
        const id = `${baseId}-${locale}`;
        const props = {
          id,
          "aria-label": `${label} (${LOCALE_LABELS[locale]})`,
          ...register(locale),
        };

        return (
          // forceMount keeps both inputs in the form, so switching tabs never drops a value.
          <TabsContent
            key={locale}
            value={locale}
            forceMount
            className="data-[state=inactive]:hidden"
          >
            {multiline ? <Textarea rows={rows} {...props} /> : <Input {...props} />}
          </TabsContent>
        );
      })}

      {hint && !error ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      {error ? (
        <p role="alert" className="text-xs text-destructive">
          {error}
        </p>
      ) : null}
    </Tabs>
  );
}
