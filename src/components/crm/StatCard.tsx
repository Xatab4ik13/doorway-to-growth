import { cn } from "@/lib/utils";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change?: string;
  changeType?: "positive" | "negative" | "neutral";
  icon: React.ElementType;
  delay?: number;
}

export function StatCard({ title, value, change, changeType = "neutral", icon: Icon, delay = 0 }: StatCardProps) {
  return (
    <div
      className="group rounded-xl border border-border bg-card p-5 shadow-card transition-shadow duration-200 hover:shadow-card-hover opacity-0 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-secondary">
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        {change && (
          <span
            className={cn(
              "inline-flex items-center gap-0.5 rounded-full px-2 py-0.5 text-xs font-medium",
              changeType === "positive" && "bg-[hsl(152_60%_42%/0.1)] text-success",
              changeType === "negative" && "bg-[hsl(0_72%_51%/0.1)] text-destructive",
              changeType === "neutral" && "bg-secondary text-muted-foreground"
            )}
          >
            {changeType === "positive" && <ArrowUpRight className="h-3 w-3" />}
            {changeType === "negative" && <ArrowDownRight className="h-3 w-3" />}
            {change}
          </span>
        )}
      </div>
      <div className="mt-4">
        <p className="text-2xl font-semibold tracking-tight text-foreground tabular-nums">{value}</p>
        <p className="mt-1 text-sm text-muted-foreground">{title}</p>
      </div>
    </div>
  );
}
