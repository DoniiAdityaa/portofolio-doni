export const ADMIN_HOME_PATH = "/admin";
export const ADMIN_LOGIN_PATH = "/admin/login";

/**
 * Where to go after signing in. Only same-site admin paths are allowed, so a crafted
 * `?next=https://evil.example` link cannot redirect elsewhere (open redirect).
 */
export function safeAdminRedirect(next: unknown): string {
  if (typeof next !== "string") return ADMIN_HOME_PATH;
  const isAdminPath = next === ADMIN_HOME_PATH || next.startsWith(`${ADMIN_HOME_PATH}/`);
  const isLogin = next === ADMIN_LOGIN_PATH;
  return isAdminPath && !isLogin && !next.includes("//") && !next.includes("\\")
    ? next
    : ADMIN_HOME_PATH;
}
