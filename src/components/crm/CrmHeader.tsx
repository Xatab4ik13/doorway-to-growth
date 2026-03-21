import { Search, Bell, ChevronDown } from "lucide-react";

interface CrmHeaderProps {
  title: string;
}

export function CrmHeader({ title }: CrmHeaderProps) {
  return (
    <header className="flex items-center justify-between pb-8">
      {/* Left: back + title */}
      <div className="flex items-center gap-4">
        <h1 className="text-lg font-semibold tracking-tight text-foreground uppercase">{title}</h1>
      </div>

      {/* Right: search + actions */}
      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search here..."
            className="h-10 w-60 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
          />
          <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
        </div>

        <button className="relative flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-accent active:scale-95">
          <Bell className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>

        {/* Avatar */}
        <div className="h-10 w-10 overflow-hidden rounded-xl">
          <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-semibold text-foreground">
            АД
          </div>
        </div>
      </div>
    </header>
  );
}
