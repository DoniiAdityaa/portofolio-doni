"use client";

import { SearchIcon, SearchXIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils/cn";

export type ProjectFilterItem = {
  id: string;
  typeId: string;
  categoryId: string;
  /** Lower-cased title and summary, matched by the search box. */
  searchText: string;
  /** The project card, rendered on the server. */
  node: ReactNode;
};

type FilterOption = { id: string; label: string };

type ProjectFilterProps = {
  items: ProjectFilterItem[];
  /** Platforms such as Web and Mobile; managed in admin (CR-06). */
  types: FilterOption[];
  /** Contexts such as Personal or Internship; managed in admin (CR-06). */
  categories: FilterOption[];
};

const ALL = "all";

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.06 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/** Search plus Type and Category pill rows (Case 01 §5.4, CR-06), all combinable. */
export function ProjectFilter({ items, types, categories }: ProjectFilterProps) {
  const t = useTranslations("projects");
  const [type, setType] = useState(ALL);
  const [category, setCategory] = useState(ALL);
  const [query, setQuery] = useState("");
  const keyword = query.trim().toLowerCase();

  const visible = items.filter(
    (item) =>
      (type === ALL || item.typeId === type) &&
      (category === ALL || item.categoryId === category) &&
      (keyword === "" || item.searchText.includes(keyword)),
  );

  function reset() {
    setType(ALL);
    setCategory(ALL);
    setQuery("");
  }

  return (
    <div className="space-y-5">
      <div className="relative">
        <SearchIcon
          aria-hidden="true"
          className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          type="search"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          aria-label={t("search")}
          placeholder={t("searchPlaceholder")}
          className="pl-9"
        />
      </div>

      <div className="space-y-3">
        <PillRow
          label={t("filterType")}
          allLabel={t("all")}
          options={types}
          value={type}
          onChange={setType}
        />
        <PillRow
          label={t("filterCategory")}
          allLabel={t("all")}
          options={categories}
          value={category}
          onChange={setCategory}
        />
      </div>

      <p aria-live="polite" className="text-right font-mono text-xs text-muted-foreground">
        {t("total", { count: visible.length })}
      </p>

      {visible.length === 0 ? (
        <EmptyState
          icon={SearchXIcon}
          title={t("emptyTitle")}
          description={t("emptyDescription")}
          action={
            <Button variant="outline" onClick={reset}>
              {t("reset")}
            </Button>
          }
        />
      ) : (
        <motion.ul
          key={`${type}-${category}-${keyword}`}
          className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3"
          variants={gridVariants}
          initial="hidden"
          animate="visible"
        >
          {visible.map((item) => (
            <motion.li key={item.id} variants={cardVariants} className="h-full">
              {item.node}
            </motion.li>
          ))}
        </motion.ul>
      )}
    </div>
  );
}

type PillRowProps = {
  label: string;
  allLabel: string;
  options: FilterOption[];
  value: string;
  onChange: (value: string) => void;
};

/** One labeled row of single-choice pills, e.g. "TYPE  All  Web  Mobile". */
function PillRow({ label, allLabel, options, value, onChange }: PillRowProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-full text-xs font-semibold tracking-wider text-muted-foreground uppercase sm:w-24">
        {label}
      </span>
      <div role="group" aria-label={label} className="flex flex-wrap gap-2">
        {[{ id: ALL, label: allLabel }, ...options].map((option) => {
          const selected = option.id === value;
          return (
            <button
              key={option.id}
              type="button"
              aria-pressed={selected}
              onClick={() => onChange(option.id)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-sm transition-all duration-200 active:scale-95",
                "focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
                selected
                  ? "border-transparent bg-primary font-medium text-primary-foreground shadow-md shadow-primary/20"
                  : "bg-secondary/60 text-muted-foreground hover:border-primary/40 hover:text-foreground",
              )}
            >
              {option.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
