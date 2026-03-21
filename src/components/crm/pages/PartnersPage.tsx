import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Search, Plus, MapPin, MoreHorizontal, ArrowUpDown } from "lucide-react";

interface Partner {
  id: number;
  name: string;
  city: string;
  zone: string;
  address: string;
  leads: number;
  conversion: number;
  active: boolean;
  contact: string;
}

const partners: Partner[] = [
  { id: 1, name: "Brandoors Марьино", city: "Москва", zone: "ЮВАО", address: "ул. Люблинская, 169", leads: 24, conversion: 14.2, active: true, contact: "Иван Смирнов" },
  { id: 2, name: "Brandoors Тёплый Стан", city: "Москва", zone: "ЮЗАО", address: "ул. Профсоюзная, 129А", leads: 18, conversion: 11.8, active: true, contact: "Мария Козлова" },
  { id: 3, name: "Brandoors Митино", city: "Москва", zone: "СЗАО", address: "Пятницкое ш., 18", leads: 31, conversion: 16.5, active: true, contact: "Алексей Волков" },
  { id: 4, name: "Brandoors Люблино", city: "Москва", zone: "ЮВАО", address: "ул. Совхозная, 10", leads: 12, conversion: 9.3, active: true, contact: "Ольга Новикова" },
  { id: 5, name: "Brandoors Сокольники", city: "Москва", zone: "ВАО", address: "ул. Стромынка, 21", leads: 9, conversion: 7.1, active: false, contact: "Дмитрий Фёдоров" },
];

export function PartnersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const filtered = partners.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.zone.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? p.active : !p.active);
    return matchSearch && matchFilter;
  });

  return (
    <div className="px-8 py-6">
      <CrmHeader title="Партнёры" />

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 opacity-0 animate-fade-up">
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Поиск партнёра..."
              className="h-9 w-64 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
            />
          </div>
          <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`h-9 px-3.5 text-xs font-medium transition-colors active:scale-95 ${
                  filter === f ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Все" : f === "active" ? "Активные" : "Неактивные"}
              </button>
            ))}
          </div>
        </div>
        <button className="flex h-9 items-center gap-2 rounded-xl bg-foreground px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-foreground/90 active:scale-95">
          <Plus className="h-3.5 w-3.5" />
          Добавить
        </button>
      </div>

      {/* Table */}
      <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border">
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                  Партнёр <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Зона</th>
              <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Контакт</th>
              <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground transition-colors">
                  Заявки <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Конверсия</th>
              <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
              <th className="px-5 py-3.5 w-10"></th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-border last:border-0 transition-colors hover:bg-muted/40">
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                      <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-foreground">{p.name}</p>
                      <p className="text-[11px] text-muted-foreground">{p.address}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-3.5">
                  <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {p.zone}
                  </span>
                </td>
                <td className="px-5 py-3.5 text-sm text-foreground">{p.contact}</td>
                <td className="px-5 py-3.5 text-right text-sm font-semibold tabular-nums text-foreground">{p.leads}</td>
                <td className="px-5 py-3.5 text-right text-sm tabular-nums text-foreground">{p.conversion}%</td>
                <td className="px-5 py-3.5 text-center">
                  <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.active ? "bg-success" : "bg-muted-foreground/30"}`} />
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
