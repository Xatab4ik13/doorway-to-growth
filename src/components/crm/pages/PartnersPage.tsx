import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Search, Plus, MapPin, MoreHorizontal, ArrowUpDown, Star, Users } from "lucide-react";
import { PartnerProfile } from "@/components/crm/PartnerProfile";

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
  rating: number;
}

const partners: Partner[] = [
  { id: 1, name: "Brandoors Марьино", city: "Москва", zone: "ЮВАО", address: "ул. Люблинская, 169", leads: 24, conversion: 14.2, active: true, contact: "Иван Смирнов", rating: 4.7 },
  { id: 2, name: "Brandoors Тёплый Стан", city: "Москва", zone: "ЮЗАО", address: "ул. Профсоюзная, 129А", leads: 18, conversion: 11.8, active: true, contact: "Мария Козлова", rating: 4.3 },
  { id: 3, name: "Brandoors Митино", city: "Москва", zone: "СЗАО", address: "Пятницкое ш., 18", leads: 31, conversion: 16.5, active: true, contact: "Алексей Волков", rating: 4.9 },
  { id: 4, name: "Brandoors Люблино", city: "Москва", zone: "ЮВАО", address: "ул. Совхозная, 10", leads: 12, conversion: 9.3, active: true, contact: "Ольга Новикова", rating: 3.8 },
  { id: 5, name: "Brandoors Сокольники", city: "Москва", zone: "ВАО", address: "ул. Стромынка, 21", leads: 9, conversion: 7.1, active: false, contact: "Дмитрий Фёдоров", rating: 3.2 },
];

const PAGE_SIZE = 10;

export function PartnersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedPartner, setSelectedPartner] = useState<number | null>(null);
  const [page, setPage] = useState(1);

  const filtered = partners.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.zone.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? p.active : !p.active);
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (selectedPartner !== null) {
    return <PartnerProfile onBack={() => setSelectedPartner(null)} />;
  }

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Партнёры" />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 opacity-0 animate-fade-up">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Поиск партнёра..."
              className="h-9 w-56 sm:w-64 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
            />
          </div>
          <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`h-9 px-3.5 text-xs font-medium transition-colors active:scale-95 ${
                  filter === f ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Все" : f === "active" ? "Активные" : "Неактивные"}
              </button>
            ))}
          </div>
        </div>
        <button className="flex h-9 items-center gap-2 rounded-xl bg-foreground px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-foreground/90 active:scale-95 shrink-0">
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Добавить</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title="Партнёры не найдены"
          description="Нет партнёров по заданным фильтрам"
          action={{ label: "Сбросить", onClick: () => { setSearch(""); setFilter("all"); } }}
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                      Партнёр <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Зона</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Контакт</th>
                  <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                    <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground transition-colors">
                      Заявки <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Конверсия</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">
                    <div className="flex items-center justify-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                      Рейтинг <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
                  <th className="px-5 py-3.5 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPartner(p.id)}
                    className="border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/40 hover:shadow-[inset_3px_0_0_hsl(var(--foreground))] cursor-pointer"
                  >
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
                    <td className="px-5 py-3.5 text-sm text-foreground hidden lg:table-cell">{p.contact}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold tabular-nums text-foreground">{p.leads}</td>
                    <td className="px-5 py-3.5 text-right text-sm tabular-nums text-foreground hidden sm:table-cell">{p.conversion}%</td>
                    <td className="px-5 py-3.5 text-center hidden md:table-cell">
                      <div className="inline-flex items-center gap-1">
                        <Star className="h-3 w-3 text-foreground fill-foreground" />
                        <span className="text-sm font-medium tabular-nums text-foreground">{p.rating}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.active ? "bg-success" : "bg-muted-foreground/30"}`} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={(e) => { e.stopPropagation(); }}
                        className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
                      >
                        <MoreHorizontal className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
        </div>
      )}
    </div>
  );
}
