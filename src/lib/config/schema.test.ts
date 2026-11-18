import { describe, expect, it } from "vitest";

import { clientEnvSchema, parseEnv, serverEnvSchema } from "./schema";

describe("parseEnv", () => {
  it("applies the default site URL when none is set", () => {
    const env = parseEnv(clientEnvSchema, {});

    expect(env.NEXT_PUBLIC_SITE_URL).toBe("http://localhost:3000");
  });

  it("treats empty strings as not set", () => {
    const env = parseEnv(serverEnvSchema, { GITHUB_TOKEN: "", NEXT_PUBLIC_SUPABASE_URL: "" });

    expect(env.GITHUB_TOKEN).toBeUndefined();
    expect(env.NEXT_PUBLIC_SUPABASE_URL).toBeUndefined();
  });

  it("lists every invalid variable in one error", () => {
    const parse = () =>
      parseEnv(clientEnvSchema, {
        NEXT_PUBLIC_SITE_URL: "not-a-url",
        NEXT_PUBLIC_SUPABASE_URL: "also-not-a-url",
      });

    expect(parse).toThrow(/NEXT_PUBLIC_SITE_URL/);
    expect(parse).toThrow(/NEXT_PUBLIC_SUPABASE_URL/);
  });
});
