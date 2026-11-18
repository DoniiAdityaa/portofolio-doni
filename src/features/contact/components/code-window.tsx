"use client";

import { cloneElement, useId } from "react";

import { cn } from "@/lib/utils/cn";

type FieldProps = {
  id: string;
  /** Decorative line number shown in the editor gutter. */
  line: number;
  label: string;
  error?: string;
  hint?: string;
  children: React.ReactElement<{ id?: string; "aria-describedby"?: string }>;
};

/** One "line" in the editor: gutter number, code-style label, control, and error. */
export function Field({ id, line, label, error, hint, children }: FieldProps) {
  const reactId = useId();
  const controlId = `${id}-${reactId}`;
  const errorId = `${controlId}-error`;

  return (
    <div className="flex gap-3">
      <span
        aria-hidden="true"
        className="w-5 shrink-0 pt-0.5 text-right font-mono text-xs text-muted-foreground/50 select-none"
      >
        {line}
      </span>
      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex items-baseline justify-between gap-2">
          <label htmlFor={controlId} className="font-mono text-sm text-teal">
            {label}
            <span aria-hidden="true" className="text-muted-foreground">
              :
            </span>
          </label>
          {hint ? <span className="font-mono text-xs text-muted-foreground">{hint}</span> : null}
        </div>
        {cloneElement(children, {
          id: controlId,
          "aria-describedby": error ? errorId : undefined,
        })}
        <p
          id={errorId}
          className={cn("min-h-4 font-mono text-xs text-destructive", !error && "invisible")}
          aria-live="polite"
        >
          {error ? `// ${error}` : null}
        </p>
      </div>
    </div>
  );
}

/** A code-editor window frame: traffic-light dots, a file name, and a status badge. */
export function CodeWindow({
  title,
  badge,
  children,
}: {
  title: string;
  badge: string;
  children: React.ReactNode;
}) {
  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-xl shadow-black/20 transition-colors focus-within:border-primary/40">
      <div className="flex items-center gap-3 border-b bg-secondary/40 px-4 py-2.5">
        <div aria-hidden="true" className="flex gap-1.5">
          <span className="size-2.5 rounded-full bg-destructive/70" />
          <span className="size-2.5 rounded-full bg-amber/70" />
          <span className="size-2.5 rounded-full bg-teal/70" />
        </div>
        <span className="font-mono text-xs text-muted-foreground">{title}</span>
        <span className="ml-auto rounded-md bg-primary/15 px-2 py-0.5 font-mono text-[10px] tracking-wider text-primary uppercase">
          {badge}
        </span>
      </div>
      <div className="p-4 sm:p-5">{children}</div>
    </div>
  );
}
