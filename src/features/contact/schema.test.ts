import { describe, expect, it } from "vitest";

import { contactMessageSchema } from "./schema";

const valid = {
  name: "Doni",
  email: "doni@example.com",
  message: "Hello, I'd like to talk about a project.",
  website: "",
};

describe("contactMessageSchema", () => {
  it("accepts a valid message and trims whitespace", () => {
    const result = contactMessageSchema.parse({ ...valid, name: "  Doni  " });
    expect(result.name).toBe("Doni");
  });

  it("rejects an invalid email and a short message", () => {
    const result = contactMessageSchema.safeParse({
      ...valid,
      email: "not-an-email",
      message: "Hi",
    });

    expect(result.success).toBe(false);
    const messages = result.error?.issues.map((issue) => issue.message);
    expect(messages).toContain("emailInvalid");
    expect(messages).toContain("messageTooShort");
  });

  it("rejects submissions that fill in the honeypot", () => {
    const result = contactMessageSchema.safeParse({ ...valid, website: "spam.example" });
    expect(result.success).toBe(false);
  });
});
