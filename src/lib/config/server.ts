import "server-only";

import { parseEnv, serverEnvSchema } from "./schema";

/**
 * All environment variables, including secrets.
 * The `server-only` import makes the build fail if a client component imports this file.
 */
export const serverEnv = parseEnv(serverEnvSchema, process.env);
