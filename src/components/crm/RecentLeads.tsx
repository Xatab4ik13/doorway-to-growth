import { Phone, Mail, RefreshCw, CalendarDays, Search } from "lucide-react";

const leads = [
  {
    name: "Алексей Петров",
    role: "Замер двери",
    date: "21.03.2026 14:24",
    tag: "Лид",
    score: 82,
    type: "phone" as const,
    avatar: "АП",
  },
  {
    name: "Елена Сидорова",
    role: "Консультация",
    date: "21.03.2026 13:47",
    tag: "Лид",
    score: 64,
    type: "mail" as const,
    avatar: "ЕС",
  },
  {
    name: "Дмитрий Козлов",
    role: "Покупка двери",
    date: "21.03.2026 12:10",
    tag: "Лид",
    score: 91,
    type: "phone" as const,
    avatar: "ДК",
  },
  {
    name: "Ольга Иванова",
    role: "Обратный звонок",
    date: "21.03.2026 11:33",
    tag: "Лид",
    score: 20,
    type: "mail" as const,
    avatar: "ОИ",
  },
];

export function RecentLeads() {
  return (
    <div className="opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Подготовка к встречам</h3>
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

      {/* 2-column grid of lead cards */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {leads.map((lead, i) => (
          <div
            key={i}
            className="flex flex-col rounded-2xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-card-hover"
          >
            {/* Top: avatar + name + action */}
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                {lead.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                <p className="text-xs text-muted-foreground truncate">{lead.role}</p>
              </div>
              <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
                {lead.type === "phone" ? (
                  <Phone className="h-3.5 w-3.5" strokeWidth={2} />
                ) : (
                  <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                )}
              </button>
            </div>

            {/* Bottom: tag + date + score */}
            <div className="mt-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                  {lead.tag}
                </span>
                <span className="text-[11px] text-muted-foreground tabular-nums">{lead.date}</span>
              </div>
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
          </div>
        ))}
      </div>
    </div>
  );
}
