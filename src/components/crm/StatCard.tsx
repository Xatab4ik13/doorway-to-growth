import { ArrowUpRight } from "lucide-react";

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
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
            <Icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          </div>
          <span className="text-sm font-medium text-muted-foreground">{label}</span>
        </div>
        <ArrowUpRight className="h-4 w-4 text-muted-foreground/50 transition-colors group-hover:text-foreground" strokeWidth={2} />
      </div>

      <div className="mt-5 flex items-baseline gap-1">
        <span className="text-3xl font-semibold tracking-tight text-foreground tabular-nums leading-none">
          {value}
        </span>
        {change && (
          <span className={`text-xs font-medium tabular-nums ml-1 ${changePositive ? "text-success" : "text-destructive"}`}>
            {change}
          </span>
        )}
      </div>
    </div>
  );
}
