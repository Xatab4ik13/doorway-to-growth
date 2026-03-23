import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Modal } from "@/components/crm/Modal";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { Search, Plus, LayoutGrid, List, MoreHorizontal, ArrowUpDown, Download, Upload, CheckSquare, Package, Trash2 } from "lucide-react";
import { ProductDetail } from "@/components/crm/ProductDetail";
import { toast } from "@/hooks/use-toast";
import { useProducts, useCategories, useCreateProduct, useDeleteProduct, useUpdateProduct, type Product } from "@/hooks/useProducts";

const PAGE_SIZE = 8;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");
}

export function CatalogPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const createProduct = useCreateProduct();
  const deleteProduct = useDeleteProduct();
  const updateProduct = useUpdateProduct();

  const [view, setView] = useState<"table" | "grid">("table");
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("Все");
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [massMode, setMassMode] = useState(false);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Product | null>(null);
  const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);

  // Form state
  const [formName, setFormName] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formRrp, setFormRrp] = useState("");
  const [formMaterial, setFormMaterial] = useState("");
  const [formColor, setFormColor] = useState("");

  const resetForm = () => {
    setFormName(""); setFormCategoryId(""); setFormRrp(""); setFormMaterial(""); setFormColor("");
  };

  const handleAdd = () => {
    if (!formName.trim() || !formRrp.trim()) return;
    createProduct.mutate({
      name: formName.trim(),
      slug: slugify(formName),
      category_id: formCategoryId || undefined,
      rrp: Number(formRrp),
      specifications: {
        ...(formMaterial ? { material: formMaterial } : {}),
        ...(formColor ? { color: formColor } : {}),
      },
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

  const filtered = products.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    const matchCat = activeCategory === "Все" || p.category?.name === activeCategory;
    return matchSearch && matchCat;
  });

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
    if (selectedIds.size === filtered.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filtered.map((p) => p.id)));
    }
  };

  const specs = (p: Product) => p.specifications as Record<string, string> | null;

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

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
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
            {categoryNames.map((cat) => (
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
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground active:scale-95 transition-colors" title="Импорт"
            onClick={() => toast({ title: "Импорт", description: "Загрузите Excel/CSV файл для импорта товаров" })}
          >
            <Upload className="h-4 w-4" />
          </button>
          <button className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground active:scale-95 transition-colors" title="Экспорт"
            onClick={() => toast({ title: "Экспорт", description: "Функция экспорта будет добавлена" })}
          >
            <Download className="h-4 w-4" />
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

      {/* Mass actions bar */}
      {massMode && selectedIds.size > 0 && (
        <div className="flex items-center gap-3 mb-4 rounded-xl bg-foreground/5 border border-border px-4 py-2.5">
          <span className="text-xs font-medium text-foreground">Выбрано: {selectedIds.size}</span>
          <div className="h-4 w-px bg-border" />
          <button
            onClick={() => {
              selectedIds.forEach((id) => {
                const p = products.find((pr) => pr.id === id);
                if (p) updateProduct.mutate({ id, is_active: !p.is_active });
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
          description={products.length === 0 ? "Добавьте первый товар или импортируйте каталог" : "Нет товаров по заданным фильтрам"}
          action={products.length === 0
            ? { label: "Добавить товар", onClick: () => setAddOpen(true) }
            : { label: "Сбросить фильтры", onClick: () => { setSearch(""); setActiveCategory("Все"); } }
          }
        />
      ) : (
        <>
          {view === "table" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[650px]">
                  <thead>
                    <tr className="border-b border-border">
                      {massMode && (
                        <th className="px-3 py-3.5 w-10">
                          <input type="checkbox" checked={selectedIds.size === filtered.length && filtered.length > 0} onChange={toggleAll} className="h-4 w-4 rounded border-border accent-foreground" />
                        </th>
                      )}
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Товар</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Категория</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Материал</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden xl:table-cell">Цвет</th>
                      <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">РРЦ</th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
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
                            <span className="text-sm font-medium text-foreground">{p.name}</span>
                          </div>
                        </td>
                        <td className="px-5 py-3.5">
                          <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                            {p.category?.name ?? "—"}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-foreground hidden lg:table-cell">{specs(p)?.material ?? "—"}</td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground hidden xl:table-cell">{specs(p)?.color ?? "—"}</td>
                        <td className="px-5 py-3.5 text-right text-sm font-semibold tabular-nums text-foreground">
                          {p.rrp ? `${p.rrp.toLocaleString("ru-RU")} ₽` : "—"}
                        </td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
                        </td>
                        <td className="px-5 py-3.5">
                          <button
                            onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive active:scale-95 transition-colors"
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

          {view === "grid" && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5">
              {paginated.map((p) => (
                <div key={p.id} onClick={() => setSelectedProduct(p)} className="group rounded-2xl border border-border bg-card overflow-hidden transition-all duration-200 hover:shadow-card-hover cursor-pointer">
                  <div className="aspect-[4/3] bg-muted flex items-center justify-center text-xs text-muted-foreground font-medium relative overflow-hidden">
                    {p.primary_image ? (
                      <img src={p.primary_image} alt={p.name} className="w-full h-full object-cover" />
                    ) : "Фото"}
                    {massMode && (
                      <div className="absolute top-2 left-2">
                        <input type="checkbox" checked={selectedIds.has(p.id)} onChange={() => toggleSelect(p.id)} onClick={(e) => e.stopPropagation()} className="h-4 w-4 rounded border-border accent-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.name}</p>
                        <p className="mt-0.5 text-[11px] text-muted-foreground">{p.category?.name ?? "—"} · {specs(p)?.material ?? "—"}</p>
                      </div>
                      <span className={`mt-1 h-2 w-2 shrink-0 rounded-full ${p.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
                    </div>
                    <p className="mt-3 text-base font-semibold tabular-nums text-foreground">
                      {p.rrp ? `${p.rrp.toLocaleString("ru-RU")} ₽` : "—"}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}

      {selectedProduct && <ProductDetail product={selectedProduct} onClose={() => setSelectedProduct(null)} />}

      <Modal
        open={addOpen}
        onClose={() => { setAddOpen(false); resetForm(); }}
        title="Новый товар"
        footer={
          <>
            <button onClick={() => { setAddOpen(false); resetForm(); }} className="h-9 px-4 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">Отмена</button>
            <button onClick={handleAdd} disabled={!formName.trim() || !formRrp.trim()} className="h-9 px-4 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40">Добавить</button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          <div className="col-span-2">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Название *</label>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="Название двери" className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Категория</label>
            <select value={formCategoryId} onChange={(e) => setFormCategoryId(e.target.value)} className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow">
              <option value="">Без категории</option>
              {categories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">РРЦ (₽) *</label>
            <input value={formRrp} onChange={(e) => setFormRrp(e.target.value.replace(/\D/g, ""))} placeholder="25000" className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow tabular-nums" />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Материал</label>
            <input value={formMaterial} onChange={(e) => setFormMaterial(e.target.value)} placeholder="Экошпон" className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Цвет</label>
            <input value={formColor} onChange={(e) => setFormColor(e.target.value)} placeholder="Дуб натуральный" className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && handleDelete(deleteTarget)} title="Удалить товар" description={`Удалить ${deleteTarget?.name}? Это действие нельзя отменить.`} confirmLabel="Удалить" destructive />
      <ConfirmDialog open={bulkDeleteOpen} onClose={() => setBulkDeleteOpen(false)} onConfirm={handleBulkDelete} title="Массовое удаление" description={`Удалить выбранные товары (${selectedIds.size} шт.)? Это действие нельзя отменить.`} confirmLabel="Удалить все" destructive />
    </div>
  );
}
