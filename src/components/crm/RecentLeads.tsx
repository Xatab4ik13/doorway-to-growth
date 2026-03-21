import { Phone, Mail, MoreHorizontal } from "lucide-react";

const leads = [
  {
    name: "Алексей Петров",
    store: "Brandoors Марьино",
    type: "Звонок",
    time: "14 мин назад",
    status: "Новая",
  },
  {
    name: "Елена Сидорова",
    store: "Brandoors Тёплый Стан",
    type: "Форма",
    time: "47 мин назад",
    status: "Новая",
  },
  {
    name: "Дмитрий Козлов",
    store: "Brandoors Митино",
    type: "Звонок",
    time: "1 ч назад",
    status: "В работе",
  },
  {
    name: "Ольга Иванова",
    store: "Brandoors Люблино",
    type: "Форма",
    time: "2 ч назад",
    status: "В работе",
  },
  {
    name: "Сергей Волков",
    store: "Brandoors Сокольники",
    type: "Форма",
    time: "3 ч назад",
    status: "Завершена",
  },
];

export function RecentLeads() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card opacity-0 animate-fade-in" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Последние заявки</h3>
        <button className="text-xs font-medium text-primary hover:underline active:scale-[0.97]">
          Все заявки
        </button>
      </div>
      <div className="divide-y divide-border">
        {leads.map((lead, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary text-sm font-semibold text-foreground">
              {lead.name.split(" ").map((n) => n[0]).join("")}
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{lead.name}</p>
              <p className="truncate text-xs text-muted-foreground">{lead.store}</p>
            </div>
            <div className="hidden items-center gap-1.5 sm:flex">
              {lead.type === "Звонок" ? (
                <Phone className="h-3.5 w-3.5 text-muted-foreground" />
              ) : (
                <Mail className="h-3.5 w-3.5 text-muted-foreground" />
              )}
              <span className="text-xs text-muted-foreground">{lead.type}</span>
            </div>
            <span className="hidden text-xs text-muted-foreground lg:block">{lead.time}</span>
            <span
              className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                lead.status === "Новая"
                  ? "bg-[hsl(220_80%_50%/0.1)] text-primary"
                  : lead.status === "В работе"
                  ? "bg-[hsl(38_92%_50%/0.1)] text-warning"
                  : "bg-[hsl(152_60%_42%/0.1)] text-success"
              }`}
            >
              {lead.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
