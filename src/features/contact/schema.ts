import { z } from "zod";

export const CONTACT_LIMITS = {
  nameMin: 2,
  nameMax: 80,
  messageMin: 10,
  messageMax: 2000,
} as const;

/** Messages one visitor may send per hour (Case 02 §15). */
export const CONTACT_RATE_LIMIT_PER_HOUR = 3;

/**
 * Contact form schema (Case 02 §10.3), shared by the form and the server action.
 * Error messages are translation keys under `contact.errors`.
 */
export const contactMessageSchema = z.object({
  name: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.nameMin, "nameTooShort")
    .max(CONTACT_LIMITS.nameMax, "nameTooLong"),
  email: z.string().trim().email("emailInvalid"),
  message: z
    .string()
    .trim()
    .min(CONTACT_LIMITS.messageMin, "messageTooShort")
    .max(CONTACT_LIMITS.messageMax, "messageTooLong"),
  /** Honeypot: hidden from people, so only bots fill it in. */
  website: z.string().max(0, "honeypot"),
});

export type ContactMessageInput = z.infer<typeof contactMessageSchema>;

export type ContactErrorKey =
  | "nameTooShort"
  | "nameTooLong"
  | "emailInvalid"
  | "messageTooShort"
  | "messageTooLong"
  | "honeypot";
