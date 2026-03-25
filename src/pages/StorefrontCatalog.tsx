import { useState, useMemo, useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts, useStorefrontCategories } from "@/hooks/useStorefrontData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronDown, ShoppingCart, Check } from "lucide-react";
import brandoorsLogo from "@/assets/logo.png";
import { useCartStore } from "@/stores/useCartStore";

const ITEMS_PER_PAGE = 16;

export default function StorefrontCatalog() {
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const slug = useSiteSlug(urlSlug);
  const [searchParams] = useSearchParams();
  const collectionParam = searchParams.get("collection");
  const { data: site, isLoading } = useSiteBySlug(slug);
  const { data: products = [] } = useStorefrontProducts(site?.id);
  const { data: categories = [] } = useStorefrontCategories();

  useDocumentMeta({
    title: site ? `Каталог дверей — ${site.name}` : "Каталог — Brandoors",
    description: site ? `Каталог межкомнатных и входных дверей в салоне ${site.name}, ${site.city}` : "Каталог дверей Brandoors",
    ogUrl: site ? `https://${site.slug}.brandoors.su/catalog` : undefined,
  });

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [expandedParents, setExpandedParents] = useState<Set<string>>(new Set());
  const [priceFrom, setPriceFrom] = useState("");
  const [priceTo, setPriceTo] = useState("");
  const [priceOpen, setPriceOpen] = useState(true);
  const [colorOpen, setColorOpen] = useState(true);
  const [glazingOpen, setGlazingOpen] = useState(true);
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedGlazings, setSelectedGlazings] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("default");
  const [page, setPage] = useState(1);

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

  const toggleColor = (color: string) => {
    setSelectedColors((prev) => {
      const next = new Set(prev);
      next.has(color) ? next.delete(color) : next.add(color);
      return next;
    });
    setPage(1);
  };

  const toggleGlazing = (g: string) => {
    setSelectedGlazings((prev) => {
      const next = new Set(prev);
      next.has(g) ? next.delete(g) : next.add(g);
      return next;
    });
    setPage(1);
  };

  // Auto-select category from URL ?collection= param
  useEffect(() => {
    if (!collectionParam || categories.length === 0) return;
    const match = (categories as any[]).find(
      (c) => c.name.toUpperCase() === collectionParam.toUpperCase()
    );
    if (match) {
      selectCategory(match.id);
      // Expand parent if it's a child category
      if (match.parent_id) {
        setExpandedParents((prev) => new Set(prev).add(match.parent_id));
      }
    }
  }, [collectionParam, categories]);

  // Get all descendant IDs for a parent
  const getDescendantIds = (parentId: string): string[] => {
    const children = getChildren(parentId);
    return children.map((c) => c.id);
  };

  // Extract unique colors and glazings from product specifications
  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    (products as any[]).forEach((p) => {
      const c = p.specifications?.color;
      if (c) colors.add(c);
    });
    return Array.from(colors).sort();
  }, [products]);

  const availableGlazings = useMemo(() => {
    const glazings = new Set<string>();
    (products as any[]).forEach((p) => {
      const g = p.specifications?.glazing;
      if (g) glazings.add(g);
    });
    return Array.from(glazings).sort();
  }, [products]);

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

    // Color filter from specifications
    if (selectedColors.size > 0) {
      result = result.filter((p) => {
        const c = p.specifications?.color;
        return c && selectedColors.has(c);
      });
    }

    // Glazing filter from specifications
    if (selectedGlazings.size > 0) {
      result = result.filter((p) => {
        const g = p.specifications?.glazing;
        return g && selectedGlazings.has(g);
      });
    }

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
  }, [products, categories, selectedCategory, priceFrom, priceTo, sortBy, selectedColors, selectedGlazings]);

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
            <div className="relative shrink-0">
              <select
                value={sortBy}
                onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                className="appearance-none bg-[#0f1218] border border-white/10 text-storefront-text text-xs px-4 py-2.5 pr-8 cursor-pointer hover:border-storefront-gold/40 transition-colors focus:outline-none focus:border-storefront-gold/60 rounded-sm"
              >
                <option value="default">По умолчанию</option>
                <option value="price-asc">Цена ↑</option>
                <option value="price-desc">Цена ↓</option>
                <option value="name">По названию</option>
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-storefront-muted pointer-events-none" />
            </div>
          </div>

          <div className="flex gap-6 lg:gap-10">
            {/* ===== LEFT SIDEBAR — Metallic L-Panel ===== */}
            <aside className="hidden md:block w-[300px] shrink-0">
              <div
                className="relative overflow-y-auto sticky top-6 scrollbar-hide"
                style={{
                  maxHeight: "calc(100vh - 3rem)",
                  borderRadius: "24px",
                  background: "linear-gradient(175deg, #cfbb96 0%, #bda67a 15%, #a8956e 35%, #8d7c5a 55%, #7a6b4d 70%, #6e5f40 85%, #5c5035 100%)",
                  boxShadow: "0 8px 40px rgba(207, 187, 150, 0.15), 0 0 80px rgba(207, 187, 150, 0.05)",
                }}
              >
                {/* Logo at top */}
                <div className="flex items-center justify-center py-7 px-5 border-b border-black/10">
                  <img src={brandoorsLogo} alt="Brandoors" className="h-9 opacity-90" />
                </div>

                {/* Categories */}
                <div className="px-3 py-5">
                  <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1408]/40 px-4 mb-3">Категории</span>
                  
                  <button
                    onClick={() => selectCategory(null)}
                    className={`w-full text-left text-[16px] font-bold py-3.5 px-4 mb-1 rounded-xl transition-all duration-300 ${
                      !selectedCategory
                        ? "bg-black/20 text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]"
                        : "text-[#1a1408]/70 hover:text-[#1a1408] hover:bg-black/5"
                    }`}
                  >
                    Все товары
                  </button>

                  {parentCategories.map((parent) => {
                    const children = getChildren(parent.id);
                    const isExpanded = expandedParents.has(parent.id);
                    const isActive = selectedCategory === parent.id;
                    const hasActiveChild = children.some((c) => c.id === selectedCategory);

                    return (
                      <div key={parent.id}>
                        <div className="flex items-center">
                          <button
                            onClick={() => { selectCategory(parent.id); if (children.length > 0 && !isExpanded) toggleParent(parent.id); }}
                            className={`flex-1 text-left text-[16px] font-bold py-3.5 px-4 rounded-xl transition-all duration-300 ${
                              isActive || hasActiveChild
                                ? "bg-black/20 text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]"
                                : "text-[#1a1408]/70 hover:text-[#1a1408] hover:bg-black/5"
                            }`}
                          >
                            {parent.name}
                          </button>
                          {children.length > 0 && (
                            <button
                              onClick={() => toggleParent(parent.id)}
                              className="p-2.5 text-[#1a1408]/50 hover:text-[#1a1408] transition-colors"
                            >
                              <ChevronRight className={`w-5 h-5 transition-transform duration-300 ${isExpanded ? "rotate-90" : ""}`} />
                            </button>
                          )}
                        </div>

                        <AnimatePresence>
                          {isExpanded && children.length > 0 && (
                            <motion.div
                              initial={{ height: 0, opacity: 0 }}
                              animate={{ height: "auto", opacity: 1 }}
                              exit={{ height: 0, opacity: 0 }}
                              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                              className="overflow-hidden"
                            >
                              <div className="ml-5 pl-3 mb-1 border-l-2 border-black/10">
                                {children.map((child) => (
                                  <button
                                    key={child.id}
                                    onClick={() => selectCategory(child.id)}
                                    className={`w-full text-left text-[14px] font-semibold py-2.5 px-3 rounded-lg transition-all duration-200 ${
                                      selectedCategory === child.id
                                        ? "bg-black/15 text-white"
                                        : "text-[#1a1408]/55 hover:text-[#1a1408] hover:bg-black/5"
                                    }`}
                                  >
                                    {child.name}
                                  </button>
                                ))}
                              </div>
                            </motion.div>
                          )}
                        </AnimatePresence>
                      </div>
                    );
                  })}
                </div>

                {/* Divider */}
                <div className="mx-5 border-t border-black/10" />

                {/* Price Filter */}
                <div className="px-5 pt-5 pb-3">
                  <span className="block text-[15px] font-extrabold uppercase tracking-[0.12em] text-[#1a1408]/90 mb-4">Цена, ₽</span>
                  <div className="flex items-center gap-2">
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="от"
                      value={priceFrom}
                      onChange={(e) => { setPriceFrom(e.target.value); setPage(1); }}
                      className="w-full bg-black/10 border border-black/10 text-[#1a1408] text-[14px] font-bold px-3 py-3 rounded-xl placeholder:text-[#1a1408]/30 focus:outline-none focus:border-black/25 focus:bg-black/15 transition-all"
                    />
                    <span className="text-[#1a1408]/25 text-base font-bold shrink-0">—</span>
                    <input
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="до"
                      value={priceTo}
                      onChange={(e) => { setPriceTo(e.target.value); setPage(1); }}
                      className="w-full bg-black/10 border border-black/10 text-[#1a1408] text-[14px] font-bold px-3 py-3 rounded-xl placeholder:text-[#1a1408]/30 focus:outline-none focus:border-black/25 focus:bg-black/15 transition-all"
                    />
                  </div>
                </div>

                <div className="mx-5 border-t border-black/10" />

                {/* Color Filter — from DB specifications.color */}
                <div className="px-5 pt-4 pb-3">
                  <button
                    onClick={() => setColorOpen(!colorOpen)}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <span className="text-[15px] font-extrabold uppercase tracking-[0.12em] text-[#1a1408]/90">Цвет</span>
                    <ChevronRight className={`w-4 h-4 text-[#1a1408]/40 transition-transform duration-300 ${colorOpen ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {colorOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 mb-1">
                          {availableColors.map((color) => (
                            <label key={color} onClick={() => toggleColor(color)} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-black/5 cursor-pointer transition-colors group">
                              <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${
                                selectedColors.has(color)
                                  ? "bg-[#1a1408] border-[#1a1408]"
                                  : "border-[#1a1408]/20 group-hover:border-[#1a1408]/35"
                              }`}>
                                {selectedColors.has(color) && (
                                  <svg className="w-3 h-3 text-[#cfbb96]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[13px] font-semibold text-[#1a1408]/65">{color}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mx-5 border-t border-black/10" />

                {/* Glazing Filter — from DB specifications.glazing */}
                <div className="px-5 pt-4 pb-5">
                  <button
                    onClick={() => setGlazingOpen(!glazingOpen)}
                    className="flex items-center justify-between w-full mb-3"
                  >
                    <span className="text-[15px] font-extrabold uppercase tracking-[0.12em] text-[#1a1408]/90">Остекление</span>
                    <ChevronRight className={`w-4 h-4 text-[#1a1408]/40 transition-transform duration-300 ${glazingOpen ? "rotate-90" : ""}`} />
                  </button>
                  <AnimatePresence>
                    {glazingOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="space-y-0.5 mb-1">
                          {availableGlazings.map((g) => (
                            <label key={g} onClick={() => toggleGlazing(g)} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-black/5 cursor-pointer transition-colors group">
                              <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${
                                selectedGlazings.has(g)
                                  ? "bg-[#1a1408] border-[#1a1408]"
                                  : "border-[#1a1408]/20 group-hover:border-[#1a1408]/35"
                              }`}>
                                {selectedGlazings.has(g) && (
                                  <svg className="w-3 h-3 text-[#cfbb96]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                  </svg>
                                )}
                              </div>
                              <span className="text-[13px] font-semibold text-[#1a1408]/65">{g}</span>
                            </label>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

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
                      className="group"
                    >
                      <Link
                        to={`/store/${slug}/product/${product.slug}`}
                        className="block"
                      >
                        {/* Image */}
                        <div className="relative overflow-hidden bg-[#0c0e14] flex items-center justify-center" style={{ minHeight: "280px" }}>
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

                      {/* Add to cart button */}
                      <CatalogCartButton product={product} img={img} siteId={site?.id} />
                    </motion.div>
                  );
                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-storefront-muted">
                  <p className="text-lg mb-2">Товары не найдены</p>
                  <button
                    onClick={() => { selectCategory(null); setPriceFrom(""); setPriceTo(""); setSelectedColors(new Set()); setSelectedGlazings(new Set()); }}
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

function CatalogCartButton({ product, img, siteId }: { product: any; img: string | undefined; siteId: string | undefined }) {
  const addItem = useCartStore((s) => s.addItem);
  const isInCart = useCartStore((s) => s.items.some((i) => i.id === product.id));

  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!siteId) return;
        addItem({
          id: product.id,
          name: product.name,
          slug: product.slug,
          rrp: product.rrp ? Number(product.rrp) : null,
          imageUrl: img || null,
          siteId,
        });
      }}
      className={`mt-2 w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-[11px] uppercase tracking-wider font-semibold transition-all duration-300 ${
        isInCart
          ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/20"
          : "bg-white/[0.04] text-storefront-muted border border-white/[0.06] hover:border-storefront-gold/30 hover:text-storefront-gold"
      }`}
    >
      {isInCart ? <Check className="w-3.5 h-3.5" /> : <ShoppingCart className="w-3.5 h-3.5" />}
      {isInCart ? "В корзине" : "В корзину"}
    </motion.button>
  );
}
