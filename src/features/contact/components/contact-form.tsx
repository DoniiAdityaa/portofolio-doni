"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, Loader2Icon, SendIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

import { type ContactSendError, sendContactMessage } from "../actions";
import type { ContactErrorKey, ContactMessageInput } from "../schema";
import { CONTACT_LIMITS, contactMessageSchema } from "../schema";
import { CodeWindow, Field } from "./code-window";

/**
 * Contact form (Case 01 §5.6). Validates in the browser with the shared Zod schema.
 * Sending is wired to a server action in M6; until then a valid form shows a notice
 * instead of pretending the message was sent.
 */
export function ContactForm() {
  const t = useTranslations("contact");
  const [submitted, setSubmitted] = useState(false);
  const [sendError, setSendError] = useState<ContactSendError | null>(null);
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

  async function onSubmit(values: ContactMessageInput) {
    setSendError(null);
    const result = await sendContactMessage(values);
    if (!result.ok) {
      // Keep what the visitor typed, so they can try again.
      setSendError(result.error);
      return;
    }
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
              {t("sentNotice")}
            </motion.p>
          ) : null}
          {sendError ? (
            <motion.p
              role="alert"
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="rounded-lg border border-destructive/30 bg-destructive/10 p-3 text-sm text-foreground sm:ml-8"
            >
              {t(`sendErrors.${sendError}`)}
            </motion.p>
          ) : null}
        </AnimatePresence>
      </form>
    </CodeWindow>
  );
}
