"use client";

import { PlusIcon, Trash2Icon } from "lucide-react";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

/** "Add …" button under a repeatable list in admin forms. */
export function AddButton({
  disabled,
  onClick,
  children,
}: {
  disabled: boolean;
  onClick: () => void;
  children: ReactNode;
}) {
  return (
    <Button
      type="button"
      variant="outline"
      size="sm"
      className="self-start"
      disabled={disabled}
      onClick={onClick}
    >
      <PlusIcon aria-hidden="true" />
      {children}
    </Button>
  );
}

/** Icon button that removes one item from a repeatable list. */
export function RemoveButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label={label}
      title={label}
      onClick={onClick}
    >
      <Trash2Icon aria-hidden="true" />
    </Button>
  );
}
