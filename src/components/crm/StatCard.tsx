import { ArrowUpRight, MoreHorizontal } from "lucide-react";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string;
  change?: string;
  changePositive?: boolean;
  delay?: number;
}

export function StatCard({ icon: Icon, label, value, change, changePositive = true, delay = 0 }: StatCardProps) {
  return (
    <div
      className="group flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-card-hover opacity-0 animate-fade-up"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Top row: icon + label + arrow */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/10">
            <Icon className="h-4 w-4 text-primary" strokeWidth={1.8} />
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95">
          <ArrowUpRight className="h-4 w-4" strokeWidth={2} />
        </button>
      </div>

      {/* Value with superscript change */}
      <div className="mt-6 flex items-end justify-between">
        <div className="flex items-baseline gap-0.5">
          <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums leading-none">
            {value}
          </span>
          {change && (
            <sup className={`text-[11px] font-semibold tabular-nums relative -top-3 ml-0.5 ${changePositive ? "text-success" : "text-destructive"}`}>
              {change}
            </sup>
          )}
        </div>
        <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-muted active:scale-95">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
