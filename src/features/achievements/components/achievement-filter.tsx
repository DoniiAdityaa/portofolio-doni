"use client";

import { SearchXIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import type { AchievementType } from "../types";

export type AchievementFilterItem = {
  id: string;
  type: AchievementType;
  categoryId: string | null;
  /** The card, rendered on the server. */
  node: ReactNode;
};

type AchievementFilterProps = {
  items: AchievementFilterItem[];
  categories: { id: string; label: string }[];
};

const ALL = "all";
const TYPES: AchievementType[] = ["certificate", "award"];

const gridVariants = { hidden: {}, visible: { transition: { staggerChildren: 0.05 } } };
const cardVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" as const } },
};

/** Type and category filters (Case 01 §5.3) over an animated card grid. */
export function AchievementFilter({ items, categories }: AchievementFilterProps) {
  const t = useTranslations("achievements");
  const [type, setType] = useState(ALL);
  const [category, setCategory] = useState(ALL);

  const visible = items.filter(
    (item) =>
      (type === ALL || item.type === type) && (category === ALL || item.categoryId === category),
  );

  function reset() {
    setType(ALL);
    setCategory(ALL);
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Select value={type} onValueChange={setType}>
          <SelectTrigger aria-label={t("filterType")} className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allTypes")}</SelectItem>
            {TYPES.map((value) => (
              <SelectItem key={value} value={value}>
                {t(`type.${value}`)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={setCategory}>
          <SelectTrigger aria-label={t("filterCategory")} className="w-44">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={ALL}>{t("allCategories")}</SelectItem>
            {categories.map((option) => (
              <SelectItem key={option.id} value={option.id}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p aria-live="polite" className="ml-auto font-mono text-xs text-muted-foreground">
          {t("total", { count: visible.length })}
        </p>
      </div>

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
          key={`${type}-${category}`}
          className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"
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
