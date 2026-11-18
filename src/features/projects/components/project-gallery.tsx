"use client";

import { ChevronLeftIcon, ChevronRightIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";

import { Dialog, DialogClose, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { cn } from "@/lib/utils/cn";

import type { ImageOrientation } from "../types";
import { ScreenshotFrame } from "./screenshot-frame";

export type GalleryImage = {
  id: string;
  alt: string;
  orientation: ImageOrientation;
  path: string | null;
};

/**
 * Screenshot gallery (Case 01 §5.4): thumbnails open a lightbox with previous/next
 * buttons and arrow-key navigation. Portrait and landscape shots keep their shape.
 */
export function ProjectGallery({ title, images }: { title: string; images: GalleryImage[] }) {
  const t = useTranslations("projects");
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [direction, setDirection] = useState(1);
  const current = openIndex === null ? null : images[openIndex];
  const portraitOnly = images.every((image) => image.orientation === "portrait");

  function go(step: number) {
    setDirection(step);
    setOpenIndex((index) =>
      index === null ? null : (index + step + images.length) % images.length,
    );
  }

  return (
    <>
      <ul
        className={cn(
          "grid gap-4",
          portraitOnly ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-1 sm:grid-cols-2",
        )}
      >
        {images.map((image, index) => (
          <li key={image.id}>
            <button
              type="button"
              aria-label={t("openImage", { alt: image.alt })}
              onClick={() => {
                setDirection(1);
                setOpenIndex(index);
              }}
              className="block w-full rounded-[1.75rem] transition-transform duration-300 hover:-translate-y-1 focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
            >
              <ScreenshotFrame orientation={image.orientation} label={image.alt} src={image.path} />
            </button>
          </li>
        ))}
      </ul>

      <Dialog open={current !== null} onOpenChange={(open) => !open && setOpenIndex(null)}>
        <DialogContent
          showCloseButton={false}
          onKeyDown={(event) => {
            if (event.key === "ArrowRight") go(1);
            if (event.key === "ArrowLeft") go(-1);
          }}
          className="gap-4 bg-transparent p-0 ring-0 sm:max-w-3xl"
        >
          <DialogTitle className="sr-only">
            {title}: {current?.alt}
          </DialogTitle>
          <div className="relative flex items-center justify-center">
            <AnimatePresence mode="wait" custom={direction} initial={false}>
              {current ? (
                <motion.div
                  key={current.id}
                  custom={direction}
                  initial={{ opacity: 0, x: direction * 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: direction * -40 }}
                  transition={{ duration: 0.25, ease: "easeOut" }}
                  className={current.orientation === "portrait" ? "w-64 sm:w-72" : "w-full"}
                >
                  <ScreenshotFrame
                    orientation={current.orientation}
                    label={current.alt}
                    src={current.path}
                  />
                </motion.div>
              ) : null}
            </AnimatePresence>
          </div>
          <div className="flex items-center justify-center gap-3">
            <GalleryButton label={t("previous")} onClick={() => go(-1)}>
              <ChevronLeftIcon aria-hidden="true" className="size-5" />
            </GalleryButton>
            <p
              aria-live="polite"
              className="min-w-16 text-center font-mono text-xs text-foreground"
            >
              {openIndex === null
                ? null
                : t("imageCount", { current: openIndex + 1, total: images.length })}
            </p>
            <GalleryButton label={t("next")} onClick={() => go(1)}>
              <ChevronRightIcon aria-hidden="true" className="size-5" />
            </GalleryButton>
            <DialogClose asChild>
              <GalleryButton label={t("close")}>
                <XIcon aria-hidden="true" className="size-5" />
              </GalleryButton>
            </DialogClose>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}

function GalleryButton({
  label,
  onClick,
  children,
  ...props
}: {
  label: string;
  onClick?: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      className="flex size-10 items-center justify-center rounded-full bg-secondary text-foreground transition-all hover:scale-110 hover:bg-primary hover:text-primary-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
      {...props}
    >
      {children}
    </button>
  );
}
