import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts } from "@/hooks/useStorefrontData";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Ruler, Palette, Eye, ShoppingCart, Check } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";

export default function StorefrontProduct() {
  const { slug, productSlug } = useParams<{ slug: string; productSlug: string }>();
  const { data: site, isLoading: siteLoading } = useSiteBySlug(slug);
  const { data: products = [], isLoading: productsLoading } = useStorefrontProducts(site?.id);

  const product = (products as any[]).find((p) => p.slug === productSlug);

  const [currentImage, setCurrentImage] = useState(0);



  const images = product?.product_images
    ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)) || [];

  const specs = product?.specifications as Record<string, any> | null;

  // Similar products — same category, excluding current
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
            <Link
              to={`/store/${slug}`}
              className="text-[11px] uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              Главная
            </Link>
            <span className="text-storefront-muted/30 text-xs">/</span>
            <Link
              to={`/store/${slug}/catalog`}
              className="text-[11px] uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              Каталог
            </Link>
            <span className="text-storefront-muted/30 text-xs">/</span>
            <span className="text-[11px] uppercase tracking-[0.15em] text-storefront-gold/80">{product.name}</span>
          </motion.div>

          {/* ===== MAIN: GALLERY + INFO ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-14">

            {/* Gallery */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="relative aspect-[3/4] bg-[#0c0e14] overflow-hidden group rounded-sm">
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
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-storefront-muted/15 text-9xl font-bold">B</span>
                    </div>
                  )}
                </AnimatePresence>

                {images.length > 1 && (
                  <>
                    <button
                      onClick={prevImage}
                      className="absolute left-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#07090d]/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-storefront-gold hover:text-[#07090d] text-storefront-text"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={nextImage}
                      className="absolute right-3 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#07090d]/70 backdrop-blur-sm flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-storefront-gold hover:text-[#07090d] text-storefront-text"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>

                    {/* Image counter */}
                    <div className="absolute bottom-4 right-4 bg-[#07090d]/60 backdrop-blur-sm px-3 py-1.5 text-[10px] text-storefront-text/70 tracking-wider">
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
                      className={`relative flex-1 aspect-square max-w-[80px] overflow-hidden bg-[#0c0e14] rounded-sm transition-all duration-300 ${
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

              {product.rrp && (
                <div className="flex items-baseline gap-2 mb-6">
                  <span className="text-[11px] uppercase tracking-widest text-storefront-muted">от</span>
                  <span className="text-3xl font-bold text-storefront-text" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {Number(product.rrp).toLocaleString("ru-RU")}
                  </span>
                  <span className="text-xl text-storefront-gold">₽</span>
                </div>
              )}

              {product.description && (
                <p className="text-[15px] text-storefront-muted leading-relaxed mb-8 max-w-[520px]">
                  {product.description}
                </p>
              )}

              {/* ===== SPECS — GLASSMORPHISM CARDS WITH GLOW ===== */}
              {specs && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
                  {specs.color && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.25, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="group relative overflow-hidden rounded-2xl p-5 cursor-default backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(207,187,150,0.15)]"
                      style={{
                        background: "linear-gradient(135deg, rgba(207,187,150,0.10) 0%, rgba(255,255,255,0.02) 100%)",
                        border: "1px solid rgba(207,187,150,0.12)",
                      }}
                    >
                      {/* Glow orb on hover */}
                      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-storefront-gold/0 group-hover:bg-storefront-gold/10 blur-2xl transition-all duration-700" />
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-storefront-gold/[0.06] flex items-center justify-center group-hover:bg-storefront-gold/[0.12] transition-colors duration-500">
                        <Palette className="w-5 h-5 text-storefront-gold/40 group-hover:text-storefront-gold/70 transition-colors duration-500" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-gold/50 block mb-2">Цвет покрытия</span>
                      <span className="text-lg font-semibold text-storefront-text group-hover:text-white transition-colors duration-300">{specs.color}</span>
                    </motion.div>
                  )}

                  {specs.glazing && (
                    <motion.div
                      initial={{ opacity: 0, y: 20, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{ delay: 0.35, duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.03, y: -2 }}
                      className="group relative overflow-hidden rounded-2xl p-5 cursor-default backdrop-blur-md transition-shadow duration-500 hover:shadow-[0_0_40px_rgba(207,187,150,0.15)]"
                      style={{
                        background: "linear-gradient(135deg, rgba(207,187,150,0.10) 0%, rgba(255,255,255,0.02) 100%)",
                        border: "1px solid rgba(207,187,150,0.12)",
                      }}
                    >
                      <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-storefront-gold/0 group-hover:bg-storefront-gold/10 blur-2xl transition-all duration-700" />
                      <div className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-storefront-gold/[0.06] flex items-center justify-center group-hover:bg-storefront-gold/[0.12] transition-colors duration-500">
                        <Eye className="w-5 h-5 text-storefront-gold/40 group-hover:text-storefront-gold/70 transition-colors duration-500" />
                      </div>
                      <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-gold/50 block mb-2">Остекление</span>
                      <span className="text-lg font-semibold text-storefront-text group-hover:text-white transition-colors duration-300">{specs.glazing}</span>
                    </motion.div>
                  )}
                </div>
              )}

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

                  <div
                    className="rounded-xl overflow-hidden"
                    style={{
                      background: "linear-gradient(180deg, rgba(207,187,150,0.06) 0%, rgba(207,187,150,0.01) 100%)",
                      border: "1px solid rgba(207,187,150,0.1)",
                    }}
                  >
                    {/* Height sizes */}
                    {heightSizes && heightSizes.length > 0 && (
                      <div className="px-5 py-4 border-b border-white/5">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-muted block mb-3">Высота, мм</span>
                        <div className="flex flex-wrap gap-2">
                          {heightSizes.map((s, i) => (
                            <span
                              key={`h-${i}`}
                              className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[14px] font-medium text-storefront-text hover:border-storefront-gold/30 transition-colors"
                            >
                              {s.h_from}—{s.h_to}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Width sizes */}
                    {widthSizes && widthSizes.length > 0 && (
                      <div className="px-5 py-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-muted block mb-3">Ширина, мм</span>
                        <div className="flex flex-wrap gap-2">
                          {widthSizes.map((s, i) => (
                            <span
                              key={`w-${i}`}
                              className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-lg text-[14px] font-medium text-storefront-text hover:border-storefront-gold/30 transition-colors"
                            >
                              {s.w_from}—{s.w_to}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ===== ADD TO CART ===== */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-auto pt-6"
              >
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
                  {/* Shimmer */}
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
                    <motion.div
                      key={p.id}
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.65 + i * 0.05 }}
                    >
                      <Link
                        to={`/store/${slug}/product/${p.slug}`}
                        className="group block"
                        onClick={() => { setCurrentImage(0); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >
                        <div className="relative overflow-hidden bg-[#0c0e14] flex items-center justify-center rounded-sm" style={{ minHeight: "250px" }}>
                          {img ? (
                            <img
                              src={img}
                              alt={p.name}
                              loading="lazy"
                              className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-storefront-muted/15 text-5xl font-bold">B</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-3">
                          <h3 className="text-xs font-semibold text-storefront-text uppercase tracking-wider leading-snug mb-1 line-clamp-2">
                            {p.name}
                          </h3>
                          {p.rrp && (
                            <p className="text-sm font-medium text-storefront-text">
                              {Number(p.rrp).toLocaleString("ru-RU")} ₽
                            </p>
                          )}
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
            <Link
              to={`/store/${slug}/catalog`}
              className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
