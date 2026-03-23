import { useState, useMemo } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Modal } from "@/components/crm/Modal";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { Search, Plus, LayoutGrid, List, MoreHorizontal, Download, Upload, CheckSquare, Package, Trash2, SlidersHorizontal, X } from "lucide-react";
import { ProductDetail } from "@/components/crm/ProductDetail";
import { toast } from "@/hooks/use-toast";
import { useProducts, useCategories, useCreateProduct, useDeleteProduct, useUpdateProduct, type Product } from "@/hooks/useProducts";

const PAGE_SIZE = 12;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");
}

export function CatalogPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const [view, setView] = useState<"table" | "grid">("grid");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [massMode, setMassMode] = useState(false);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
  const [filtersOpen, setFiltersOpen] = useState(false);

  // Filters
  const [filterColor, setFilterColor] = useState("");
  const [filterGlazing, setFilterGlazing] = useState("");
  const [filterPriceMin, setFilterPriceMin] = useState("");
  const [filterPriceMax, setFilterPriceMax] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "active" | "inactive">("all");

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formRrp, setFormRrp] = useState("");
  const [formColor, setFormColor] = useState("");
  const [formGlazing, setFormGlazing] = useState("");
  const [formDesc, setFormDesc] = useState("");

  // Extract unique filter values from products
  const { uniqueColors, uniqueGlazings } = useMemo(() => {
    const colors = new Set<string>();
    const glazings = new Set<string>();
    products.forEach((p) => {
      const s = p.specifications as Record<string, any> | null;
      if (s?.color) colors.add(s.color);
      if (s?.glazing) glazings.add(s.glazing);
    });
    return {
      uniqueColors: Array.from(colors).sort(),
      uniqueGlazings: Array.from(glazings).sort(),
    };
  }, [products]);

  const activeFiltersCount = [filterColor, filterGlazing, filterPriceMin, filterPriceMax, filterStatus !== "all" ? "x" : ""].filter(Boolean).length;

  const resetForm = () => {
    setFormName(""); setFormCategoryId(""); setFormRrp(""); setFormColor(""); setFormGlazing(""); setFormDesc("");
  };

  const clearFilters = () => {
    setFilterColor(""); setFilterGlazing(""); setFilterPriceMin(""); setFilterPriceMax(""); setFilterStatus("all");
  };

  const handleAdd = () => {
    if (!formName.trim()) return;
    const specs: Record<string, string> = {};
    if (formColor) specs.color = formColor;
    if (formGlazing) specs.glazing = formGlazing;
    createProduct.mutate({
      name: formName.trim(),
      slug: slugify(formName),
      category_id: formCategoryId || undefined,
      rrp: formRrp ? Number(formRrp) : undefined,
      specifications: specs,
      description: formDesc.trim() || undefined,
    });
    setAddOpen(false);
    resetForm();
  };

  const handleDelete = (product: Product) => {
    deleteProduct.mutate(product.id);
    setDeleteTarget(null);
  };

  const handleBulkDelete = () => {
    selectedIds.forEach((id) => deleteProduct.mutate(id));
    setSelectedIds(new Set());
    setMassMode(false);
    setBulkDeleteOpen(false);
  };

  const categoryNames = ["Все", ...categories.map((c) => c.name)];

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const s = p.specifications as Record<string, any> | null;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeCategory !== "Все" && p.category?.name !== activeCategory) return false;
      if (filterColor && s?.color !== filterColor) return false;
      if (filterGlazing && s?.glazing !== filterGlazing) return false;
      if (filterPriceMin && (p.rrp == null || p.rrp < Number(filterPriceMin))) return false;
      if (filterPriceMax && (p.rrp == null || p.rrp > Number(filterPriceMax))) return false;
      if (filterStatus === "active" && !p.is_active) return false;
      if (filterStatus === "inactive" && p.is_active) return false;
      return true;
    });
  }, [products, search, activeCategory, filterColor, filterGlazing, filterPriceMin, filterPriceMax, filterStatus]);

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((p) => p.id)));
  };

  const specs = (p: Product) => p.specifications as Record<string, any> | null;

  const selectCls = "h-9 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow";
  const inputCls = "h-9 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow";

  if (isLoading) {
    return (
      <div className="px-4 sm:px-8 py-6">
        <CrmHeader title="Каталог" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Каталог" />

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-5 text-xs text-muted-foreground">
        <span>Всего: <strong className="text-foreground">{products.length}</strong></span>
        <span>Активных: <strong className="text-foreground">{products.filter((p) => p.is_active).length}</strong></span>
        {filtered.length !== products.length && (
          <span>Найдено: <strong className="text-foreground">{filtered.length}</strong></span>
        )}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-5">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Поиск товара..."
                className={`${inputCls} pl-9`}
              />
            </div>
            <button
              onClick={() => setFiltersOpen(!filtersOpen)}
              className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-colors active:scale-95 ${
                filtersOpen || activeFiltersCount > 0
                  ? "border-foreground bg-foreground text-primary-foreground"
                  : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
            >
              <SlidersHorizontal className="h-3.5 w-3.5" />
              Фильтры
              {activeFiltersCount > 0 && (
                <span className="ml-1 flex h-4 w-4 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px]">{activeFiltersCount}</span>
              )}
            </button>
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
            <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
              <button onClick={() => setView("table")} className={`flex h-9 w-9 items-center justify-center transition-colors active:scale-95 ${view === "table" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <List className="h-4 w-4" />
              </button>
              <button onClick={() => setView("grid")} className={`flex h-9 w-9 items-center justify-center transition-colors active:scale-95 ${view === "grid" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                <LayoutGrid className="h-4 w-4" />
              </button>
            </div>
            <button onClick={() => setAddOpen(true)} className="flex h-9 items-center gap-2 rounded-xl bg-foreground px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-foreground/90 active:scale-95">
              <Plus className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Добавить</span>
            </button>
          </div>
        </div>

        {/* Category chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
          {categoryNames.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setPage(1); }}
              className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors active:scale-95 whitespace-nowrap shrink-0 ${
                activeCategory === cat
                  ? "bg-foreground text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Filters panel */}
        {filtersOpen && (
          <div className="rounded-2xl border border-border bg-card p-4 animate-fade-up">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-xs font-semibold text-foreground">Фильтры</h4>
              {activeFiltersCount > 0 && (
                <button onClick={clearFilters} className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                  Сбросить все
                </button>
              )}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Цвет</label>
                <select value={filterColor} onChange={(e) => { setFilterColor(e.target.value); setPage(1); }} className={selectCls}>
                  <option value="">Все цвета</option>
                  {uniqueColors.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Остекление</label>
                <select value={filterGlazing} onChange={(e) => { setFilterGlazing(e.target.value); setPage(1); }} className={selectCls}>
                  <option value="">Все</option>
                  {uniqueGlazings.map((g) => <option key={g} value={g}>{g}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Цена от (₽)</label>
                <input value={filterPriceMin} onChange={(e) => { setFilterPriceMin(e.target.value.replace(/\D/g, "")); setPage(1); }} placeholder="0" className={`${inputCls} tabular-nums`} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Цена до (₽)</label>
                <input value={filterPriceMax} onChange={(e) => { setFilterPriceMax(e.target.value.replace(/\D/g, "")); setPage(1); }} placeholder="999 999" className={`${inputCls} tabular-nums`} />
              </div>
              <div>
                <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Статус</label>
                <select value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value as any); setPage(1); }} className={selectCls}>
                  <option value="all">Все</option>
                  <option value="active">Активные</option>
                  <option value="inactive">Неактивные</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Mass actions bar */}
      {massMode && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 rounded-xl bg-foreground/5 border border-border px-4 py-2.5">
          <span className="text-xs font-medium text-foreground">Выбрано: {selectedIds.size}</span>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={() => {
              selectedIds.forEach((id) => {
                const p = products.find((pr) => pr.id === id);
                if (p) updateProduct.mutate({ id, is_active: !p.is_active } as any);
              });
              setSelectedIds(new Set());
            }}
            className="text-xs font-medium text-foreground hover:underline"
          >
            Переключить активность
          </button>
          <button onClick={() => setBulkDeleteOpen(true)} className="text-xs font-medium text-destructive hover:underline ml-auto">
            Удалить
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={products.length === 0 ? "Каталог пуст" : "Товары не найдены"}
          description={products.length === 0 ? "Добавьте первый товар или импортируйте каталог" : "Попробуйте изменить параметры поиска или фильтры"}
          action={products.length === 0
            ? { label: "Добавить товар", onClick: () => setAddOpen(true) }
            : { label: "Сбросить фильтры", onClick: () => { setSearch(""); setActiveCategory("Все"); clearFilters(); } }
          }
        />
      ) : (
        <>
          {view === "table" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border">
                      {massMode && (
                        <th className="px-3 py-3.5 w-10">
                          <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-border accent-foreground" />
                        </th>
                      )}
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Товар</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Категория</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">Цвет</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Остекление</th>
                      <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">РРЦ</th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground w-16">Статус</th>
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
                            <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} onClick={(e) => e.stopPropagation()} className="h-4 w-4 rounded border-border accent-foreground" />
                          </td>
                        )}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            {p.primary_image ? (
                              <img src={p.primary_image} alt={p.name} className="h-10 w-10 rounded-xl object-cover shrink-0" />
                            ) : (
                              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted text-[10px] font-semibold text-muted-foreground">IMG</div>
                            )}
                            <span className="text-sm font-medium text-foreground line-clamp-1">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {p.category?.name ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-foreground hidden md:table-cell">{specs(p)?.color ?? "—"}</td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground hidden lg:table-cell">{specs(p)?.glazing ?? "—"}</td>
                        <td className="px-5 py-3.5 text-right text-sm font-semibold tabular-nums text-foreground">
                          {p.rrp && p.rrp > 0 ? `${p.rrp.toLocaleString("ru-RU")} ₽` : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive active:scale-95 transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
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

          {view === "grid" && (
            <>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
                {paginated.map((p) => (
                  <div key={p.id} onClick={() => !massMode ? setSelectedProduct(p) : toggleSelect(p.id)} className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-card-hover cursor-pointer">
                    <div className="aspect-[4/3] bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium relative overflow-hidden">
                      {p.primary_image ? (
                        <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover" loading="lazy" />
                      ) : "Фото"}
                      {massMode && (
                        <div className="absolute top-2 left-2">
                          <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} onClick={(e) => e.stopPropagation()} className="h-4 w-4 rounded border-border accent-foreground" />
                        </div>
                      )}
                      <span className={`absolute top-2 right-2 h-2.5 w-2.5 rounded-full ${p.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
                    </div>
                    <div className="p-3">
                      <p className="text-xs font-medium text-foreground line-clamp-2 leading-tight">{p.name}</p>
                      <p className="mt-1 text-[10px] text-muted-foreground line-clamp-1">
                        {p.category?.name}{specs(p)?.color ? ` · ${specs(p)!.color}` : ""}
                      </p>
                      <p className="mt-2 text-sm font-semibold tabular-nums text-foreground">
                        {p.rrp && p.rrp > 0 ? `${p.rrp.toLocaleString("ru-RU")} ₽` : "По запросу"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4">
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
              </div>
            </>
          )}
        </>
      )}

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      {/* Add product modal */}
      <Modal
        open={addOpen}
        onClose={() => { setAddOpen(false); resetForm(); }}
        title="Новый товар"
        footer={
          <>
            <button onClick={() => { setAddOpen(false); resetForm(); }} className="h-9 px-4 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">Отмена</button>
            <button onClick={handleAdd} disabled={!formName.trim()} className="h-9 px-4 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40">Добавить</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Название *</label>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="PRIME 22 Манхэттен" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Категория</label>
            <select value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)} className={selectCls}>
              <option value="">Без категории</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">РРЦ (₽)</label>
            <input value={formRrp} onChange={(e) => setFormRrp(e.target.value.replace(/\D/g, ""))} placeholder="9380" className={`${inputCls} tabular-nums`} />
          </div>
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Цвет</label>
            <input value={formColor} onChange={(e) => setFormColor(e.target.value)} placeholder="Манхэттен" className={inputCls} />
          </div>
          <div>
            <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Остекление</label>
            <input value={formGlazing} onChange={(e) => setFormGlazing(e.target.value)} placeholder="Черный лакобель" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className="block text-[10px] font-medium uppercase tracking-wider text-muted-foreground mb-1">Описание</label>
            <textarea value={formDesc} onChange={(e) => setFormDesc(e.target.value)} rows={3} placeholder="Описание товара..." className={`${inputCls} h-auto py-2 resize-none`} />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && handleDelete(deleteTarget)} title="Удалить товар" description={`Удалить ${deleteTarget?.name}? Это действие нельзя отменить.`} confirmLabel="Удалить" destructive />
      <ConfirmDialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} onConfirm={handleBulkDelete} title="Массовое удаление" description={`Удалить выбранные товары (${selectedIds.size} шт.)? Это действие нельзя отменить.`} confirmLabel="Удалить все" destructive />
    </div>
  );
}
