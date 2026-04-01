import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts } from "@/hooks/useStorefrontData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Ruler, ShoppingCart, Check, Plus, DoorOpen, Lock, CircleDot } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";

// ── Mock data for swatches (will be replaced with DB data later) ──
const MOCK_COLORS: { name: string; hex: string }[] = [
  { name: "Аляска", hex: "#F5F0E8" },
  { name: "Магнолия", hex: "#F0E6D4" },
  { name: "Манхэттен", hex: "#B8AFA4" },
  { name: "Deep Blue", hex: "#1B3A5C" },
  { name: "Deep Green", hex: "#2A4A3E" },
  { name: "Антрацит", hex: "#3A3A3A" },
  { name: "Силк грей", hex: "#9E9A94" },
  { name: "Милк", hex: "#FEFCF5" },
];

const MOCK_GLAZING: { name: string; preview: string }[] = [
  { name: "Без остекления", preview: "none" },
  { name: "Черный лакобель", preview: "#1A1A1A" },
  { name: "Белый лакобель", preview: "#F5F5F5" },
  { name: "Матовое", preview: "#D4D4D4" },
  { name: "Зеркало", preview: "linear-gradient(135deg, #C0C0C0, #E8E8E8, #A0A0A0)" },
];

const MOCK_EDGE_COLORS: { name: string; hex: string }[] = [
  { name: "Анодированная AL", hex: "#C0C0C0" },
  { name: "Al White", hex: "#F0F0F0" },
  { name: "Black Edition", hex: "#1A1A1A" },
  { name: "Gold Edition", hex: "#C9A96E" },
];

const MOCK_MOLDING_COLORS: { name: string; hex: string }[] = [
  { name: "В цвет полотна", hex: "#E8E0D4" },
  { name: "Хром", hex: "#C0C0C0" },
  { name: "Золото", hex: "#C9A96E" },
  { name: "Черный", hex: "#1A1A1A" },
];

