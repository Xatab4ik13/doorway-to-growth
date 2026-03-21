import { Search, Bell, ChevronDown, ArrowLeft, SlidersHorizontal } from "lucide-react";

interface CrmHeaderProps {
  title: string;
}

export function CrmHeader({ title }: CrmHeaderProps) {
  return (
    <header className="flex items-center justify-between pb-8">
      {/* Left: back arrow + title */}
      <div className="flex items-center gap-3">
        <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
          <ArrowLeft className="h-4 w-4" strokeWidth={2} />
        </button>
        <h1 className="text-base font-semibold tracking-wide text-foreground uppercase">{title}</h1>
      </div>

      {/* Center: search */}
      <div className="relative hidden md:block">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search here..."
          className="h-10 w-56 rounded-xl border border-border bg-card pl-9 pr-9 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
        />
        <ChevronDown className="absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
      </div>

      {/* Right: filter + sort + bell + avatar */}
      <div className="flex items-center gap-2">
        <button className="flex h-9 items-center gap-1.5 rounded-xl border border-border bg-card px-3 text-xs font-medium text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
          <SlidersHorizontal className="h-3.5 w-3.5" strokeWidth={2} />
        </button>
        <span className="text-xs font-medium text-muted-foreground">All</span>
        
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground transition-all hover:bg-muted active:scale-95 ml-2">
          <Bell className="h-[16px] w-[16px]" strokeWidth={1.8} />
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive ring-2 ring-card" />
        </button>

        {/* Avatar */}
        <div className="h-9 w-9 overflow-hidden rounded-xl">
          <div className="flex h-full w-full items-center justify-center bg-muted text-xs font-semibold text-foreground">
            АД
          </div>
        </div>
      </div>
    </header>
  );
}
