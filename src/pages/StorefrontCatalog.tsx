import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts, useStorefrontCategories } from "@/hooks/useStorefrontData";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X, ChevronDown, ArrowRight } from "lucide-react";

export default function StorefrontCatalog() {
  const { slug } = useParams<{ slug: string }>();
  const { data: site, isLoading } = useSiteBySlug(slug);
  const { data: products = [] } = useStorefrontProducts(site?.id);
  const { data: categories = [] } = useStorefrontCategories();

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 999999]);
  const [selectedCollection, setSelectedCollection] = useState<string | null>(null);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [sortBy, setSortBy] = useState<"name" | "price-asc" | "price-desc">("name");

  // Extract unique collections from product names/specs
  const collections = useMemo(() => {
    const names = new Set<string>();
    products.forEach((p: any) => {
      const specs = p.specifications as Record<string, string> | null;
      if (specs?.collection) names.add(specs.collection);
    });
    return Array.from(names).sort();
  }, [products]);

  // Get price bounds
  const priceBounds = useMemo(() => {
    const prices = products.filter((p: any) => p.rrp).map((p: any) => Number(p.rrp));
    if (prices.length === 0) return { min: 0, max: 100000 };
    return { min: Math.min(...prices), max: Math.max(...prices) };
  }, [products]);

  // Filter and sort
  const filtered = useMemo(() => {
    let result = [...products] as any[];

    if (selectedCategory) {
      result = result.filter((p) => p.category_id === selectedCategory);
    }
    if (selectedCollection) {
      result = result.filter((p) => {
        const specs = p.specifications as Record<string, string> | null;
        return specs?.collection === selectedCollection;
      });
    }
    result = result.filter((p) => {
      if (!p.rrp) return true;
      return p.rrp >= priceRange[0] && p.rrp <= priceRange[1];
    });

    switch (sortBy) {
      case "price-asc":
        result.sort((a, b) => (a.rrp || 0) - (b.rrp || 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.rrp || 0) - (a.rrp || 0));
        break;
      default:
        result.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
    }

    return result;
  }, [products, selectedCategory, selectedCollection, priceRange, sortBy]);

  const getPrimaryImage = (p: any) => {
    const primary = p.product_images?.find((i: any) => i.is_primary);
    return primary?.url || p.product_images?.[0]?.url;
  };

  const activeFiltersCount = [selectedCategory, selectedCollection].filter(Boolean).length +
    (priceRange[0] > 0 || priceRange[1] < 999999 ? 1 : 0);

  const clearFilters = () => {
    setSelectedCategory(null);
    setSelectedCollection(null);
    setPriceRange([0, 999999]);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-storefront-bg flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-storefront-gold/20 border-t-storefront-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-storefront-bg flex items-center justify-center text-storefront-text">
        <h1 className="text-2xl">Сайт не найден</h1>
      </div>
    );
  }

  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-14 md:pt-0">
        {/* Hero banner */}
        <div className="bg-storefront-bg border-b border-white/5">
          <div className="max-w-[1400px] mx-auto px-6 py-16 md:py-24">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex items-center gap-3 mb-4">
                <Link
                  to={`/store/${slug}`}
                  className="text-xs uppercase tracking-[0.2em] text-storefront-muted hover:text-storefront-gold transition-colors"
                >
                  Главная
                </Link>
                <span className="text-storefront-muted/40">/</span>
                <span className="text-xs uppercase tracking-[0.2em] text-storefront-gold">Каталог</span>
              </div>
              <h1
                className="text-4xl sm:text-5xl lg:text-6xl font-bold text-storefront-text uppercase tracking-wide"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                DOORS <span className="text-storefront-gold">COLLECTION</span>
              </h1>
              <p className="mt-4 text-storefront-muted text-sm max-w-md">
                Полный каталог входных и межкомнатных дверей Brandoors
              </p>
            </motion.div>
          </div>
        </div>

        <div className="max-w-[1400px] mx-auto px-6 py-10">
          {/* Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="flex items-center gap-2 px-4 py-2.5 border border-storefront-gold/20 text-storefront-text text-xs uppercase tracking-wider hover:border-storefront-gold transition-colors"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="ml-1 w-5 h-5 bg-storefront-gold text-storefront-bg text-[10px] flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="text-xs text-storefront-muted hover:text-storefront-gold transition-colors flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Сбросить
                </button>
              )}
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs text-storefront-muted">
                {filtered.length} {filtered.length === 1 ? "товар" : filtered.length < 5 ? "товара" : "товаров"}
              </span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as any)}
                  className="appearance-none bg-transparent border border-storefront-gold/20 text-storefront-text text-xs uppercase tracking-wider px-4 py-2.5 pr-8 cursor-pointer hover:border-storefront-gold transition-colors focus:outline-none"
                >
                  <option value="name" className="bg-storefront-bg">По умолчанию</option>
                  <option value="price-asc" className="bg-storefront-bg">Цена ↑</option>
                  <option value="price-desc" className="bg-storefront-bg">Цена ↓</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-storefront-muted pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Filters panel */}
          <AnimatePresence>
            {filtersOpen && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden mb-8"
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 border border-storefront-gold/10 bg-storefront-card">
                  {/* Category filter */}
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-storefront-gold mb-3">Категория</h3>
                    <div className="space-y-2">
                      <button
                        onClick={() => setSelectedCategory(null)}
                        className={`block text-sm transition-colors ${
                          !selectedCategory ? "text-storefront-gold" : "text-storefront-muted hover:text-storefront-text"
                        }`}
                      >
                        Все категории
                      </button>
                      {categories.map((cat: any) => (
                        <button
                          key={cat.id}
                          onClick={() => setSelectedCategory(cat.id)}
                          className={`block text-sm transition-colors ${
                            selectedCategory === cat.id ? "text-storefront-gold" : "text-storefront-muted hover:text-storefront-text"
                          }`}
                        >
                          {cat.name}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Price filter */}
                  <div>
                    <h3 className="text-xs uppercase tracking-[0.2em] text-storefront-gold mb-3">Цена</h3>
                    <div className="flex items-center gap-3">
                      <div className="flex-1">
                        <label className="text-[10px] uppercase text-storefront-muted mb-1 block">От</label>
                        <input
                          type="number"
                          value={priceRange[0] || ""}
                          onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                          placeholder={String(priceBounds.min)}
                          className="w-full bg-transparent border border-storefront-gold/20 text-storefront-text text-sm px-3 py-2 focus:outline-none focus:border-storefront-gold"
                        />
                      </div>
                      <span className="text-storefront-muted mt-4">—</span>
                      <div className="flex-1">
                        <label className="text-[10px] uppercase text-storefront-muted mb-1 block">До</label>
                        <input
                          type="number"
                          value={priceRange[1] < 999999 ? priceRange[1] : ""}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 999999])}
                          placeholder={String(priceBounds.max)}
                          className="w-full bg-transparent border border-storefront-gold/20 text-storefront-text text-sm px-3 py-2 focus:outline-none focus:border-storefront-gold"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Collection filter */}
                  {collections.length > 0 && (
                    <div>
                      <h3 className="text-xs uppercase tracking-[0.2em] text-storefront-gold mb-3">Коллекция</h3>
                      <div className="space-y-2">
                        <button
                          onClick={() => setSelectedCollection(null)}
                          className={`block text-sm transition-colors ${
                            !selectedCollection ? "text-storefront-gold" : "text-storefront-muted hover:text-storefront-text"
                          }`}
                        >
                          Все коллекции
                        </button>
                        {collections.map((col) => (
                          <button
                            key={col}
                            onClick={() => setSelectedCollection(col)}
                            className={`block text-sm transition-colors ${
                              selectedCollection === col ? "text-storefront-gold" : "text-storefront-muted hover:text-storefront-text"
                            }`}
                          >
                            {col}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Product grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-1">
            <AnimatePresence mode="popLayout">
              {filtered.map((product: any, i: number) => {
                const img = getPrimaryImage(product);
                return (
                  <motion.div
                    key={product.id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ duration: 0.3, delay: i * 0.03 }}
                  >
                    <Link
                      to={`/store/${slug}/product/${product.slug}`}
                      className="group relative aspect-[3/4] bg-storefront-card overflow-hidden block"
                    >
                      {img ? (
                        <img
                          src={img}
                          alt={product.name}
                          loading="lazy"
                          className="w-full h-full object-cover opacity-70 group-hover:opacity-90 group-hover:scale-105 transition-all duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-storefront-card flex items-center justify-center">
                          <span className="text-storefront-muted/30 text-6xl font-bold">B</span>
                        </div>
                      )}

                      <div className="absolute inset-0 bg-gradient-to-t from-storefront-bg via-storefront-bg/20 to-transparent" />

                      <div className="absolute bottom-0 left-0 right-0 p-5">
                        {product.categories && (
                          <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-gold/70 mb-1 block">
                            {(product.categories as any)?.name || ""}
                          </span>
                        )}
                        <h3 className="text-sm font-semibold text-storefront-text leading-snug uppercase tracking-wide">
                          {product.name}
                        </h3>
                        {product.rrp && (
                          <p className="mt-1 text-sm text-storefront-gold font-medium">
                            от {Number(product.rrp).toLocaleString("ru-RU")} ₽
                          </p>
                        )}
                      </div>

                      <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                        <ArrowRight className="w-5 h-5 text-storefront-gold" />
                      </div>
                    </Link>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {filtered.length === 0 && (
            <div className="text-center py-20 text-storefront-muted">
              <p className="text-lg mb-2">Товары не найдены</p>
              <button onClick={clearFilters} className="text-storefront-gold text-sm hover:underline">
                Сбросить фильтры
              </button>
            </div>
          )}
        </div>
      </div>
    </StorefrontLayout>
  );
}
