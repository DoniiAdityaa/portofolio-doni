import "server-only";

import { headers } from "next/headers";

import { serverEnv } from "@/lib/config/server";

import { clientIp, hashVisitor, isBot } from "./visitor-hash";

/** The current request's anonymous visitor hash, or `null` for bots. */
export async function currentVisitorHash(): Promise<string | null> {
  const secret = serverEnv.VISITOR_HASH_SALT;
  if (!secret) throw new Error("VISITOR_HASH_SALT is not set (see .env.example).");

  const requestHeaders = await headers();
  const userAgent = requestHeaders.get("user-agent") ?? "";
  if (isBot(userAgent)) return null;

  return hashVisitor({ secret, ip: clientIp(requestHeaders), userAgent });
}
