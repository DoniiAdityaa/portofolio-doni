"use client";

import type { ReactNode } from "react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

type LightboxProps = {
  /** The element that opens the lightbox, e.g. a thumbnail button. */
  trigger: ReactNode;
  title: string;
  description?: string;
  /** Enlarged content: an image, plus optional details and actions. */
  children: ReactNode;
};

/**
 * Modal viewer for certificates and gallery images (Case 01 §5.3, §5.4).
 * Closes with the close button, the Esc key, or a click outside, and traps focus while open.
 */
export function Lightbox({ trigger, title, description, children }: LightboxProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description ? <DialogDescription>{description}</DialogDescription> : null}
        </DialogHeader>
        {children}
      </DialogContent>
    </Dialog>
  );
}