export default function StorefrontProduct() {
  const { slug: urlSlug, productSlug } = useParams<{ slug: string; productSlug: string }>();
  const slug = useSiteSlug(urlSlug);
  const { data: site, isLoading: siteLoading } = useSiteBySlug(slug);
  const { data: products = [], isLoading: productsLoading } = useStorefrontProducts(site?.id);

  const product = (products as any[]).find((p) => p.slug === productSlug);

  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedGlazing, setSelectedGlazing] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [selectedMolding, setSelectedMolding] = useState<string | null>(null);

  const primaryImg = product?.product_images?.find((i: any) => i.is_primary)?.url || product?.product_images?.[0]?.url;
  useDocumentMeta({
    title: product ? `${product.name} — Brandoors ${site?.city ?? ""}` : "Товар — Brandoors",
    description: product?.description || `Дверь ${product?.name ?? ""} от Brandoors. Характеристики, фото, цены.`,
    ogImage: primaryImg,
    ogUrl: site ? `https://${site.slug}.brandoors.su/product/${productSlug}` : undefined,
  });

  const images = product?.product_images
    ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)) || [];

  const specs = product?.specifications as Record<string, any> | null;

  // Set initial selected color/glazing from specs
  useMemo(() => {
    if (specs?.color && !selectedColor) setSelectedColor(specs.color);
    if (specs?.glazing && !selectedGlazing) setSelectedGlazing(specs.glazing);
  }, [specs]);

  const similar = useMemo(() => {
    if (!product) return [];
    return (products as any[])
      .filter((p) => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 8);
  }, [products, product]);

  const getPrimaryImage = (p: any) => {
    const primary = p.product_images?.find((i: any) => i.is_primary);
    return primary?.url || p.product_images?.[0]?.url;
  };

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const isInCart = cartItems.some((i) => i.id === product?.id);

  const handleAddToCart = () => {
    if (!product || !site) return;
    const primary = product.product_images?.find((i: any) => i.is_primary);
    const imgUrl = primary?.url || product.product_images?.[0]?.url || null;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      rrp: product.rrp ? Number(product.rrp) : null,
      imageUrl: imgUrl,
      siteId: site.id,
      type: "door",
    });
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  if (siteLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-storefront-gold/20 border-t-storefront-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!site || !product) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center text-storefront-text">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Товар не найден</h1>
          <Link to={`/store/${slug}/catalog`} className="text-storefront-gold hover:opacity-80 transition-opacity">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const sizes = specs?.sizes as Array<{ h_from?: number; h_to?: number; w_from?: number; w_to?: number }> | undefined;
  const heightSizes = sizes?.filter(s => s.h_from !== undefined);
  const widthSizes = sizes?.filter(s => s.w_from !== undefined);

  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-14 md:pt-0 bg-[#07090d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-14">

          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-2 mb-8"
          >
            <Link to={`/store/${slug}`} className="text-[11px] uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors">
              Главная
            </Link>
            <span className="text-storefront-muted/30 text-xs">/</span>
            <Link to={`/store/${slug}/catalog`} className="text-[11px] uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors">
              Каталог
            </Link>
            <span className="text-storefront-muted/30 text-xs">/</span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-storefront-gold/80">{product.name}</span>
          </motion.div>

          {/* ===== MAIN: GALLERY + INFO ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-[360px_1fr] gap-8 lg:gap-14">

            {/* Gallery — compact, fits in viewport */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="lg:sticky lg:top-24 lg:self-start"
            >
              <div className="relative aspect-[3/4] max-h-[55vh] bg-[#0c0e14] overflow-hidden group rounded-2xl mx-auto">
                <AnimatePresence mode="wait">
                  {images.length > 0 ? (
                    <motion.img
                      key={currentImage}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4 }}
                      src={images[currentImage]?.url}
                      alt={images[currentImage]?.alt || product.name}
                      className="w-full h-full object-contain p-4"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-storefront-muted/15 text-9xl font-bold">B</span>
                    </div>
                  )}
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#07090d]/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-storefront-gold hover:text-[#07090d] text-storefront-text">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-[#07090d]/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-storefront-gold hover:text-[#07090d] text-storefront-text">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 right-3 bg-[#07090d]/60 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-storefront-text/70 tracking-wider">
                      {currentImage + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-3">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`relative flex-1 aspect-square max-w-[70px] overflow-hidden bg-[#0c0e14] rounded-xl transition-all duration-300 ${
                        idx === currentImage
                          ? "ring-2 ring-storefront-gold ring-offset-2 ring-offset-[#07090d]"
                          : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="flex flex-col"
            >
              {/* Category badge */}
              {product.categories && (
                <span className="inline-block text-[10px] uppercase tracking-[0.25em] text-storefront-gold/80 bg-storefront-gold/5 border border-storefront-gold/15 px-4 py-1.5 rounded-full mb-4 w-fit">
                  {(product.categories as any)?.name}
                </span>
              )}

              <h1 className="text-3xl sm:text-4xl lg:text-[42px] font-bold text-storefront-text uppercase tracking-wide leading-tight mb-5">
                {product.name}
              </h1>

              {product.description && (
                <p className="text-[15px] text-storefront-muted leading-relaxed mb-6 max-w-[520px]">
                  {product.description}
                </p>
              )}

              {/* ===== COLOR SWATCHES ===== */}
              <div className="space-y-5 mb-8">
                {/* Coating color */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Цвет покрытия:</span>
                    <span className="text-[12px] text-storefront-gold/80">{selectedColor || "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedColor(c.name)}
                        title={c.name}
                        className={`group relative w-11 h-11 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                          selectedColor === c.name
                            ? "border-storefront-gold shadow-[0_0_12px_rgba(207,187,150,0.3)]"
                            : "border-white/10 hover:border-white/25"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedColor === c.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-4 h-4" style={{ color: c.hex === "#1A1A1A" || c.hex === "#3A3A3A" || c.hex === "#2A4A3E" || c.hex === "#1B3A5C" ? "#fff" : "#1A1A1A" }} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Glazing */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Остекление:</span>
                    <span className="text-[12px] text-storefront-gold/80">{selectedGlazing || "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_GLAZING.map((g) => (
                      <button
                        key={g.name}
                        onClick={() => setSelectedGlazing(g.name)}
                        title={g.name}
                        className={`relative w-11 h-11 rounded-xl border-2 transition-all duration-200 hover:scale-110 overflow-hidden ${
                          selectedGlazing === g.name
                            ? "border-storefront-gold shadow-[0_0_12px_rgba(207,187,150,0.3)]"
                            : "border-white/10 hover:border-white/25"
                        }`}
                      >
                        {g.preview === "none" ? (
                          <div className="w-full h-full bg-[#0c0e14] flex items-center justify-center">
                            <div className="w-6 h-[1px] bg-white/20 rotate-45" />
                          </div>
                        ) : g.preview.startsWith("linear") ? (
                          <div className="w-full h-full" style={{ background: g.preview }} />
                        ) : (
                          <div className="w-full h-full" style={{ backgroundColor: g.preview }} />
                        )}
                        {selectedGlazing === g.name && (
                          <div className="absolute inset-0 flex items-center justify-center bg-black/20">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Edge color */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Цвет кромки:</span>
                    <span className="text-[12px] text-storefront-gold/80">{selectedEdge || "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_EDGE_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedEdge(c.name)}
                        title={c.name}
                        className={`relative w-11 h-11 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                          selectedEdge === c.name
                            ? "border-storefront-gold shadow-[0_0_12px_rgba(207,187,150,0.3)]"
                            : "border-white/10 hover:border-white/25"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedEdge === c.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-4 h-4" style={{ color: c.hex === "#1A1A1A" ? "#fff" : "#1A1A1A" }} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Molding color */}
                <div>
                  <div className="flex items-center gap-2 mb-3">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Цвет молдингов:</span>
                    <span className="text-[12px] text-storefront-gold/80">{selectedMolding || "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {MOCK_MOLDING_COLORS.map((c) => (
                      <button
                        key={c.name}
                        onClick={() => setSelectedMolding(c.name)}
                        title={c.name}
                        className={`relative w-11 h-11 rounded-xl border-2 transition-all duration-200 hover:scale-110 ${
                          selectedMolding === c.name
                            ? "border-storefront-gold shadow-[0_0_12px_rgba(207,187,150,0.3)]"
                            : "border-white/10 hover:border-white/25"
                        }`}
                        style={{ backgroundColor: c.hex }}
                      >
                        {selectedMolding === c.name && (
                          <div className="absolute inset-0 flex items-center justify-center">
                            <Check className="w-4 h-4" style={{ color: c.hex === "#1A1A1A" ? "#fff" : "#1A1A1A" }} />
                          </div>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== SIZE GRID ===== */}
              {sizes && sizes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-storefront-gold/10 flex items-center justify-center">
                      <Ruler className="w-4 h-4 text-storefront-gold" />
                    </div>
                    <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text">
                      Доступные размеры
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(207,187,150,0.06) 0%, rgba(207,187,150,0.01) 100%)", border: "1px solid rgba(207,187,150,0.1)" }}>
                    {heightSizes && heightSizes.length > 0 && (
                      <div className="px-5 py-4 border-b border-white/5">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-muted block mb-3">Высота, мм</span>
                        <div className="flex flex-wrap gap-2">
                          {heightSizes.map((s, i) => (
                            <span key={`h-${i}`} className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-[14px] font-medium text-storefront-text hover:border-storefront-gold/30 transition-colors">
                              {s.h_from}—{s.h_to}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {widthSizes && widthSizes.length > 0 && (
                      <div className="px-5 py-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-muted block mb-3">Ширина, мм</span>
                        <div className="flex flex-wrap gap-2">
                          {widthSizes.map((s, i) => (
                            <span key={`w-${i}`} className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-[14px] font-medium text-storefront-text hover:border-storefront-gold/30 transition-colors">
                              {s.w_from}—{s.w_to}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ===== PRICE + ADD TO CART ===== */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-auto pt-4"
              >
                {product.rrp && (
                  <div className="flex items-baseline gap-2 mb-5">
                    <span className="text-[11px] uppercase tracking-widest text-storefront-muted">от</span>
                    <span className="text-3xl font-bold text-storefront-text" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                      {Number(product.rrp).toLocaleString("ru-RU")}
                    </span>
                    <span className="text-xl text-storefront-gold">₽</span>
                  </div>
                )}

                <motion.button
                  onClick={handleAddToCart}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.96 }}
                  className={`w-full font-bold text-[13px] uppercase tracking-wider py-4 rounded-xl transition-all flex items-center justify-center gap-3 relative overflow-hidden group ${
                    isInCart
                      ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                      : "bg-storefront-gold text-[#07090d] hover:brightness-110"
                  }`}
                >
                  {!isInCart && (
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    {isInCart ? <Check className="w-5 h-5" /> : <ShoppingCart className="w-5 h-5" />}
                    {isInCart ? "В корзине" : "Добавить в корзину"}
                  </span>
                </motion.button>
              </motion.div>
            </motion.div>
          </div>

          {/* ===== SIMILAR PRODUCTS ===== */}
          {similar.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-[1px] bg-storefront-gold/40" />
                <h2 className="text-xl sm:text-2xl font-bold text-storefront-text uppercase tracking-wide">
                  Похожие модели
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {similar.map((p: any, i: number) => {
                  const img = getPrimaryImage(p);
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.05 }}>
                      <Link
                        to={`/store/${slug}/product/${p.slug}`}
                        className="group block"
                        onClick={() => { setCurrentImage(0); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >
                        <div className="relative overflow-hidden bg-[#0c0e14] flex items-center justify-center rounded-2xl" style={{ minHeight: "250px" }}>
                          {img ? (
                            <img src={img} alt={p.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-storefront-muted/15 text-5xl font-bold">B</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-3">
                          <h3 className="text-xs font-semibold text-storefront-text uppercase tracking-wider leading-snug mb-1 line-clamp-2">{p.name}</h3>
                          {p.rrp && <p className="text-sm font-medium text-storefront-text">{Number(p.rrp).toLocaleString("ru-RU")} ₽</p>}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Back to catalog */}
          <div className="mt-14">
            <Link to={`/store/${slug}/catalog`} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-storefront-muted hover:text-storefront-gold transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
