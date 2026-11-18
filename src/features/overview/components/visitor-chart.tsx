import type { VisitorStats } from "../visitor-stats";

const CHART_HEIGHT = 120;
const BAR_GAP = 2;

/** Page views per day (bars) with unique visitors as the darker inner bar. */
export function VisitorChart({ stats }: { stats: VisitorStats }) {
  const { days, totals } = stats;
  const max = Math.max(1, ...days.map((day) => day.views));
  const barWidth = 100 / days.length;

  return (
    <section
      aria-labelledby="visitors-title"
      className="flex flex-col gap-4 rounded-xl border bg-card p-5"
    >
      <div className="flex flex-wrap items-end justify-between gap-4">
        <h2 id="visitors-title" className="font-heading text-lg font-semibold">
          Visitors
        </h2>
        <dl className="flex gap-6 text-sm">
          {(
            [
              ["Today", totals.today],
              ["7 days", totals.week],
              ["30 days", totals.month],
            ] as const
          ).map(([label, total]) => (
            <div key={label}>
              <dt className="text-xs text-muted-foreground">{label}</dt>
              <dd className="tabular-nums">
                <span className="font-heading text-lg font-semibold">{total.visitors}</span>{" "}
                <span className="text-muted-foreground">/ {total.views} views</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <svg
        role="img"
        aria-label={`Last ${days.length} days: ${totals.month.views} page views and ${totals.month.visitors} daily unique visitors.`}
        viewBox={`0 0 100 ${CHART_HEIGHT}`}
        preserveAspectRatio="none"
        className="h-32 w-full"
      >
        {days.map((day, index) => {
          const x = index * barWidth + BAR_GAP / 4;
          const width = barWidth - BAR_GAP / 2;
          const viewsHeight = (day.views / max) * CHART_HEIGHT;
          const visitorsHeight = (day.visitors / max) * CHART_HEIGHT;

          return (
            <g key={day.day}>
              <title>{`${day.day}: ${day.visitors} visitors, ${day.views} views`}</title>
              <rect
                x={x}
                y={CHART_HEIGHT - viewsHeight}
                width={width}
                height={viewsHeight}
                className="fill-primary/30"
              />
              <rect
                x={x}
                y={CHART_HEIGHT - visitorsHeight}
                width={width}
                height={visitorsHeight}
                className="fill-primary"
              />
            </g>
          );
        })}
      </svg>
      <p className="flex gap-4 text-xs text-muted-foreground">
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-sm bg-primary" /> Unique visitors
        </span>
        <span className="flex items-center gap-1.5">
          <span aria-hidden="true" className="size-2 rounded-sm bg-primary/30" /> Page views
        </span>
      </p>
    </section>
  );
}
