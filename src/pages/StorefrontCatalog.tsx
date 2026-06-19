import { useState, useMemo, useEffect, useCallback, memo } from "react";
import { createPortal } from "react-dom";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts, useStorefrontCategories } from "@/hooks/useStorefrontData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { ChevronRight, ChevronDown, ShoppingCart, Check, SlidersHorizontal, X } from "lucide-react";
import brandoorsLogo from "@/assets/logo.png";
import { useCartStore } from "@/stores/useCartStore";

const ITEMS_PER_PAGE = 16;


export default function StorefrontCatalog() {
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const slug = useSiteSlug(urlSlug);
  const [searchParams] = useSearchParams();
  const collectionParam = searchParams.get("collection");
  const categoryParam = searchParams.get("category");
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
  const [colorOpen, setColorOpen] = useState(true);
  const [glazingOpen, setGlazingOpen] = useState(true);
  const [selectedColors, setSelectedColors] = useState<Set<string>>(new Set());
  const [selectedGlazings, setSelectedGlazings] = useState<Set<string>>(new Set());
  const [sortBy, setSortBy] = useState("default");
  const [page, _setPage] = useState(1);
  const setPage = (p: number | ((prev: number) => number)) => {
    _setPage(p);
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // Lock body scroll when the mobile filter sheet is open — preserve scroll position
  // so the page doesn't jump when the sheet opens/closes.
  useEffect(() => {
    if (!mobileFiltersOpen) return;
    const scrollY = window.scrollY;
    const body = document.body;
    const prev = {
      position: body.style.position,
      top: body.style.top,
      left: body.style.left,
      right: body.style.right,
      width: body.style.width,
      overflow: body.style.overflow,
    };
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.left = "0";
    body.style.right = "0";
    body.style.width = "100%";
    body.style.overflow = "hidden";
    return () => {
      body.style.position = prev.position;
      body.style.top = prev.top;
      body.style.left = prev.left;
      body.style.right = prev.right;
      body.style.width = prev.width;
      body.style.overflow = prev.overflow;
      window.scrollTo(0, scrollY);
    };
  }, [mobileFiltersOpen]);

  const resetAllFilters = () => {
    setSelectedCategory(null);
    setSelectedColors(new Set());
    setSelectedGlazings(new Set());
    setPage(1);
  };


  // activeFiltersCount is computed below, after `lockedParent` is defined.

  // Category tree
  const parentCategories = useMemo(
    () => (categories as any[]).filter((c) => !c.parent_id).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0)),
    [categories]
  );
  const getChildren = (parentId: string) =>
    (categories as any[]).filter((c) => c.parent_id === parentId).sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));

  // When user enters via /catalog/list?category=<slug> from the category select page,
  // lock the sidebar to only that parent so the user is browsing within that section.
  const lockedParent = useMemo(
    () => (categoryParam ? parentCategories.find((c: any) => c.slug === categoryParam) : null),
    [categoryParam, parentCategories]
  );
  const displayedParents = lockedParent ? [lockedParent] : parentCategories;
  const categoriesBackHref = `/store/${slug}/catalog`;

  // Don't count lockedParent (page context from ?category=) as a user-applied filter.
  const activeFiltersCount =
    (selectedCategory && selectedCategory !== lockedParent?.id ? 1 : 0) +
    selectedColors.size +
    selectedGlazings.size;



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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [collectionParam, categories]);

  // Auto-select parent category from URL ?category=<parentSlug> param
  // AND reset all per-category filters so options from a previous category don't leak in.
  useEffect(() => {
    setSelectedColors(new Set());
    setSelectedGlazings(new Set());
    setPage(1);

    if (!categoryParam || categories.length === 0) {
      // Returning to /catalog/list with no category — also clear the active selection
      if (!categoryParam && !collectionParam) setSelectedCategory(null);
      return;
    }
    const match = (categories as any[]).find(
      (c) => c.slug === categoryParam && !c.parent_id
    );
    if (match) {
      setExpandedParents((prev) => new Set(prev).add(match.id));
      // When a collection (child) is also requested, let the collection effect set the child.
      if (!collectionParam) {
        setSelectedCategory(match.id);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryParam, collectionParam, categories]);


  // Get all descendant IDs for a parent
  const getDescendantIds = (parentId: string): string[] => {
    const children = getChildren(parentId);
    return children.map((c) => c.id);
  };

  // Products that match the current category — used to derive which filters make sense
  const productsInCategory = useMemo(() => {
    if (!selectedCategory) return products as any[];
    const children = getChildren(selectedCategory);
    if (children.length > 0) {
      const ids = [selectedCategory, ...children.map((c) => c.id)];
      return (products as any[]).filter((p) => ids.includes(p.category_id));
    }
    return (products as any[]).filter((p) => p.category_id === selectedCategory);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products, selectedCategory, categories]);

  // Colors are derived strictly from product_images.variant_key — i.e. colors that
  // have an actual photo for the product. This makes the filter list match reality
  // (no orphan text-only entries) and lets us swap the card image to the selected color.
  const collectColors = (p: any): string[] => {
    const out = new Set<string>();
    (p?.product_images || []).forEach((i: any) => {
      const k = i?.variant_key;
      if (typeof k === "string" && k && !k.includes("|")) out.add(k);
    });
    return Array.from(out);
  };
  const collectGlazings = (p: any): string[] => {
    const out: string[] = [];
    const s = p?.specifications || {};
    if (typeof s.glazing === "string" && s.glazing) out.push(s.glazing);
    if (Array.isArray(s.glazing_options)) s.glazing_options.forEach((g: any) => typeof g === "string" && g && out.push(g));
    if (Array.isArray(s.variants)) s.variants.forEach((v: any) => v?.glazing && out.push(String(v.glazing)));
    return out;
  };

  const availableColors = useMemo(() => {
    const colors = new Set<string>();
    productsInCategory.forEach((p) => collectColors(p).forEach((c) => colors.add(c)));
    return Array.from(colors).sort();
  }, [productsInCategory]);

  const availableGlazings = useMemo(() => {
    const glazings = new Set<string>();
    productsInCategory.forEach((p) => collectGlazings(p).forEach((g) => glazings.add(g)));
    return Array.from(glazings).sort();
  }, [productsInCategory]);

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


    // Color filter — match if any of the product's colors is selected
    if (selectedColors.size > 0) {
      result = result.filter((p) => collectColors(p).some((c) => selectedColors.has(c)));
    }

    // Glazing filter — match if any of the product's glazings is selected
    if (selectedGlazings.size > 0) {
      result = result.filter((p) => collectGlazings(p).some((g) => selectedGlazings.has(g)));
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
      default: {
        const collectionOrder: Record<string, number> = {
          "26e19cbd-9e2a-4bc6-9713-26c1a36a5861": 1, // ESTETICA
          "ab947964-22a7-4630-9d13-307c48cf6b5d": 2, // GHOST
          "6e5df85e-feb0-47a0-8ca5-9019913a477c": 3, // HEAVY
          "87ff89ae-e580-4c06-b8b4-a5caba34c05b": 4, // PRIME
          "7bc36af7-9b81-438b-9701-a2bead021d49": 5, // REFLECT
          "903d9380-218f-47c1-aa8a-56f832b66267": 6, // MAZE
        };
        result.sort((a, b) => {
          const aOrder = collectionOrder[a.category_id] || 0;
          const bOrder = collectionOrder[b.category_id] || 0;
          if (aOrder !== bOrder) return aOrder - bOrder;
          return (a.sort_order || 0) - (b.sort_order || 0);
        });
      }
    }

    return result;
  }, [products, categories, selectedCategory, sortBy, selectedColors, selectedGlazings]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginated = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const getPrimaryImage = (p: any) => {
    // If user filtered by colors, show the matching color photo so cards visibly reflect the choice.
    if (selectedColors.size > 0) {
      const match = p.product_images?.find(
        (i: any) => i?.variant_key && !i.variant_key.includes("|") && selectedColors.has(i.variant_key)
      );
      if (match?.url) return match.url;
    }
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
      <div className="min-h-screen pt-[68px] md:pt-0 bg-[#07090d] overflow-x-hidden">
        <div className="w-full max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-12 min-w-0">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-xs flex-wrap">
            <Link to={`/store/${slug}`} className="uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors">
              Главная
            </Link>
            <span className="text-storefront-muted/40">/</span>
            {lockedParent ? (
              <>
                <Link to={categoriesBackHref} className="uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors">
                  Каталог
                </Link>
                <span className="text-storefront-muted/40">/</span>
                <span className="uppercase tracking-[0.15em] text-storefront-text">{lockedParent.name}</span>
              </>
            ) : (
              <span className="uppercase tracking-[0.15em] text-storefront-text">Каталог</span>
            )}
          </div>

          {/* Title row */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between sm:gap-3 mb-8">
            <h1 className="text-2xl sm:text-4xl font-bold text-storefront-text uppercase tracking-normal sm:tracking-wide break-words">
              {lockedParent ? lockedParent.name : "Каталог"}
            </h1>
            <div className="flex items-center gap-2 sm:shrink-0">

              {/* Mobile filter button */}
              <button
                onClick={() => setMobileFiltersOpen(true)}
                className="md:hidden flex-1 flex items-center justify-center gap-2 bg-[#0f1218] border border-white/10 text-storefront-text text-xs px-4 h-11 hover:border-storefront-gold/40 transition-colors rounded-sm"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Фильтры
                {activeFiltersCount > 0 && (
                  <span className="ml-0.5 min-w-[18px] h-[18px] px-1.5 inline-flex items-center justify-center rounded-full bg-storefront-gold text-[10px] font-bold text-[#1a1408] leading-none">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
              {/* Sort hidden per request */}
              {false && (
              <div className="relative flex-1 sm:flex-initial">
                <select
                  value={sortBy}
                  onChange={(e) => { setSortBy(e.target.value); setPage(1); }}
                  className="w-full appearance-none bg-[#0f1218] border border-white/10 text-storefront-text text-xs px-4 h-11 sm:h-auto sm:py-2.5 pr-8 cursor-pointer hover:border-storefront-gold/40 transition-colors focus:outline-none focus:border-storefront-gold/60 rounded-sm"
                >
                  <option value="default">По умолчанию</option>
                  <option value="price-asc">Цена ↑</option>
                  <option value="price-desc">Цена ↓</option>
                  <option value="name">По названию</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-storefront-muted pointer-events-none" />
              </div>
              )}
            </div>
          </div>

          {/* ===== MOBILE FILTER SHEET ===== */}
          {mobileFiltersOpen && (
            <MobileFilterSheet
              onClose={() => setMobileFiltersOpen(false)}
              onReset={resetAllFilters}
              resultsCount={filtered.length}
              activeCount={activeFiltersCount}
              parentCategories={displayedParents}
              backHref={lockedParent ? categoriesBackHref : null}

              getChildren={getChildren}
              expandedParents={expandedParents}
              toggleParent={toggleParent}
              selectedCategory={selectedCategory}
              selectCategory={selectCategory}
              availableColors={availableColors}
              selectedColors={selectedColors}
              toggleColor={toggleColor}
              availableGlazings={availableGlazings}
              selectedGlazings={selectedGlazings}
              toggleGlazing={toggleGlazing}
            />
          )}


          <div className="flex gap-6 lg:gap-10">
            {/* ===== LEFT SIDEBAR — Desktop only ===== */}
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
                <SidebarContent
                  brandoorsLogo={brandoorsLogo}
                  parentCategories={displayedParents}
                  backHref={lockedParent ? categoriesBackHref : null}

                  getChildren={getChildren}
                  expandedParents={expandedParents}
                  toggleParent={toggleParent}
                  selectedCategory={selectedCategory}
                  selectCategory={selectCategory}
                  colorOpen={colorOpen}
                  setColorOpen={setColorOpen}
                  availableColors={availableColors}
                  selectedColors={selectedColors}
                  toggleColor={toggleColor}
                  glazingOpen={glazingOpen}
                  setGlazingOpen={setGlazingOpen}
                  availableGlazings={availableGlazings}
                  selectedGlazings={selectedGlazings}
                  toggleGlazing={toggleGlazing}
                />
              </div>
            </aside>


            {/* ===== PRODUCTS GRID ===== */}
            <div className="flex-1 min-w-0">
              {/* Count */}
              <div className="flex items-baseline justify-between gap-3 mb-4 text-[13px]">
                <span className="text-storefront-text/80">
                  Найдено: <span className="font-semibold text-storefront-text">{filtered.length}</span>
                </span>
              </div>

              {/* Grid */}
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {paginated.map((product: any, i: number) => {
                  const img = getPrimaryImage(product);
                  const catName = getCategoryName(product.category_id);

                  return (
                    <ProductCard
                      key={product.id}
                      product={product}
                      img={img}
                      catName={catName}
                      slug={slug}
                      siteId={site?.id}
                    />
                  );

                })}
              </div>

              {filtered.length === 0 && (
                <div className="text-center py-20 text-storefront-muted">
                  <p className="text-lg mb-2">Товары не найдены</p>
                  <button
                    onClick={() => { selectCategory(null); setSelectedColors(new Set()); setSelectedGlazings(new Set()); }}
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
                    className="w-11 h-11 flex items-center justify-center text-base text-storefront-muted hover:text-storefront-text disabled:opacity-30 transition-colors rounded-md"
                  >
                    ←
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((p) => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                    .map((p, idx, arr) => (
                      <span key={p} className="contents">
                        {idx > 0 && arr[idx - 1] !== p - 1 && (
                          <span className="px-1 text-storefront-muted/40 text-xs">…</span>
                        )}
                        <button
                          onClick={() => setPage(p)}
                          className={`w-11 h-11 text-sm rounded-md transition-colors ${
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
                    className="w-11 h-11 flex items-center justify-center text-base text-storefront-muted hover:text-storefront-text disabled:opacity-30 transition-colors rounded-md"
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

interface SidebarContentProps {
  brandoorsLogo: string;
  parentCategories: any[];
  backHref: string | null;
  getChildren: (id: string) => any[];
  expandedParents: Set<string>;
  toggleParent: (id: string) => void;
  selectedCategory: string | null;
  selectCategory: (id: string | null) => void;
  colorOpen: boolean;
  setColorOpen: (v: boolean) => void;
  availableColors: string[];
  selectedColors: Set<string>;
  toggleColor: (c: string) => void;
  glazingOpen: boolean;
  setGlazingOpen: (v: boolean) => void;
  availableGlazings: string[];
  selectedGlazings: Set<string>;
  toggleGlazing: (g: string) => void;
}

function SidebarContent({
  brandoorsLogo, parentCategories, backHref, getChildren, expandedParents, toggleParent,
  selectedCategory, selectCategory,
  colorOpen, setColorOpen, availableColors, selectedColors, toggleColor,
  glazingOpen, setGlazingOpen, availableGlazings, selectedGlazings, toggleGlazing,
}: SidebarContentProps) {

  return (
    <>
      {/* Logo */}
      <div className="flex items-center justify-center py-7 px-5 border-b border-black/10">
        <img src={brandoorsLogo} alt="Brandoors" className="h-9 opacity-90" />
      </div>

      {/* Categories */}
      <div className="px-3 py-5">
        <span className="block text-[10px] font-bold uppercase tracking-[0.2em] text-[#1a1408]/40 px-4 mb-3">Категории</span>

        {backHref ? (
          <Link
            to={backHref}
            className="flex items-center gap-2 text-[14px] font-bold py-3.5 px-4 mb-2 rounded-xl text-[#1a1408]/75 hover:text-[#1a1408] hover:bg-black/5 transition-all duration-300"
          >
            <ChevronRight className="w-4 h-4 rotate-180" />
            К категориям
          </Link>
        ) : (
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
        )}


        {parentCategories.map((parent) => {
          const children = getChildren(parent.id);
          const isExpanded = expandedParents.has(parent.id);
          const isActive = selectedCategory === parent.id;
          const hasActiveChild = children.some((c: any) => c.id === selectedCategory);

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

              {isExpanded && children.length > 0 && (
                <div className="overflow-hidden animate-accordion-down">
                  <div className="ml-5 pl-3 mb-1 border-l-2 border-black/10">
                    {children.map((child: any) => (
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
                </div>
              )}

            </div>
          );
        })}
      </div>

      <div className="mx-5 border-t border-black/10" />


      {/* Color — only shown when current category has products with colors */}
      {availableColors.length > 0 && (
        <>
          <div className="px-5 pt-4 pb-3">
            <button onClick={() => setColorOpen(!colorOpen)} className="flex items-center justify-between w-full mb-3">
              <span className="text-[15px] font-extrabold uppercase tracking-[0.12em] text-[#1a1408]/90">Цвет</span>
              <ChevronRight className={`w-4 h-4 text-[#1a1408]/40 transition-transform duration-300 ${colorOpen ? "rotate-90" : ""}`} />
            </button>
            {colorOpen && (
              <div className="overflow-hidden animate-accordion-down">
                <div className="space-y-0.5 mb-1">
                  {availableColors.map((color) => (
                    <label key={color} onClick={() => toggleColor(color)} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-black/5 cursor-pointer transition-colors group">
                      <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${
                        selectedColors.has(color) ? "bg-[#1a1408] border-[#1a1408]" : "border-[#1a1408]/20 group-hover:border-[#1a1408]/35"
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
              </div>
            )}
          </div>
          <div className="mx-5 border-t border-black/10" />
        </>
      )}

      {/* Glazing — only shown when current category has products with glazing */}
      {availableGlazings.length > 0 && (
        <div className="px-5 pt-4 pb-5">
          <button onClick={() => setGlazingOpen(!glazingOpen)} className="flex items-center justify-between w-full mb-3">
            <span className="text-[15px] font-extrabold uppercase tracking-[0.12em] text-[#1a1408]/90">Остекление</span>
            <ChevronRight className={`w-4 h-4 text-[#1a1408]/40 transition-transform duration-300 ${glazingOpen ? "rotate-90" : ""}`} />
          </button>
          {glazingOpen && (
            <div className="overflow-hidden animate-accordion-down">
              <div className="space-y-0.5 mb-1">
                {availableGlazings.map((g) => (
                  <label key={g} onClick={() => toggleGlazing(g)} className="flex items-center gap-3 py-2 px-2 rounded-lg hover:bg-black/5 cursor-pointer transition-colors group">
                    <div className={`w-[18px] h-[18px] rounded border-2 flex items-center justify-center transition-all ${
                      selectedGlazings.has(g) ? "bg-[#1a1408] border-[#1a1408]" : "border-[#1a1408]/20 group-hover:border-[#1a1408]/35"
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
            </div>
          )}
        </div>
      )}
    </>
  );
}

const ProductCard = memo(function ProductCard({
  product,
  img,
  catName,
  slug,
  siteId,
}: {
  product: any;
  img: string | undefined;
  catName: string;
  slug: string | undefined;
  siteId: string | undefined;
}) {
  return (
    <div className="group">
      <Link to={`/store/${slug}/product/${product.slug}`} className="block">
        <div className="relative overflow-hidden bg-[#0c0e14] flex items-center justify-center aspect-[4/5] rounded-2xl">
          {img ? (
            <img
              src={img}
              alt={product.name}
              loading="lazy"
              decoding="async"
              width="400"
              height="500"
              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-[#0f1218] rounded-2xl">
              <span className="text-storefront-muted/20 text-5xl font-bold">B</span>
            </div>
          )}
        </div>
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
            <p className="text-sm font-medium text-storefront-text tabular-nums">
              {Number(product.rrp).toLocaleString("ru-RU")} ₽
            </p>
          )}
        </div>
      </Link>
      <CatalogCartButton productId={product.id} product={product} img={img} siteId={siteId} />
    </div>
  );
});

function CatalogCartButton({
  productId,
  product,
  img,
  siteId,
}: {
  productId: string;
  product: any;
  img: string | undefined;
  siteId: string | undefined;
}) {
  const addItem = useCartStore((s) => s.addItem);
  // Subscribe to a boolean derived per-id — prevents re-render on unrelated cart changes
  const isInCart = useCartStore((s) => s.items.some((i) => i.id === productId));

  return (
    <button
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
          type: "door",
        });
      }}
      className={`mt-2.5 w-full h-11 flex items-center justify-center gap-2 rounded-xl text-[11px] uppercase tracking-[0.18em] font-semibold transition-all duration-300 active:scale-[0.97] ${
        isInCart
          ? "bg-storefront-gold/15 text-storefront-gold border border-storefront-gold/35"
          : "bg-transparent text-storefront-gold border border-storefront-gold/40 hover:bg-storefront-gold hover:text-[#1a1408]"
      }`}
    >
      {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
      {isInCart ? "В корзине" : "В корзину"}
    </button>
  );
}


interface MobileFilterSheetProps {
  onClose: () => void;
  onReset: () => void;
  resultsCount: number;
  activeCount: number;
  parentCategories: any[];
  backHref: string | null;

  getChildren: (id: string) => any[];
  expandedParents: Set<string>;
  toggleParent: (id: string) => void;
  selectedCategory: string | null;
  selectCategory: (id: string | null) => void;
  availableColors: string[];
  selectedColors: Set<string>;
  toggleColor: (c: string) => void;
  availableGlazings: string[];
  selectedGlazings: Set<string>;
  toggleGlazing: (g: string) => void;
}

function MobileFilterSheet({
  onClose, onReset, resultsCount, activeCount,
  parentCategories, backHref, getChildren, expandedParents, toggleParent,

  selectedCategory, selectCategory,
  availableColors, selectedColors, toggleColor,
  availableGlazings, selectedGlazings, toggleGlazing,
}: MobileFilterSheetProps) {
  const goldGradient =
    "linear-gradient(175deg, #cfbb96 0%, #bda67a 15%, #a8956e 35%, #8d7c5a 55%, #7a6b4d 70%, #6e5f40 85%, #5c5035 100%)";

  // Slide-in animation: start off-screen, then translate to 0 on next frame.
  const [entered, setEntered] = useState(false);
  useEffect(() => {
    const id = requestAnimationFrame(() => setEntered(true));
    return () => cancelAnimationFrame(id);
  }, []);

  if (typeof document === "undefined") return null;

  const node = (
    <div className="md:hidden fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div
        onClick={onClose}
        className={`absolute inset-0 bg-black/60 transition-opacity duration-300 ${
          entered ? "opacity-100" : "opacity-0"
        }`}
      />

      {/* Left drawer panel */}
      <div
        className={`absolute top-0 left-0 h-full w-[85vw] max-w-[360px] flex flex-col shadow-[8px_0_32px_rgba(0,0,0,0.45)] transition-transform duration-300 ease-out ${
          entered ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: goldGradient }}
      >
      {/* Header — sticky, gold, dark text */}
      <div
        className="shrink-0 flex items-center justify-between px-5 h-14 border-b border-black/10"
        style={{ background: goldGradient }}
      >
        <div className="flex items-center gap-2.5">
          <span className="text-[14px] font-extrabold uppercase tracking-[0.18em] text-[#1a1408]">Фильтры</span>
          {activeCount > 0 && (
            <span className="min-w-[20px] h-5 px-1.5 inline-flex items-center justify-center rounded-full bg-[#1a1408] text-[10px] font-bold text-[#cfbb96] leading-none">
              {activeCount}
            </span>
          )}
        </div>
        <button
          onClick={onClose}
          className="-mr-2 w-10 h-10 flex items-center justify-center text-[#1a1408]/70 active:text-[#1a1408]"
          aria-label="Закрыть"
        >
          <X className="w-6 h-6" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto overscroll-contain px-5 pt-5 pb-6 scrollbar-hide">
        {/* Categories */}
        <section className="mb-5">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1408]/50 mb-3 px-1">Категории</h3>
          <div className="space-y-1.5">
            {backHref ? (
              <Link
                to={backHref}
                onClick={onClose}
                className="flex items-center gap-2 px-4 py-3 rounded-xl text-[14px] font-bold text-[#1a1408]/75 active:bg-black/5 transition-all"
              >
                <ChevronRight className="w-4 h-4 rotate-180" />
                К категориям
              </Link>
            ) : (
              <button
                onClick={() => selectCategory(null)}
                className={`w-full text-left px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
                  !selectedCategory
                    ? "bg-black/20 text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]"
                    : "text-[#1a1408]/75 active:bg-black/5"
                }`}
              >
                Все товары
              </button>
            )}

            {parentCategories.map((parent) => {
              const children = getChildren(parent.id);
              const isExpanded = expandedParents.has(parent.id);
              const isActive = selectedCategory === parent.id;
              const hasActiveChild = children.some((c: any) => c.id === selectedCategory);
              const highlighted = isActive || hasActiveChild;
              return (
                <div key={parent.id}>
                  <div className="flex items-stretch gap-1.5">
                    <button
                      onClick={() => selectCategory(parent.id)}
                      className={`flex-1 text-left px-4 py-3 rounded-xl text-[14px] font-bold transition-all ${
                        highlighted
                          ? "bg-black/20 text-white shadow-[inset_0_0_20px_rgba(0,0,0,0.15)]"
                          : "text-[#1a1408]/75 active:bg-black/5"
                      }`}
                    >
                      {parent.name}
                    </button>
                    {children.length > 0 && (
                      <button
                        onClick={() => toggleParent(parent.id)}
                        className="w-11 shrink-0 flex items-center justify-center rounded-xl bg-black/5 text-[#1a1408]/60 active:bg-black/10"
                        aria-label={isExpanded ? "Свернуть" : "Развернуть"}
                      >
                        <ChevronRight className={`w-4.5 h-4.5 transition-transform duration-200 ${isExpanded ? "rotate-90" : ""}`} />
                      </button>
                    )}
                  </div>
                  {isExpanded && children.length > 0 && (
                    <div className="mt-1.5 ml-3 pl-3 border-l-2 border-black/10 space-y-1">
                      {children.map((child: any) => (
                        <button
                          key={child.id}
                          onClick={() => selectCategory(child.id)}
                          className={`w-full text-left px-3 py-2.5 rounded-lg text-[13px] font-semibold transition-all ${
                            selectedCategory === child.id
                              ? "bg-black/15 text-white"
                              : "text-[#1a1408]/60 active:bg-black/5"
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
        </section>


        {/* Colors as chips */}
        {availableColors.length > 0 && (
          <>
            <div className="border-t border-black/10 my-5" />
            <section className="mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1408]/50 mb-3 px-1">Цвет</h3>
              <div className="flex flex-wrap gap-2">
                {availableColors.map((color) => {
                  const active = selectedColors.has(color);
                  return (
                    <button
                      key={color}
                      onClick={() => toggleColor(color)}
                      className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all border ${
                        active
                          ? "bg-[#1a1408] text-[#cfbb96] border-[#1a1408]"
                          : "bg-black/5 text-[#1a1408]/75 border-black/10 active:bg-black/10"
                      }`}
                    >
                      {color}
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}

        {/* Glazing as chips */}
        {availableGlazings.length > 0 && (
          <>
            <div className="border-t border-black/10 my-5" />
            <section className="mb-5">
              <h3 className="text-[10px] font-bold uppercase tracking-[0.22em] text-[#1a1408]/50 mb-3 px-1">Остекление</h3>
              <div className="flex flex-wrap gap-2">
                {availableGlazings.map((g) => {
                  const active = selectedGlazings.has(g);
                  return (
                    <button
                      key={g}
                      onClick={() => toggleGlazing(g)}
                      className={`px-3.5 py-2 rounded-full text-[13px] font-semibold transition-all border ${
                        active
                          ? "bg-[#1a1408] text-[#cfbb96] border-[#1a1408]"
                          : "bg-black/5 text-[#1a1408]/75 border-black/10 active:bg-black/10"
                      }`}
                    >
                      {g}
                    </button>
                  );
                })}
              </div>
            </section>
          </>
        )}
      </div>

      {/* Sticky footer */}
      <div
        className="shrink-0 border-t border-black/15 px-5 pt-3 flex items-center gap-2"
        style={{
          background: goldGradient,
          paddingBottom: "calc(env(safe-area-inset-bottom, 0px) + 12px)",
        }}
      >
        <button
          onClick={onReset}
          disabled={activeCount === 0}
          className="h-12 px-5 rounded-xl text-[12px] font-bold uppercase tracking-[0.12em] text-[#1a1408] bg-black/10 border border-black/10 disabled:opacity-40 active:bg-black/15 transition-colors"
        >
          Сбросить
        </button>
        <button
          onClick={onClose}
          className="flex-1 h-12 rounded-xl bg-[#1a1408] text-white text-[13px] font-bold uppercase tracking-[0.15em] active:scale-[0.98] transition-transform"
        >
          Показать {resultsCount}
        </button>
      </div>
      </div>
    </div>
  );

  return createPortal(node, document.body);
}
