import { Search, Bell } from "lucide-react";

interface CrmHeaderProps {
  title: string;
  subtitle?: string;
}

export function CrmHeader({ title, subtitle }: CrmHeaderProps) {
  return (
    <header className="flex items-center justify-between pb-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">{title}</h1>
        {subtitle && <p className="mt-0.5 text-sm text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-3">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Поиск..."
            className="h-9 w-56 rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
          />
        </div>
        <button className="relative flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-card text-muted-foreground transition-colors hover:bg-secondary active:scale-[0.96]">
          <Bell className="h-4 w-4" />
          <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-primary" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-foreground text-xs font-semibold text-card">
          АД
        </div>
      </div>
    </header>
  );
}
