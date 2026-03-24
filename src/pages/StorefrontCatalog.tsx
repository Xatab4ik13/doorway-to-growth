import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts, useStorefrontCategories } from "@/hooks/useStorefrontData";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion } from "framer-motion";
import { ChevronRight, ChevronDown, ChevronUp, ArrowRight } from "lucide-react";

const ITEMS_PER_PAGE = 16;

export default function StorefrontCatalog() {
  const { slug } = useParams<{ slug: string }>();
  const { data: site, isLoading } = useSiteBySlug(slug);
  const { data: products = [] } = useStorefrontProducts(site?.id);
  const { data: categories = [] } = useStorefrontCategories();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [priceOpen, setPriceOpen] = useState(true);
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);
  const [activeTab, setActiveTab] = useState<"all" | "popular" | "new" | "sale">("all");

  // Category tree
  const parentCategories = useMemo(
    () => (categories as any[]).filter((c) => !c.parent_id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [categories]
  );
  const getChildren = (parentId: string) =>
    (categories as any[]).filter((c) => c.parent_id === parentId).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  const toggleParent = (id: string) => {
    setExpandedParents((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const selectCategory = (id: string | null) => {
    setSelectedCategory(id);
    setPage(1);
  };

  // Get all descendant IDs for a parent
  const getDescendantIds = (parentId: string): string[] => {
    const children = getChildren(parentId);
    return children.map((c) => c.id);
  };

  // Filter
  const filtered = useMemo(() => {
    let result = [...(products as any[])];

    if (selectedCategory) {
      const children = getChildren(selectedCategory);
      if (children.length > 0) {
        const ids = [selectedCategory, ...children.map((c) => c.id)];
        result = result.filter((p) => ids.includes(p.category_id));
      } else {
        result = result.filter((p) => p.category_id === selectedCategory);
      }
    }

    const pf = Number(priceFrom);
    const pt = Number(priceTo);
    if (pf > 0) result = result.filter((p) => !p.rrp || p.rrp >= pf);
    if (pt > 0) result = result.filter((p) => !p.rrp || p.rrp <= pt);

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.rrp || 0) - (b.rrp || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.rrp || 0) - (a.rrp || 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      default:
        result.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    return result;
  }, [products, categories, selectedCategory, priceFrom, priceTo, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getPrimaryImage = (p: any) => {
    const primary = p.product_images?.find((i: any) => i.is_primary);
    return primary?.url || p.product_images?.[0]?.url;
  };

  // Find category name for product
  const getCategoryName = (categoryId: string) => {
    const cat = (categories as any[]).find((c) => c.id === categoryId);
    return cat?.name || "";
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-storefront-gold/20 border-t-storefront-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center text-storefront-text">
        <h1 className="text-2xl">Сайт не найден</h1>
      </div>
    );
  }

  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-14 md:pt-0 bg-[#07090d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-xs">
            <Link to={`/store/${slug}`} className="uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors">
              Главная
            </Link>
            <span className="text-storefront-muted/40">/</span>
            <span className="uppercase tracking-[0.15em] text-storefront-text">Каталог</span>
          </div>

          {/* Title row */}
          <div className="flex items-end justify-between mb-8">
            <h1 className="text-3xl sm:text-4xl font-bold text-storefront-text uppercase tracking-wide">
              Каталог
            </h1>
            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
              className="appearance-none bg-[#0f1218] border border-white/10 text-storefront-text text-xs px-4 py-2.5 pr-8 cursor-pointer hover:border-storefront-gold/40 transition-colors focus:outline-none focus:border-storefront-gold/60"
            >
              <option value="default">По умолчанию</option>
              <option value="price-asc">Цена ↑</option>
              <option value="price-desc">Цена ↓</option>
              <option value="name">По названию</option>
            </select>
          </div>

          <div className="flex gap-8">
            {/* ===== LEFT SIDEBAR ===== */}
            <aside className="hidden md:block w-[260px] shrink-0">
              {/* Categories tree */}
              <div className="mb-8">
                <h3 className="text-sm font-bold uppercase tracking-[0.12em] text-storefront-text mb-4">Категории</h3>

                {/* "Все товары" */}
                <button
                  onClick={() => selectCategory(null)}
                  className={`w-full text-left text-[15px] font-semibold py-2.5 px-4 mb-0.5 transition-colors ${
                    !selectedCategory
                      ? "text-[#07090d]"
                      : "text-storefront-muted hover:text-storefront-text hover:bg-white/5"
                  }`}
                  style={!selectedCategory ? { background: "linear-gradient(180deg, #cfbb96 0%, #a8956e 50%, #6e5f40 100%)" } : undefined}
                >
                  Все товары
                </button>

                {parentCategories.map((parent) => {
                  const children = getChildren(parent.id);
                  const isExpanded = expandedParents.has(parent.id);
                  const isActive = selectedCategory === parent.id;

                  return (
                    <div key={parent.id}>
                      <div className="flex items-center">
                        <button
                          onClick={() => selectCategory(parent.id)}
                          className={`flex-1 text-left text-[15px] font-semibold py-2.5 px-4 transition-colors ${
                            isActive
                              ? "text-[#cfbb96]"
                              : "text-storefront-muted hover:text-storefront-text"
                          }`}
                        >
                          {parent.name}
                        </button>
                        {children.length > 0 && (
                          <button
                            onClick={() => toggleParent(parent.id)}
                            className="p-1 text-storefront-muted hover:text-storefront-text transition-colors"
                          >
                            <ChevronRight className={`w-3.5 h-3.5 transition-transform ${isExpanded ? "rotate-90" : ""}`} />
                          </button>
                        )}
                      </div>

                      {/* Children */}
                      {isExpanded && children.length > 0 && (
                        <div className="ml-3 border-l border-white/5 pl-3 mb-1">
                          {children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => selectCategory(child.id)}
                              className={`w-full text-left text-[13px] py-1.5 px-2 transition-colors ${
                                selectedCategory === child.id
                                  ? "text-storefront-gold font-medium"
                                  : "text-storefront-muted hover:text-storefront-text"
                              }`}
                            >
                              {child.name}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Tabs: Все / Популярное / Новинки / Скидки */}
              <div className="flex flex-wrap gap-1.5 mb-6">
                {[
                  { key: "all" as const, label: "Все" },
                  { key: "popular" as const, label: "Популярное" },
                  { key: "new" as const, label: "Новинки" },
                  { key: "sale" as const, label: "Скидки" },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    onClick={() => { setActiveTab(tab.key); setPage(1); }}
                    className={`px-3 py-1.5 text-[11px] uppercase tracking-wider transition-all ${
                      activeTab === tab.key
                        ? "bg-storefront-gold text-[#07090d] font-semibold"
                        : "bg-white/5 text-storefront-muted hover:bg-white/10 hover:text-storefront-text"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              {/* Price filter */}
              <div className="border-t border-white/5 pt-4 mb-6">
                <button
                  onClick={() => setPriceOpen(!priceOpen)}
                  className="flex items-center justify-between w-full mb-3"
                >
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-storefront-text">Цена</span>
                  {priceOpen ? <ChevronUp className="w-3.5 h-3.5 text-storefront-muted" /> : <ChevronDown className="w-3.5 h-3.5 text-storefront-muted" />}
                </button>
                {priceOpen && (
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      placeholder="от"
                      value={priceFrom}
                      onChange={(e) => { setPriceFrom(e.target.value); setPage(1); }}
                      className="w-full bg-[#0f1218] border border-white/10 text-storefront-text text-xs px-3 py-2 placeholder:text-storefront-muted/40 focus:outline-none focus:border-storefront-gold/40"
                    />
                    <span className="text-storefront-muted text-xs">—</span>
                    <input
                      type="number"
                      placeholder="до"
                      value={priceTo}
                      onChange={(e) => { setPriceTo(e.target.value); setPage(1); }}
                      className="w-full bg-[#0f1218] border border-white/10 text-storefront-text text-xs px-3 py-2 placeholder:text-storefront-muted/40 focus:outline-none focus:border-storefront-gold/40"
                    />
                  </div>
                )}
              </div>

              {/* Material filter placeholder */}
              <div className="border-t border-white/5 pt-4 mb-6">
                <button className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-storefront-text">Материал</span>
                  <ChevronDown className="w-3.5 h-3.5 text-storefront-muted" />
                </button>
              </div>

              <div className="border-t border-white/5 pt-4 mb-6">
                <button className="flex items-center justify-between w-full">
                  <span className="text-xs font-semibold uppercase tracking-[0.15em] text-storefront-text">Цвет / Покрытие</span>
                  <ChevronDown className="w-3.5 h-3.5 text-storefront-muted" />
                </button>
              </div>
            </aside>

            {/* ===== PRODUCTS GRID ===== */}
            <div className="flex-1 min-w-0">
              {/* Count */}
              <div className="text-xs text-storefront-muted mb-4">
                Найдено: {filtered.length} товаров · Страница {page} из {totalPages || 1}
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((product: any, i: number) => {
                  const img = getPrimaryImage(product);
                  const catName = getCategoryName(product.category_id);

                  return (
                    <motion.div
                      key={product.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.25, delay: Math.min(i * 0.03, 0.3) }}
                    >
                      <Link
                        to={`/store/${slug}/product/${product.slug}`}
                        className="group block"
                      >
                        {/* Image — tall, full-height door */}
                        <div className="relative aspect-[2/5] overflow-hidden bg-[#0c0e14]">
                          {img ? (
                            <img
                              src={img}
                              alt={product.name}
                              loading="lazy"
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center bg-[#0f1218]">
                              <span className="text-storefront-muted/20 text-5xl font-bold">B</span>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="pt-3">
                          {catName && (
                            <span className="text-[10px] uppercase tracking-[0.15em] text-storefront-muted/60 block mb-1">
                              {catName}
                            </span>
                          )}
                          <h3 className="text-xs font-semibold text-storefront-text uppercase tracking-wider leading-snug mb-1 line-clamp-2">
                            {product.name}
                          </h3>
                          {product.rrp && (
                            <p className="text-sm font-medium text-storefront-text">
                              {Number(product.rrp).toLocaleString("ru-RU")} ₽
                            </p>
                          )}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-storefront-muted">
                  <p className="text-lg mb-2">Товары не найдены</p>
                  <button
                    onClick={() => { selectCategory(null); setPriceFrom(""); setPriceTo(""); }}
                    className="text-storefront-gold text-sm"
                  >
                    Сбросить фильтры
                  </button>
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center gap-1 mt-8">
                  <button
                    onClick={() => setPage(Math.max(1, page - 1))}
                    disabled={page <= 1}
                    className="px-3 py-2 text-xs text-storefront-muted hover:text-storefront-text disabled:opacity-30 transition-colors"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 2)
                    .map((p, idx, arr) => (
                      <span key={p} className="contents">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-2 text-storefront-muted/40 text-xs">…</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-8 h-8 text-xs transition-colors ${
                            p === page
                              ? "bg-storefront-gold text-[#07090d] font-bold"
                              : "text-storefront-muted hover:text-storefront-text hover:bg-white/5"
                          }`}
                        >
                          {p}
                        </button>
                      </span>
                    ))}
                  <button
                    onClick={() => setPage(Math.min(totalPages, page + 1))}
                    disabled={page >= totalPages}
                    className="px-3 py-2 text-xs text-storefront-muted hover:text-storefront-text disabled:opacity-30 transition-colors"
                  >
                    →
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
