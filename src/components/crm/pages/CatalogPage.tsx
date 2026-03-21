import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Search, Plus, LayoutGrid, List, MoreHorizontal, ArrowUpDown, Download, Upload, CheckSquare, Package } from "lucide-react";
import { ProductDetail } from "@/components/crm/ProductDetail";

interface Product {
  id: number;
  name: string;
  category: string;
  rrp: number;
  material: string;
  color: string;
  inStock: boolean;
}

const categories = ["Все", "Межкомнатные", "Входные", "Раздвижные", "Складные"];

const products: Product[] = [
  { id: 1, name: "Milano Premium", category: "Межкомнатные", rrp: 28500, material: "Экошпон", color: "Дуб натуральный", inStock: true },
  { id: 2, name: "Forte Shield", category: "Входные", rrp: 45200, material: "Сталь", color: "Венге", inStock: true },
  { id: 3, name: "Slide Pro", category: "Раздвижные", rrp: 34800, material: "МДФ", color: "Белый матовый", inStock: true },
  { id: 4, name: "Classic Oak", category: "Межкомнатные", rrp: 19900, material: "Массив", color: "Дуб античный", inStock: true },
  { id: 5, name: "Loft Steel", category: "Входные", rrp: 52100, material: "Сталь", color: "Чёрный", inStock: false },
  { id: 6, name: "Elegance White", category: "Межкомнатные", rrp: 22300, material: "Экошпон", color: "Белый ясень", inStock: true },
  { id: 7, name: "Compact Fold", category: "Складные", rrp: 31400, material: "МДФ", color: "Серый", inStock: true },
  { id: 8, name: "Guardian Max", category: "Входные", rrp: 67800, material: "Сталь", color: "Бронза", inStock: true },
  { id: 9, name: "Natura Soft", category: "Межкомнатные", rrp: 25600, material: "Массив", color: "Орех", inStock: false },
  { id: 10, name: "Slide Glass", category: "Раздвижные", rrp: 41200, material: "Стекло/Алюминий", color: "Прозрачный", inStock: true },
];

const PAGE_SIZE = 8;

export function CatalogPage() {
  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
  const [massMode, setMassMode] = useState(false);
  const [page, setPage] = useState(1);

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Все" || p.category === activeCategory;
    return matchSearch && matchCat;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Каталог" />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 opacity-0 animate-fade-up">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Поиск товара..."
              className="h-9 w-56 sm:w-64 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
            />
          </div>
          <div className="flex items-center gap-1 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => { setActiveCategory(cat); setPage(1); }}
                className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors active:scale-95 whitespace-nowrap ${
                  activeCategory === cat
                    ? "bg-foreground text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => { setMassMode(!massMode); setSelectedIds(new Set()); }}
            className={`flex h-9 w-9 items-center justify-center rounded-xl border transition-colors active:scale-95 ${
              massMode ? "border-foreground bg-foreground text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
            }`}
            title="Массовые действия"
          >
            <CheckSquare className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground active:scale-95 transition-colors" title="Импорт">
            <Upload className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground active:scale-95 transition-colors" title="Экспорт">
            <Download className="h-4 w-4" />
          </button>
          <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
            <button
              onClick={() => setView("table")}
              className={`flex h-9 w-9 items-center justify-center transition-colors active:scale-95 ${
                view === "table" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <List className="h-4 w-4" />
            </button>
            <button
              onClick={() => setView("grid")}
              className={`flex h-9 w-9 items-center justify-center transition-colors active:scale-95 ${
                view === "grid" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <LayoutGrid className="h-4 w-4" />
            </button>
          </div>
          <button className="flex h-9 items-center gap-2 rounded-xl bg-foreground px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-foreground/90 active:scale-95">
            <Plus className="h-3.5 w-3.5" />
            <span className="hidden sm:inline">Добавить</span>
          </button>
        </div>
      </div>

      {/* Mass actions bar */}
      {massMode && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 rounded-xl bg-foreground/5 border border-border px-4 py-2.5 opacity-0 animate-scale-in">
          <span className="text-xs font-medium text-foreground">Выбрано: {selectedIds.size}</span>
          <div className="h-4 w-px bg-border" />
          <button className="text-xs font-medium text-foreground hover:underline">Изменить цену</button>
          <button className="text-xs font-medium text-foreground hover:underline">Изменить наличие</button>
          <button className="text-xs font-medium text-foreground hover:underline hidden sm:block">Изменить категорию</button>
          <button className="text-xs font-medium text-destructive hover:underline ml-auto">Удалить</button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title="Товары не найдены"
          description="Нет товаров по заданным фильтрам"
          action={{ label: "Сбросить фильтры", onClick: () => { setSearch(""); setActiveCategory("Все"); } }}
        />
      ) : (
        <>
          {/* Table view */}
          {view === "table" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-border">
                      {massMode && (
                        <th className="px-3 py-3.5 w-10">
                          <input
                            type="checkbox"
                            checked={selectedIds.size === filtered.length && filtered.length > 0}
                            onChange={toggleAll}
                            className="h-4 w-4 rounded border-border accent-foreground"
                          />
                        </th>
                      )}
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                          Товар <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Категория</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Материал</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Цвет</th>
                      <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        <div className="flex items-center justify-end gap-1 cursor-pointer hover:text-foreground transition-colors">
                          РРЦ <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Наличие</th>
                      <th className="px-5 py-3.5 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((p) => (
                      <tr
                        key={p.id}
                        onClick={() => !massMode && setSelectedProduct(p)}
                        className="border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/40 hover:shadow-[inset_3px_0_0_hsl(var(--foreground))] cursor-pointer"
                      >
                        {massMode && (
                          <td className="px-3 py-3.5">
                            <input
                              type="checkbox"
                              checked={selectedIds.has(p.id)}
                              onChange={() => toggleSelect(p.id)}
                              onClick={(e) => e.stopPropagation()}
                              className="h-4 w-4 rounded border-border accent-foreground"
                            />
                          </td>
                        )}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-[10px] font-semibold text-muted-foreground">
                              IMG
                            </div>
                            <span className="text-sm font-medium text-foreground">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {p.category}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-foreground hidden lg:table-cell">{p.material}</td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground hidden xl:table-cell">{p.color}</td>
                        <td className="px-5 py-3.5 text-right text-sm font-semibold tabular-nums text-foreground">
                          {p.rrp.toLocaleString("ru-RU")} ₽
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.inStock ? "bg-success" : "bg-muted-foreground/30"}`} />
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={(e) => e.stopPropagation()}
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

          {/* Grid view */}
          {view === "grid" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
              {paginated.map((p, i) => (
                <div
                  key={p.id}
                  onClick={() => setSelectedProduct(p)}
                  className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-card-hover cursor-pointer opacity-0 animate-fade-up-stagger"
                  style={{ animationDelay: `${100 + i * 60}ms` }}
                >
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium relative">
                    Фото
                    {massMode && (
                      <div className="absolute top-2 left-2">
                        <input
                          type="checkbox"
                          checked={selectedIds.has(p.id)}
                          onChange={() => toggleSelect(p.id)}
                          onClick={(e) => e.stopPropagation()}
                          className="h-4 w-4 rounded border-border accent-foreground"
                        />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{p.category} · {p.material}</p>
                      </div>
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${p.inStock ? "bg-success" : "bg-muted-foreground/30"}`} />
                    </div>
                    <p className="mt-3 text-base font-semibold tabular-nums text-foreground">{p.rrp.toLocaleString("ru-RU")} ₽</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {/* Product detail modal */}
      {selectedProduct && (
        <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />
      )}
    </div>
  );
}
