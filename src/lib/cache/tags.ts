/**
 * Cache tags for content read by the public site. Public queries tag their cached
 * reads with these (M5), and admin actions expire them with `updateTag` after a write.
 */
export const CACHE_TAGS = {
  settings: "site-settings",
  skills: "skills",
  career: "career",
  education: "education",
  achievements: "achievements",
  projects: "projects",
  messages: "messages",
} as const;
