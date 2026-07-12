import { useState, useMemo, useCallback } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Modal } from "@/components/crm/Modal";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import {
  Search, Plus, CheckSquare, Package, Trash2, SlidersHorizontal, X,
  Copy, EyeOff, Eye, LayoutGrid, Rows3, Image as ImageIcon,
} from "lucide-react";
import { ProductDetail } from "@/components/crm/ProductDetail";
import {
  useProducts, useCategories, useCreateProduct, useDeleteProduct, useUpdateProduct,
  type Product,
} from "@/hooks/useProducts";
import { resolveStorageUrl } from "@/lib/storageUrl";

const PAGE_SIZE = 24;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");
}

const ALL_CATEGORY = "__all__";

export function CatalogPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const [density, setDensity] = useState<"comfy" | "compact">("comfy");
  const [search, setSearch] = useState("");
  const [activeCategoryKey, setActiveCategoryKey] = useState<string>(ALL_CATEGORY);
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

  const activeFiltersCount = [
    filterColor, filterGlazing, filterPriceMin, filterPriceMax,
    filterStatus !== "all" ? "x" : "",
  ].filter(Boolean).length;

  // Категории с превью + счётчиком
  const categoryTiles = useMemo(() => {
    return categories.map((c) => {
      const items = products.filter((p) => p.category?.id === c.id);
      const preview = items.find((p) => p.primary_image)?.primary_image ?? null;
      return { id: c.id, name: c.name, count: items.length, preview };
    });
  }, [categories, products]);

  const uncategorizedCount = useMemo(
    () => products.filter((p) => !p.category?.id).length,
    [products]
  );

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

  const handleBulkToggleActive = () => {
    selectedIds.forEach((id) => {
      const p = products.find((pr) => pr.id === id);
      if (p) updateProduct.mutate({ id, is_active: !p.is_active } as any);
    });
    setSelectedIds(new Set());
  };

  const handleBulkMoveCategory = (categoryId: string) => {
    selectedIds.forEach((id) => {
      updateProduct.mutate({ id, category_id: categoryId || null } as any);
    });
    setSelectedIds(new Set());
  };

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const s = p.specifications as Record<string, any> | null;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (activeCategoryKey === "__none__") {
        if (p.category?.id) return false;
      } else if (activeCategoryKey !== ALL_CATEGORY) {
        if (p.category?.id !== activeCategoryKey) return false;
      }
      if (filterColor && s?.color !== filterColor) return false;
      if (filterGlazing && s?.glazing !== filterGlazing) return false;
      if (filterPriceMin && (p.rrp == null || p.rrp < Number(filterPriceMin))) return false;
      if (filterPriceMax && (p.rrp == null || p.rrp > Number(filterPriceMax))) return false;
      if (filterStatus === "active" && !p.is_active) return false;
      if (filterStatus === "inactive" && p.is_active) return false;
      return true;
    });
  }, [products, search, activeCategoryKey, filterColor, filterGlazing, filterPriceMin, filterPriceMax, filterStatus]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectAllVisible = () => {
    if (paginated.every((p) => selectedIds.has(p.id))) {
      const next = new Set(selectedIds);
      paginated.forEach((p) => next.delete(p.id));
      setSelectedIds(next);
    } else {
      const next = new Set(selectedIds);
      paginated.forEach((p) => next.add(p.id));
      setSelectedIds(next);
    }
  };

  const specs = (p: Product) => p.specifications as Record<string, any> | null;

  const selectCls = "h-9 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow";
  const inputCls = "h-9 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow";

  const openProduct = useCallback((p: Product) => setSelectedProduct(p), []);
  const currentIndex = selectedProduct ? filtered.findIndex((p) => p.id === selectedProduct.id) : -1;
  const gotoOffset = (delta: number) => {
    if (currentIndex < 0) return;
    const next = filtered[currentIndex + delta];
    if (next) setSelectedProduct(next);
  };

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

  const gridCols = density === "comfy"
    ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5"
    : "grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 2xl:grid-cols-8";

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Каталог" />

      {/* Stats bar */}
      <div className="flex items-center gap-4 mb-4 text-xs text-muted-foreground">
        <span>Всего: <strong className="text-foreground tabular-nums">{products.length}</strong></span>
        <span>Активных: <strong className="text-foreground tabular-nums">{products.filter((p) => p.is_active).length}</strong></span>
        {filtered.length !== products.length && (
          <span>Найдено: <strong className="text-foreground tabular-nums">{filtered.length}</strong></span>
        )}
      </div>

      {/* ===== Категории — визуальная полоса плиток ===== */}
      <div className="mb-5 -mx-4 sm:-mx-8 px-4 sm:px-8">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 [scrollbar-width:thin]">
          {/* "Все" */}
          <CategoryTile
            active={activeCategoryKey === ALL_CATEGORY}
            onClick={() => { setActiveCategoryKey(ALL_CATEGORY); setPage(1); }}
            name="Все товары"
            count={products.length}
            preview={products.find((p) => p.primary_image)?.primary_image ?? null}
            emphasis
          />
          {categoryTiles.map((c) => (
            <CategoryTile
              key={c.id}
              active={activeCategoryKey === c.id}
              onClick={() => { setActiveCategoryKey(c.id); setPage(1); }}
              name={c.name}
              count={c.count}
              preview={c.preview}
            />
          ))}
          {uncategorizedCount > 0 && (
            <CategoryTile
              active={activeCategoryKey === "__none__"}
              onClick={() => { setActiveCategoryKey("__none__"); setPage(1); }}
              name="Без категории"
              count={uncategorizedCount}
              preview={null}
              dashed
            />
          )}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col gap-3 mb-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 flex-wrap flex-1 min-w-0">
            <div className="relative flex-1 min-w-[220px] max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                placeholder="Поиск по названию…"
                className={`${inputCls} pl-9`}
              />
              {search && (
                <button
                  onClick={() => { setSearch(""); setPage(1); }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              )}
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
                <span className="ml-1 flex h-4 min-w-4 px-1 items-center justify-center rounded-full bg-primary-foreground/20 text-[10px]">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => { setMassMode(!massMode); setSelectedIds(new Set()); }}
              className={`flex h-9 items-center gap-1.5 rounded-xl border px-3 text-xs font-medium transition-colors active:scale-95 ${
                massMode ? "border-foreground bg-foreground text-primary-foreground" : "border-border bg-card text-muted-foreground hover:text-foreground"
              }`}
              title="Массовые действия"
            >
              <CheckSquare className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">Выбор</span>
            </button>
            <div className="hidden sm:flex items-center rounded-xl border border-border bg-card overflow-hidden">
              <button
                onClick={() => setDensity("comfy")}
                className={`flex h-9 w-9 items-center justify-center transition-colors active:scale-95 ${density === "comfy" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                title="Крупная сетка"
              >
                <LayoutGrid className="h-4 w-4" />
              </button>
              <button
                onClick={() => setDensity("compact")}
                className={`flex h-9 w-9 items-center justify-center transition-colors active:scale-95 ${density === "compact" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}
                title="Плотная сетка"
              >
                <Rows3 className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => setAddOpen(true)}
              className="flex h-9 items-center gap-1.5 rounded-xl bg-foreground px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-foreground/90 active:scale-95"
            >
              <Plus className="h-3.5 w-3.5" />
              <span>Товар</span>
            </button>
          </div>
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
                  <option value="inactive">Скрытые</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Массовые действия — sticky-панель */}
      {massMode && (
        <div className="sticky top-2 z-30 mb-4 rounded-2xl border border-foreground/20 bg-foreground text-primary-foreground shadow-lg px-4 py-2.5 flex items-center gap-3 flex-wrap animate-fade-in">
          <span className="text-xs font-medium">
            Выбрано: <span className="tabular-nums">{selectedIds.size}</span>
          </span>
          <button
            onClick={selectAllVisible}
            className="text-xs font-medium underline underline-offset-2 opacity-90 hover:opacity-100"
          >
            {paginated.every((p) => selectedIds.has(p.id)) && paginated.length > 0 ? "Снять на странице" : "Выбрать на странице"}
          </button>
          <div className="h-4 w-px bg-primary-foreground/20" />
          <button
            onClick={handleBulkToggleActive}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-1.5 text-xs font-medium opacity-90 hover:opacity-100 disabled:opacity-40"
          >
            <Eye className="h-3.5 w-3.5" /> Активность
          </button>
          <select
            onChange={(e) => e.target.value && handleBulkMoveCategory(e.target.value)}
            disabled={selectedIds.size === 0}
            defaultValue=""
            className="h-7 rounded-lg border border-primary-foreground/30 bg-transparent px-2 text-xs disabled:opacity-40"
          >
            <option value="" className="text-foreground">В категорию…</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id} className="text-foreground">{c.name}</option>
            ))}
          </select>
          <button
            onClick={() => setBulkDeleteOpen(true)}
            disabled={selectedIds.size === 0}
            className="flex items-center gap-1.5 text-xs font-medium ml-auto text-destructive-foreground/90 hover:text-destructive-foreground disabled:opacity-40"
          >
            <Trash2 className="h-3.5 w-3.5" /> Удалить
          </button>
          <button
            onClick={() => { setMassMode(false); setSelectedIds(new Set()); }}
            className="flex h-7 w-7 items-center justify-center rounded-lg hover:bg-primary-foreground/10"
            title="Выйти из режима"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      )}

      {filtered.length === 0 ? (
        <EmptyState
          icon={Package}
          title={products.length === 0 ? "Каталог пуст" : "Товары не найдены"}
          description={products.length === 0 ? "Добавьте первый товар" : "Попробуйте изменить параметры поиска или фильтры"}
          action={products.length === 0
            ? { label: "Добавить товар", onClick: () => setAddOpen(true) }
            : { label: "Сбросить фильтры", onClick: () => { setSearch(""); setActiveCategoryKey(ALL_CATEGORY); clearFilters(); } }
          }
        />
      ) : (
        <>
          <div className={`grid gap-3 ${gridCols}`}>
            {paginated.map((p) => {
              const isSelected = selectedIds.has(p.id);
              return (
                <div
                  key={p.id}
                  onClick={() => massMode ? toggleSelect(p.id) : openProduct(p)}
                  className={`group relative rounded-2xl border bg-card overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-card-hover ${
                    isSelected ? "border-foreground ring-2 ring-foreground/20" : "border-border hover:border-foreground/30"
                  }`}
                >
                  <div className="aspect-[4/5] bg-muted flex items-center justify-center relative overflow-hidden">
                    {p.primary_image ? (
                      <img
                        src={resolveStorageUrl(p.primary_image)}
                        alt={p.name}
                        className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex flex-col items-center gap-1 text-muted-foreground">
                        <ImageIcon className="h-6 w-6" />
                        <span className="text-[10px]">Нет фото</span>
                      </div>
                    )}

                    {/* Чекбокс */}
                    {(massMode || isSelected) && (
                      <div className="absolute top-2 left-2">
                        <span className={`flex h-6 w-6 items-center justify-center rounded-md border-2 shadow-sm transition-colors ${
                          isSelected ? "bg-foreground border-foreground text-primary-foreground" : "bg-background/90 border-border"
                        }`}>
                          {isSelected && <CheckSquare className="h-3.5 w-3.5" />}
                        </span>
                      </div>
                    )}

                    {/* Статус */}
                    <div className="absolute top-2 right-2 flex items-center gap-1">
                      {!p.is_active && (
                        <span className="inline-flex items-center gap-1 rounded-full bg-background/95 backdrop-blur px-2 py-0.5 text-[10px] font-medium text-muted-foreground border border-border">
                          <EyeOff className="h-2.5 w-2.5" /> Скрыт
                        </span>
                      )}
                    </div>

                    {/* Категория — низ фото */}
                    {p.category?.name && (
                      <span className="absolute bottom-2 left-2 inline-block rounded-full bg-background/95 backdrop-blur px-2 py-0.5 text-[10px] font-medium text-foreground border border-border">
                        {p.category.name}
                      </span>
                    )}
                  </div>
                  <div className="p-3">
                    <p className="text-xs font-semibold text-foreground line-clamp-2 leading-snug min-h-[2.2em]">{p.name}</p>
                    <div className="mt-1.5 flex items-baseline justify-between gap-2">
                      <p className="text-sm font-bold tabular-nums text-foreground">
                        {p.rrp && p.rrp > 0 ? `${p.rrp.toLocaleString("ru-RU")} ₽` : <span className="text-muted-foreground font-medium">по запросу</span>}
                      </p>
                      {specs(p)?.color && (
                        <span className="text-[10px] text-muted-foreground truncate max-w-[50%]">{specs(p)!.color}</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
          </div>
        </>
      )}

      {selectedProduct && (
        <ProductDetail
          product={selectedProduct}
          onClose={() => setSelectedProduct(null)}
          onDelete={() => setDeleteTarget(selectedProduct)}
          onPrev={currentIndex > 0 ? () => gotoOffset(-1) : undefined}
          onNext={currentIndex >= 0 && currentIndex < filtered.length - 1 ? () => gotoOffset(1) : undefined}
          position={currentIndex + 1}
          total={filtered.length}
        />
      )}

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

// ============ Плитка категории ============
function CategoryTile({
  active, onClick, name, count, preview, emphasis, dashed,
}: {
  active: boolean;
  onClick: () => void;
  name: string;
  count: number;
  preview: string | null;
  emphasis?: boolean;
  dashed?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`group shrink-0 relative flex items-center gap-3 rounded-2xl border p-2 pr-4 transition-all active:scale-[0.98] ${
        active
          ? "border-foreground bg-foreground text-primary-foreground shadow-sm"
          : `bg-card text-foreground hover:border-foreground/40 ${dashed ? "border-dashed border-border" : "border-border"}`
      }`}
      style={{ minWidth: emphasis ? 200 : 180 }}
    >
      <div className={`h-12 w-12 shrink-0 rounded-xl overflow-hidden flex items-center justify-center ${
        active ? "bg-primary-foreground/10" : "bg-muted"
      }`}>
        {preview ? (
          <img src={resolveStorageUrl(preview)} alt="" className="h-full w-full object-cover" loading="lazy" />
        ) : (
          <Package className={`h-5 w-5 ${active ? "text-primary-foreground/60" : "text-muted-foreground"}`} />
        )}
      </div>
      <div className="min-w-0 text-left">
        <div className={`text-[11px] uppercase tracking-wider font-medium ${
          active ? "text-primary-foreground/70" : "text-muted-foreground"
        }`}>
          Коллекция
        </div>
        <div className="text-sm font-semibold truncate">{name}</div>
        <div className={`text-[11px] tabular-nums ${
          active ? "text-primary-foreground/80" : "text-muted-foreground"
        }`}>
          {count} шт.
        </div>
      </div>
    </button>
  );
}
