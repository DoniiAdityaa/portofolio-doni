"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, Loader2Icon, SendIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { cloneElement, useId, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils/cn";

import type { ContactErrorKey, ContactMessageInput } from "../schema";
import { CONTACT_LIMITS, contactMessageSchema } from "../schema";

/**
 * Contact form (Case 01 §5.6). Validates in the browser with the shared Zod schema.
 * Sending is wired to a server action in M6; until then a valid form shows a notice
 * instead of pretending the message was sent.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    control,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<ContactMessageInput>({
    resolver: zodResolver(contactMessageSchema),
    defaultValues: { name: "", email: "", message: "", website: "" },
    mode: "onTouched",
  });
  const messageLength = useWatch({ control, name: "message" }).length;

  async function onSubmit() {
    // M6: call the contact server action here and keep the input if it fails.
    await new Promise((resolve) => setTimeout(resolve, 400));
    setSubmitted(true);
    reset();
  }

  const errorText = (key?: string) => (key ? t(`errors.${key as ContactErrorKey}`) : undefined);

  return (
    <CodeWindow title={t("windowTitle")} badge={t("windowBadge")}>
      <form noValidate onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Field id="name" line={1} label={t("fields.name")} error={errorText(errors.name?.message)}>
          <Input
            autoComplete="name"
            placeholder={t("placeholders.name")}
            aria-invalid={Boolean(errors.name)}
            {...register("name")}
          />
        </Field>

        <Field
          id="email"
          line={2}
          label={t("fields.email")}
          error={errorText(errors.email?.message)}
        >
          <Input
            type="email"
            autoComplete="email"
            placeholder={t("placeholders.email")}
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
        </Field>

        <Field
          id="message"
          line={3}
          label={t("fields.message")}
          error={errorText(errors.message?.message)}
          hint={`${messageLength}/${CONTACT_LIMITS.messageMax}`}
        >
          <Textarea
            rows={6}
            placeholder={t("placeholders.message")}
            aria-invalid={Boolean(errors.message)}
            className="resize-y"
            {...register("message")}
          />
        </Field>

        {/* Honeypot: invisible to people and skipped by keyboard and screen readers. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input tabIndex={-1} autoComplete="off" {...register("website")} />
          </label>
        </div>

        <Button
          type="submit"
          size="lg"
          disabled={isSubmitting}
          className="group w-full sm:ml-8 sm:w-auto"
        >
          {isSubmitting ? (
            <Loader2Icon aria-hidden="true" className="animate-spin" />
          ) : (
            <SendIcon
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          )}
          {isSubmitting ? t("sending") : t("send")}
        </Button>

        <AnimatePresence>
          {submitted ? (
            <motion.p
              role="status"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="flex items-start gap-2 rounded-lg border border-teal/30 bg-teal/10 p-3 text-sm text-foreground sm:ml-8"
            >
              <CircleCheckIcon aria-hidden="true" className="mt-0.5 size-4 shrink-0 text-teal" />
              {t("comingSoonNotice")}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </form>
    </CodeWindow>
  );
}

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
function Field({ id, line, label, error, hint, children }: FieldProps) {
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
function CodeWindow({
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
