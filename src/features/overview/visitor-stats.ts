import "server-only";

import { createSupabaseServerClient } from "@/lib/supabase/server";

export type DailyVisits = { day: string; views: number; visitors: number };

export type VisitorStats = {
  days: DailyVisits[];
  totals: Record<"today" | "week" | "month", { views: number; visitors: number }>;
};

const CHART_DAYS = 30;

/**
 * Page views and unique visitors for the last 30 days (Case 02 §10.2). Visitor hashes
 * rotate daily, so weekly and monthly "visitors" add up the daily unique counts.
 */
export async function getVisitorStats(): Promise<VisitorStats> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.rpc("daily_visitor_stats", { days: CHART_DAYS });
  if (error) throw error;

  const days = data.map((row) => ({
    day: row.day,
    views: Number(row.views),
    visitors: Number(row.visitors),
  }));
  const sumLast = (count: number) =>
    days.slice(-count).reduce(
      (total, day) => ({
        views: total.views + day.views,
        visitors: total.visitors + day.visitors,
      }),
      { views: 0, visitors: 0 },
    );

  return { days, totals: { today: sumLast(1), week: sumLast(7), month: sumLast(CHART_DAYS) } };
}

/** When the GitHub snapshot was last saved, or `null` if none exists yet. */
export async function getGithubFetchedAt(): Promise<string | null> {
  const supabase = await createSupabaseServerClient();
  const { data, error } = await supabase.from("github_snapshot").select("fetched_at").maybeSingle();
  if (error) throw error;
  return data?.fetched_at ?? null;
}
