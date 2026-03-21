import { Phone, Mail, RefreshCw, CalendarDays, Search } from "lucide-react";

const leads = [
  {
    name: "Алексей Петров",
    role: "Замер двери",
    date: "21.03.2026 14:24",
    tag: "Лид",
    score: 82,
    type: "phone" as const,
  },
  {
    name: "Елена Сидорова",
    role: "Консультация",
    date: "21.03.2026 13:47",
    tag: "Лид",
    score: 64,
    type: "mail" as const,
  },
  {
    name: "Дмитрий Козлов",
    role: "Покупка двери",
    date: "21.03.2026 12:10",
    tag: "Лид",
    score: 91,
    type: "phone" as const,
  },
  {
    name: "Ольга Иванова",
    role: "Обратный звонок",
    date: "21.03.2026 11:33",
    tag: "Лид",
    score: 20,
    type: "mail" as const,
  },
];

export function RecentLeads() {
  return (
    <div className="rounded-2xl border border-border bg-card opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Последние заявки</h3>
        <div className="flex items-center gap-1">
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
            <RefreshCw className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
            <CalendarDays className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
          <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
            <Search className="h-3.5 w-3.5" strokeWidth={2} />
          </button>
        </div>
      </div>

      {/* Lead items */}
      <div className="divide-y divide-border">
        {leads.map((lead, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40">
            {/* Avatar */}
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
              {lead.name.split(" ").map(n => n[0]).join("")}
            </div>

            {/* Info */}
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
              <p className="text-xs text-muted-foreground truncate">{lead.role}</p>
            </div>

            {/* Action icon */}
            <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
              {lead.type === "phone" ? (
                <Phone className="h-3.5 w-3.5" strokeWidth={2} />
              ) : (
                <Mail className="h-3.5 w-3.5" strokeWidth={2} />
              )}
            </button>

            {/* Tag + date */}
            <div className="hidden sm:block text-right min-w-[120px]">
              <span className="inline-block rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                {lead.tag}
              </span>
              <p className="mt-0.5 text-[11px] text-muted-foreground tabular-nums">{lead.date}</p>
            </div>

            {/* Score */}
            <div
              className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-semibold ${
                lead.score >= 70
                  ? "bg-[hsl(152_60%_42%/0.12)] text-success"
                  : lead.score >= 40
                  ? "bg-[hsl(38_92%_50%/0.12)] text-warning"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {lead.score}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
