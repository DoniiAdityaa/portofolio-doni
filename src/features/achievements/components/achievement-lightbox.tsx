"use client";

import { XIcon } from "lucide-react";
import { motion } from "motion/react";
import { useTranslations } from "next-intl";
import type { ReactNode } from "react";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type AchievementLightboxProps = {
  trigger: ReactNode;
  title: string;
  issuer: string;
  /** Large certificate image (left on desktop, top on phones). */
  image: ReactNode;
  /** Detail blocks for the side panel; each one slides in after the previous. */
  details: ReactNode[];
};

const EASE = [0.22, 1, 0.36, 1] as const;

/**
 * Certificate viewer (Case 01 §5.3, CR-05): big image on the left, details panel
 * on the right. The image eases in while the details slide in one by one.
 */
export function AchievementLightbox({
  trigger,
  title,
  issuer,
  image,
  details,
}: AchievementLightboxProps) {
  const t = useTranslations("common");

  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent
        showCloseButton={false}
        className="max-h-[90vh] gap-0 overflow-y-auto p-0 duration-300 sm:max-w-5xl md:grid-cols-[minmax(0,1fr)_20rem] md:overflow-hidden"
      >
        <motion.div
          className="flex items-center justify-center bg-secondary/40 md:min-h-[28rem]"
          initial={{ opacity: 0, scale: 1.04 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, ease: EASE }}
        >
          {image}
        </motion.div>

        <div className="relative flex flex-col gap-5 border-t p-6 md:border-t-0 md:border-l md:pr-14">
          <motion.div
            className="space-y-1.5"
            initial={{ opacity: 0, x: 16 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.4, delay: 0.1, ease: EASE }}
          >
            <DialogTitle className="font-heading text-xl leading-snug font-semibold">
              {title}
            </DialogTitle>
            <DialogDescription>{issuer}</DialogDescription>
          </motion.div>

          {details.map((detail, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: 16 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.18 + index * 0.06, ease: EASE }}
            >
              {detail}
            </motion.div>
          ))}

          <DialogClose
            aria-label={t("close")}
            className="absolute top-4 right-4 flex size-9 items-center justify-center rounded-full bg-secondary text-muted-foreground transition-all duration-200 hover:rotate-90 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            <XIcon aria-hidden="true" className="size-4" />
          </DialogClose>
        </div>
      </DialogContent>
    </Dialog>
  );
}
