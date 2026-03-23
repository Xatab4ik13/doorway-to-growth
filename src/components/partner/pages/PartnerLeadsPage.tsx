import { useState } from "react";
import { PartnerHeader } from "../PartnerHeader";
import { Search, Phone, Mail, Calendar, ChevronRight, Filter } from "lucide-react";

const stages = [
  { id: "new", label: "Новые", color: "bg-blue-500" },
  { id: "consultation", label: "Консультация", color: "bg-amber-500" },
  { id: "measurement", label: "Замер", color: "bg-purple-500" },
  { id: "calculation", label: "Расчёт", color: "bg-cyan-500" },
  { id: "contract", label: "Договор", color: "bg-emerald-500" },
  { id: "installation", label: "Монтаж", color: "bg-orange-500" },
  { id: "completed", label: "Завершена", color: "bg-green-600" },
];

const mockLeads = [
  { id: 1, name: "Петров Иван", phone: "+7 (999) 123-45-67", email: "petrov@mail.ru", product: "Milano Premium", stage: "new", date: "22 марта 2026", source: "Сайт" },
  { id: 2, name: "Сидорова Анна", phone: "+7 (916) 987-65-43", email: "sidorova@gmail.com", product: "Classic Oak", stage: "consultation", date: "21 марта 2026", source: "Звонок" },
  { id: 3, name: "Козлов Дмитрий", phone: "+7 (926) 555-11-22", email: "kozlov@yandex.ru", product: "Modern White", stage: "measurement", date: "20 марта 2026", source: "Сайт" },
  { id: 4, name: "Николаева Мария", phone: "+7 (903) 444-33-22", email: "nikolaeva@mail.ru", product: "Premium Dark", stage: "contract", date: "19 марта 2026", source: "Рекомендация" },
  { id: 5, name: "Орлов Сергей", phone: "+7 (915) 222-33-44", email: "orlov@gmail.com", product: "Elegant Grey", stage: "completed", date: "18 марта 2026", source: "Сайт" },
];

export function PartnerLeadsPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState("all");

  const filtered = mockLeads.filter((l) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.product.toLowerCase().includes(search.toLowerCase());
    const matchesStage = activeStage === "all" || l.stage === activeStage;
    return matchesSearch && matchesStage;
  });

  const getStage = (id: string) => stages.find((s) => s.id === id);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <PartnerHeader title="Мои заявки" onNavigate={onNavigate} />

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Всего заявок", value: "47", sub: "+3 за неделю" },
          { label: "В работе", value: "12", sub: "4 этапа" },
          { label: "Завершены", value: "31", sub: "за всё время" },
          { label: "Конверсия", value: "66%", sub: "заявка → договор" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени или товару..."
            className="w-full h-10 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveStage("all")}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeStage === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            Все
          </button>
          {stages.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeStage === s.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2">
        {filtered.map((lead) => {
          const stage = getStage(lead.stage);
          return (
            <div key={lead.id} className="rounded-2xl border border-border bg-card p-4 hover:shadow-sm transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{lead.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${stage?.color}`}>
                      {stage?.label}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground mb-2">Товар: {lead.product}</p>
                  <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>
                    <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{lead.date}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
        {filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Заявки не найдены</div>
        )}
      </div>
    </div>
  );
}
