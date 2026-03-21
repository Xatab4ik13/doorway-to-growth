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
      className="group relative flex flex-col justify-between rounded-2xl border border-border bg-card p-5 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 opacity-0 animate-fade-up overflow-hidden"
      style={{ animationDelay: `${delay}ms` }}
    >
      {/* Subtle decorative corner — door panel motif */}
      <div className="absolute -right-6 -top-6 h-16 w-16 rounded-2xl border border-border/40 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute -right-3 -top-3 h-10 w-10 rounded-xl border border-border/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-75" />

      {/* Top row: icon + label + arrow */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-foreground/[0.06]">
            <Icon className="h-4 w-4 text-foreground/60" strokeWidth={1.8} />
          </div>
          <span className="text-sm font-medium text-foreground">{label}</span>
        </div>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground active:scale-95">
          <ArrowUpRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" strokeWidth={2} />
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
