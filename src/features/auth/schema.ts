import { z } from "zod";

/** Admin sign-in form, validated again on the server. */
export const signInSchema = z.object({
  email: z.email("Enter a valid email address."),
  password: z.string().min(1, "Enter your password.").max(200),
});

export type SignInInput = z.infer<typeof signInSchema>;
