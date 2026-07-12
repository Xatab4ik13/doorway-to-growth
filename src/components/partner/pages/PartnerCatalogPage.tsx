import { useState, useMemo } from "react";
import { Search, Package, Image as ImageIcon, X, Info } from "lucide-react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { useProducts, useCategories, type Product } from "@/hooks/useProducts";
import { resolveStorageUrl } from "@/lib/storageUrl";

const PAGE_SIZE = 24;
const ALL = "__all__";

export function PartnerCatalogPage() {
  const { data: products = [], isLoading } = useProducts();
  const { data: categories = [] } = useCategories();
  const [search, setSearch] = useState("");
  const [cat, setCat] = useState<string>(ALL);
  const [page, setPage] = useState(1);
  const [preview, setPreview] = useState<Product | null>(null);

  const tiles = useMemo(() => {
    return categories.map((c) => {
      const items = products.filter((p) => p.category?.id === c.id);
      return {
        id: c.id, name: c.name, count: items.length,
        preview: items.find((p) => p.primary_image)?.primary_image ?? null,
      };
    });
  }, [categories, products]);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      if (!p.is_active) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (cat !== ALL && p.category?.id !== cat) return false;
      return true;
    });
  }, [products, search, cat]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const inputCls = "h-9 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20";
  const specs = (p: Product) => p.specifications as Record<string, any> | null;

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

      <div className="mb-4 flex items-start gap-2 rounded-xl border border-border bg-muted/40 px-3 py-2 text-xs text-muted-foreground">
        <Info className="h-3.5 w-3.5 mt-0.5 shrink-0" />
        <span>Центральный каталог доступен только для просмотра. Локальные цены и наличие настраиваются отдельно.</span>
      </div>

      {/* Категории */}
      <div className="mb-5 -mx-4 sm:-mx-8 px-4 sm:px-8">
        <div className="flex items-center gap-2.5 overflow-x-auto pb-2 [scrollbar-width:thin]">
          <Tile active={cat === ALL} onClick={() => { setCat(ALL); setPage(1); }}
                name="Все товары" count={products.filter((p) => p.is_active).length}
                preview={products.find((p) => p.primary_image)?.primary_image ?? null} />
          {tiles.map((c) => (
            <Tile key={c.id} active={cat === c.id} onClick={() => { setCat(c.id); setPage(1); }}
                  name={c.name} count={c.count} preview={c.preview} />
          ))}
        </div>
      </div>

      {/* Поиск */}
      <div className="mb-4">
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
                 placeholder="Поиск по названию…" className={`${inputCls} pl-9`} />
          {search && (
            <button onClick={() => setSearch("")}
                    className="absolute right-2 top-1/2 -translate-y-1/2 h-6 w-6 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted">
              <X className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState icon={Package} title="Товары не найдены"
                    description="Попробуйте изменить параметры поиска или выбрать другую коллекцию" />
      ) : (
        <>
          <div className="grid gap-3 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {paginated.map((p) => (
              <div key={p.id} onClick={() => setPreview(p)}
                   className="group relative rounded-2xl border border-border bg-card overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-card-hover hover:border-foreground/30">
                <div className="aspect-[4/5] bg-muted flex items-center justify-center relative overflow-hidden">
                  {p.primary_image ? (
                    <img src={resolveStorageUrl(p.primary_image)} alt={p.name} loading="lazy"
                         className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105" />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-muted-foreground">
                      <ImageIcon className="h-6 w-6" /><span className="text-[10px]">Нет фото</span>
                    </div>
                  )}
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
            ))}
          </div>
          <div className="mt-4">
            <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
          </div>
        </>
      )}

      {/* Read-only preview drawer */}
      {preview && <ReadOnlyPreview product={preview} onClose={() => setPreview(null)} />}
    </div>
  );
}

function Tile({ active, onClick, name, count, preview }: {
  active: boolean; onClick: () => void; name: string; count: number; preview: string | null;
}) {
  return (
    <button onClick={onClick}
            className={`group shrink-0 relative flex items-center gap-3 rounded-2xl border p-2 pr-4 transition-all active:scale-[0.98] ${
              active ? "border-foreground bg-foreground text-primary-foreground shadow-sm"
                     : "bg-card text-foreground hover:border-foreground/40 border-border"
            }`}
            style={{ minWidth: 180 }}>
      <div className={`h-12 w-12 shrink-0 rounded-xl overflow-hidden flex items-center justify-center ${active ? "bg-primary-foreground/10" : "bg-muted"}`}>
        {preview ? <img src={resolveStorageUrl(preview)} alt="" className="h-full w-full object-cover" loading="lazy" />
                 : <Package className={`h-5 w-5 ${active ? "text-primary-foreground/60" : "text-muted-foreground"}`} />}
      </div>
      <div className="min-w-0 text-left">
        <div className={`text-[11px] uppercase tracking-wider font-medium ${active ? "text-primary-foreground/70" : "text-muted-foreground"}`}>Коллекция</div>
        <div className="text-sm font-semibold truncate">{name}</div>
        <div className={`text-[11px] tabular-nums ${active ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{count} шт.</div>
      </div>
    </button>
  );
}

function ReadOnlyPreview({ product, onClose }: { product: Product; onClose: () => void }) {
  const s = (product.specifications ?? {}) as Record<string, any>;
  const flat = Object.entries(s).filter(([, v]) => v != null && v !== "" && typeof v !== "object");
  return (
    <div className="fixed inset-0 z-50 flex animate-fade-in">
      <div className="absolute inset-0 bg-foreground/40 backdrop-blur-sm" onClick={onClose} />
      <aside className="relative ml-auto h-full w-full max-w-[720px] bg-background shadow-2xl flex flex-col animate-slide-in-right">
        <div className="flex items-center justify-between gap-3 px-4 sm:px-6 py-3 border-b border-border bg-card">
          <div className="flex items-center gap-2 min-w-0 flex-1">
            <button onClick={onClose}
                    className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95">
              <X className="h-4 w-4" />
            </button>
            <div className="min-w-0">
              <div className="text-[10px] uppercase tracking-wider text-muted-foreground">{product.category?.name ?? "Без категории"}</div>
              <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
            </div>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-5 space-y-5">
          <div className="aspect-[4/5] rounded-2xl bg-muted overflow-hidden">
            {product.primary_image ? (
              <img src={resolveStorageUrl(product.primary_image)} alt={product.name} className="w-full h-full object-contain" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                <ImageIcon className="h-10 w-10" />
              </div>
            )}
          </div>
          <div className="rounded-2xl border border-border bg-card p-4">
            <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Цена</div>
            <div className="text-2xl font-bold tabular-nums text-foreground">
              {product.rrp && product.rrp > 0 ? `${product.rrp.toLocaleString("ru-RU")} ₽` : "по запросу"}
            </div>
            <div className="text-[11px] text-muted-foreground mt-1">Рекомендуемая розничная цена</div>
          </div>
          {product.description && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Описание</div>
              <p className="text-sm text-foreground whitespace-pre-wrap">{product.description}</p>
            </div>
          )}
          {flat.length > 0 && (
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-2">Характеристики</div>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                {flat.map(([k, v]) => (
                  <div key={k} className="flex items-baseline justify-between gap-3 border-b border-border/60 pb-1.5">
                    <dt className="text-muted-foreground text-xs">{k}</dt>
                    <dd className="text-foreground font-medium text-right truncate">{String(v)}</dd>
                  </div>
                ))}
              </dl>
            </div>
          )}
        </div>
      </aside>
    </div>
  );
}
