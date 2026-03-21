import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Search, Phone, Mail, MoreHorizontal, ArrowUpDown, Filter } from "lucide-react";

interface Lead {
  id: number;
  name: string;
  phone: string;
  type: string;
  partner: string;
  date: string;
  status: "new" | "processing" | "done" | "rejected";
  score: number;
  source: "phone" | "form" | "email";
}

const statusLabels: Record<Lead["status"], string> = {
  new: "Новая",
  processing: "В работе",
  done: "Завершена",
  rejected: "Отклонена",
};

const statusStyles: Record<Lead["status"], string> = {
  new: "bg-[hsl(210_80%_52%/0.12)] text-[hsl(210_80%_52%)]",
  processing: "bg-[hsl(38_92%_50%/0.12)] text-warning",
  done: "bg-[hsl(152_60%_42%/0.12)] text-success",
  rejected: "bg-[hsl(0_72%_51%/0.12)] text-destructive",
};

const leads: Lead[] = [
  { id: 1, name: "Алексей Петров", phone: "+7 (926) 123-45-67", type: "Замер двери", partner: "Brandoors Марьино", date: "21.03.2026 14:24", status: "new", score: 82, source: "phone" },
  { id: 2, name: "Елена Сидорова", phone: "+7 (903) 234-56-78", type: "Консультация", partner: "Brandoors Митино", date: "21.03.2026 13:47", status: "processing", score: 64, source: "form" },
  { id: 3, name: "Дмитрий Козлов", phone: "+7 (915) 345-67-89", type: "Покупка двери", partner: "Brandoors Тёплый Стан", date: "21.03.2026 12:10", status: "done", score: 91, source: "phone" },
  { id: 4, name: "Ольга Иванова", phone: "+7 (977) 456-78-90", type: "Обратный звонок", partner: "Brandoors Люблино", date: "21.03.2026 11:33", status: "new", score: 20, source: "email" },
  { id: 5, name: "Сергей Морозов", phone: "+7 (916) 567-89-01", type: "Замер двери", partner: "Brandoors Марьино", date: "21.03.2026 10:15", status: "processing", score: 73, source: "form" },
  { id: 6, name: "Анна Белова", phone: "+7 (925) 678-90-12", type: "Покупка двери", partner: "Brandoors Сокольники", date: "20.03.2026 18:42", status: "rejected", score: 15, source: "email" },
  { id: 7, name: "Виктор Чернов", phone: "+7 (909) 789-01-23", type: "Консультация", partner: "Brandoors Митино", date: "20.03.2026 16:30", status: "done", score: 88, source: "phone" },
  { id: 8, name: "Наталья Крылова", phone: "+7 (926) 890-12-34", type: "Замер двери", partner: "Brandoors Тёплый Стан", date: "20.03.2026 15:18", status: "new", score: 56, source: "form" },
];

export function LeadsPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<Lead["status"] | "all">("all");

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.partner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="px-8 py-6">
      <CrmHeader title="Заявки" />

      {/* Stats row */}
      <div className="flex items-center gap-6 mb-6 opacity-0 animate-fade-up">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold tabular-nums text-foreground">{leads.length}</span>
          <span className="text-sm text-muted-foreground">всего</span>
        </div>
        <div className="h-5 w-px bg-border" />
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-[hsl(210_80%_52%)]" />
          <span className="text-sm tabular-nums text-foreground">{leads.filter(l => l.status === "new").length}</span>
          <span className="text-xs text-muted-foreground">новых</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-warning" />
          <span className="text-sm tabular-nums text-foreground">{leads.filter(l => l.status === "processing").length}</span>
          <span className="text-xs text-muted-foreground">в работе</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-success" />
          <span className="text-sm tabular-nums text-foreground">{leads.filter(l => l.status === "done").length}</span>
          <span className="text-xs text-muted-foreground">завершено</span>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск по имени или партнёру..."
              className="h-9 w-72 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
            />
          </div>
          <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
            {(["all", "new", "processing", "done", "rejected"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={`h-9 px-3 text-xs font-medium transition-colors active:scale-95 ${
                  statusFilter === s ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "all" ? "Все" : statusLabels[s]}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Клиент</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Тип</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Партнёр</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                  Дата <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Скоринг</th>
              <th className="px-5 py-3.5 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((l) => (
              <tr key={l.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {l.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{l.name}</p>
                      <p className="text-[11px] text-muted-foreground">{l.phone}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-foreground">{l.type}</td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">{l.partner}</td>
                <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">{l.date}</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[l.status]}`}>
                    {statusLabels[l.status]}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-center">
                  <div
                    className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                      l.score >= 70
                        ? "bg-[hsl(152_60%_42%/0.12)] text-success"
                        : l.score >= 40
                        ? "bg-[hsl(38_92%_50%/0.12)] text-warning"
                        : "bg-muted text-muted-foreground"
                    }`}
                  >
                    {l.score}
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
