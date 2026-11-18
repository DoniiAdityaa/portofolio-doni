import { createHash, createHmac } from "node:crypto";

/**
 * An anonymous visitor id (Case 02 §10.2): sha256 of a daily salt, the IP, and the user
 * agent. The raw IP is never stored, and the salt changes every UTC day, so a visitor
 * cannot be followed from one day to the next.
 */
export function hashVisitor({
  secret,
  ip,
  userAgent,
  now = new Date(),
}: {
  secret: string;
  ip: string;
  userAgent: string;
  now?: Date;
}): string {
  const day = now.toISOString().slice(0, 10);
  const dailySalt = createHmac("sha256", secret).update(day).digest("hex");
  return createHash("sha256").update(`${dailySalt}|${ip}|${userAgent}`).digest("hex");
}

/** The client IP from proxy headers (Vercel sets x-forwarded-for). */
export function clientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || headers.get("x-real-ip") || "unknown";
}

const BOT_PATTERN =
  /bot|crawl|spider|slurp|preview|facebookexternalhit|embedly|lighthouse|headless|curl|wget/i;

/** Crawlers and link previews are not counted as visitors. */
export function isBot(userAgent: string): boolean {
  return userAgent === "" || BOT_PATTERN.test(userAgent);
}
