"use client";

import { CheckIcon } from "lucide-react";

import { cn } from "@/lib/utils/cn";

export type SkillOption = { id: string; name: string };

/** Pick related skills as toggle chips (Case 03 M4: skill picker). */
export function SkillPicker({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: SkillOption[];
  value: string[];
  onChange: (ids: string[]) => void;
}) {
  const selected = new Set(value);

  return (
    <fieldset className="flex flex-col gap-1.5">
      <legend className="mb-1.5 text-sm font-medium">
        {label} <span className="font-normal text-muted-foreground">({value.length})</span>
      </legend>
      <div className="flex flex-wrap gap-1.5">
        {options.map((option) => {
          const checked = selected.has(option.id);
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={checked}
              onClick={() =>
                onChange(checked ? value.filter((id) => id !== option.id) : [...value, option.id])
              }
              className={cn(
                "inline-flex items-center gap-1 rounded-full border px-2.5 py-1 text-xs transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                checked
                  ? "border-primary/50 bg-primary/15 text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              {checked ? <CheckIcon aria-hidden="true" className="size-3" /> : null}
              {option.name}
            </button>
          );
        })}
      </div>
    </fieldset>
  );
}
