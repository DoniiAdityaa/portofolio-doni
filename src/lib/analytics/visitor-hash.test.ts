import { describe, expect, it } from "vitest";

import { clientIp, hashVisitor, isBot } from "./visitor-hash";

const visitor = { secret: "s3cret", ip: "203.0.113.7", userAgent: "Mozilla/5.0 Firefox" };

describe("hashVisitor", () => {
  it("is stable within a day and never contains the IP", () => {
    const morning = hashVisitor({ ...visitor, now: new Date("2026-11-18T01:00:00Z") });
    const evening = hashVisitor({ ...visitor, now: new Date("2026-11-18T22:00:00Z") });

    expect(morning).toBe(evening);
    expect(morning).toMatch(/^[0-9a-f]{64}$/);
    expect(morning).not.toContain("203.0.113.7");
  });

  it("changes every day, so visitors cannot be followed across days", () => {
    const today = hashVisitor({ ...visitor, now: new Date("2026-11-18T12:00:00Z") });
    const tomorrow = hashVisitor({ ...visitor, now: new Date("2026-11-19T12:00:00Z") });

    expect(today).not.toBe(tomorrow);
  });

  it("differs per visitor and per secret", () => {
    const now = new Date("2026-11-18T12:00:00Z");
    const base = hashVisitor({ ...visitor, now });

    expect(hashVisitor({ ...visitor, ip: "203.0.113.8", now })).not.toBe(base);
    expect(hashVisitor({ ...visitor, secret: "other", now })).not.toBe(base);
  });
});

describe("clientIp", () => {
  it("takes the first forwarded address", () => {
    const headers = new Headers({ "x-forwarded-for": "198.51.100.1, 10.0.0.1" });
    expect(clientIp(headers)).toBe("198.51.100.1");
  });

  it("falls back when no proxy header is present", () => {
    expect(clientIp(new Headers())).toBe("unknown");
  });
});

describe("isBot", () => {
  it("skips crawlers and empty user agents", () => {
    expect(isBot("Googlebot/2.1")).toBe(true);
    expect(isBot("")).toBe(true);
    expect(isBot("Mozilla/5.0 (Macintosh) Safari/605")).toBe(false);
  });
});
