import { ArrowUpRight } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  delay?: number;
  sparkline?: number[];
}

function Sparkline({ data, positive = true }: { data: number[]; positive?: boolean }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const h = 32;
  const w = 80;
  const step = w / (data.length - 1);

  const points = data
    .map((v, i) => `${i * step},${h - ((v - min) / range) * h}`)
    .join(" ");

  return (
    <svg width={w} height={h} className="shrink-0">
      <polyline
        points={points}
        fill="none"
        stroke={positive ? "hsl(152, 55%, 42%)" : "hsl(0, 68%, 52%)"}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function StatCard({ icon: Icon, label, value, change, changePositive = true, delay = 0, sparkline }: StatCardProps) {
  return (
    <div
      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-card-hover opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" strokeWidth={2} />
      </div>

      <div className="mt-5 flex items-end justify-between gap-3">
        <div className="flex items-baseline gap-1">
          <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums leading-none">
            {value}
          </span>
          {change && (
            <span className={`text-xs font-medium tabular-nums ml-1 ${changePositive ? "text-success" : "text-destructive"}`}>
              {change}
            </span>
          )}
        </div>
        {sparkline && <Sparkline data={sparkline} positive={changePositive} />}
      </div>
    </div>
  );
}
