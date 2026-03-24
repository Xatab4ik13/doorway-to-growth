import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

/* Collection metadata */
const COLLECTIONS = [
  {
    slug: "estetica",
    name: "ESTETICA",
    tagline: "Современный минимализм",
    description: "Гладкое однотонное покрытие, скрытый короб Invisible, итальянский замок AGB 2.0.",
  },
  {
    slug: "ghost",
    name: "GHOST",
    tagline: "Невидимая интеграция",
    description: "Двери под покраску с коробом INVISIBLE. Монтаж в одной плоскости со стеной.",
  },
  {
    slug: "heavy",
    name: "HEAVY",
    tagline: "Монументальная сила",
    description: "Полотно 60 мм, HPL-пластик, PET, глянец. До 3000 мм без перемычки.",
  },
  {
    slug: "prime",
    name: "PRIME",
    tagline: "Неоклассика без компромиссов",
    description: "Царговые двери с эмалевым покрытием Renolit. Неоклассический стиль.",
  },
  {
    slug: "reflect",
    name: "REFLECT",
    tagline: "Зеркало и свет",
    description: "Двери с зеркалом и лакобелью. Алюминиевые кромки: Black, Gold, White Edition.",
  },
];

/* Fetch one hero image per category from the database */
function useCollectionHeroImages() {
  return useQuery({
    queryKey: ["collection-hero-images"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("category_id, categories(slug), product_images(url, is_primary, sort_order)")
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;

      // Group by category slug, pick first product that has an image
      const bySlug: Record<string, string> = {};
      for (const p of data ?? []) {
        const slug = (p.categories as any)?.slug;
        if (!slug || bySlug[slug]) continue;
        const imgs = (p.product_images as any[]) ?? [];
        const primary = imgs.find((i: any) => i.is_primary);
        const url = primary?.url ?? imgs[0]?.url;
        if (url) bySlug[slug] = url;
      }
      return bySlug;
    },
    staleTime: 60_000,
  });
}

export function HeroSection({ site, banners }: Props) {
  const [active, setActive] = useState(0);
  const { data: heroImages = {} } = useCollectionHeroImages();
  const timerRef = useRef<ReturnType<typeof setInterval>>();

  // Only show collections that have images
  const slides = useMemo(() => {
    const result = COLLECTIONS.filter((c) => heroImages[c.slug]);
    return result.length > 0 ? result : COLLECTIONS; // fallback to all if no images yet
  }, [heroImages]);

  const slide = slides[active % slides.length];
  const imageUrl = heroImages[slide.slug];

  // Auto-advance
  useEffect(() => {
    timerRef.current = setInterval(() => {
      setActive((r) => (r + 1) % slides.length);
    }, 6000);
    return () => clearInterval(timerRef.current);
  }, [slides.length]);

  // Reset timer on manual navigation
  const goTo = useCallback((i: number) => {
    setActive(i);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive((r) => (r + 1) % slides.length);
    }, 6000);
  }, [slides.length]);

  // Keyboard
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo((active + 1) % slides.length);
      if (e.key === "ArrowLeft") goTo((active - 1 + slides.length) % slides.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, slides.length, goTo]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg">

      {/* === FULLSCREEN PHOTO BACKGROUND === */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`bg-${active}`}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
        >
          {imageUrl ? (
            <motion.img
              src={imageUrl}
              alt={slide.name}
              className="absolute inset-0 w-full h-full object-contain"
              style={{ objectPosition: "center 40%" }}
              initial={{ scale: 1.05 }}
              animate={{ scale: 1 }}
              transition={{ duration: 8, ease: "linear" }}
            />
          ) : (
            <div className="absolute inset-0 bg-storefront-bg" />
          )}

          {/* Dark overlay for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-storefront-bg/95 via-storefront-bg/60 to-storefront-bg/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-storefront-bg/80 via-transparent to-storefront-bg/40" />
        </motion.div>
      </AnimatePresence>

      {/* === LEFT SIDEBAR — gold metallic panel === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-20 hidden lg:flex flex-col items-center justify-between py-10 overflow-hidden"
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #cfbb96 0%, #c2b08c 10%, #b2a07c 25%, #a59370 40%, #9a8a69 55%, #887555 70%, #78674b 85%, #6e5f40 100%)",
          borderRadius: "0 48px 48px 0",
        }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {/* Room counter */}
        <div className="flex flex-col items-center gap-1 mt-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.span
              key={active}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold"
              style={{ color: "#1a1408" }}
            >
              {String(active + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs" style={{ color: "rgba(26,20,8,0.35)" }}>
            / {String(slides.length).padStart(2, "0")}
          </span>
        </div>

        {/* Logo rotated */}
        <img
          src={brandoorsLogo}
          alt="Brandoors"
          className="relative z-10"
          style={{ filter: "brightness(0)", opacity: 0.8, transform: "rotate(-90deg)", width: "auto", height: "55px" }}
        />

        {/* Social links */}
        <div className="flex flex-col gap-3 mb-4 relative z-10">
          {[
            { href: "https://vk.com", icon: "M12.77 19.15h1.33s.4-.04.61-.27c.19-.2.18-.59.18-.59s-.03-1.8.81-2.07c.83-.26 1.89 1.73 3.02 2.5.85.58 1.5.45 1.5.45l3.01-.04s1.57-.1.83-1.33c-.06-.1-.44-.92-2.26-2.61-1.9-1.77-1.65-1.48.64-4.54 1.4-1.86 1.96-3 1.78-3.49-.16-.46-1.16-.34-1.16-.34l-3.39.02s-.25-.03-.44.08c-.18.11-.3.36-.3.36s-.53 1.42-1.24 2.63c-1.5 2.55-2.1 2.69-2.34 2.53-.57-.37-.43-1.52-.43-2.33 0-2.53.39-3.59-.75-3.86-.38-.09-.65-.15-1.62-.16-1.24-.01-2.29 0-2.88.29-.39.2-.7.63-.51.65.23.03.75.14 1.03.52.36.49.35 1.59.35 1.59s.2 2.98-.48 3.35c-.47.25-1.12-.26-2.5-2.6-.67-1.19-1.18-2.51-1.18-2.51s-.1-.24-.27-.37c-.22-.16-.52-.21-.52-.21l-3.22.02s-.48.01-.66.22c-.16.19-.01.58-.01.58s2.51 5.87 5.35 8.83c2.6 2.71 5.55 2.53 5.55 2.53z" },
            { href: "https://t.me", icon: "M11.94 24c6.6 0 12-5.4 12-12s-5.4-12-12-12-12 5.4-12 12 5.4 12 12 12zm-3.85-8.4l.42-3.97 7.47-6.76c.33-.3-.07-.44-.51-.18l-9.22 5.81-3.56-1.11c-.77-.24-.78-.77.16-1.14l13.9-5.36c.64-.29 1.24.15 1 1.14l-2.37 11.16c-.17.8-.65.99-1.31.62l-3.62-2.67-1.75 1.69c-.19.2-.36.36-.71.36z" },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center border transition-all duration-300"
              style={{ borderColor: "rgba(26,20,8,0.15)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.15)"; }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.5)" }}>
                <path d={s.icon} />
              </svg>
            </a>
          ))}
        </div>
      </motion.div>

      {/* === MAIN CONTENT AREA === */}
      <div className="absolute inset-0 z-10 lg:pl-[260px] flex items-center">
        <div className="w-full h-full flex items-center px-8 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            {/* Collection label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${active}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                transition={{ duration: 0.5 }}
                className="mb-6"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="h-px bg-storefront-gold"
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                  <span className="text-xs tracking-[0.4em] uppercase text-storefront-gold"
                    style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500 }}>
                    Коллекция
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Collection name */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`name-${active}`}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.9] mb-4 text-storefront-text"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {slide.name}
              </motion.h1>
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`tag-${active}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.15 }}
                className="text-xl md:text-2xl font-light leading-tight mb-4 text-storefront-gold-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {slide.tagline}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${active}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="text-sm md:text-base leading-relaxed max-w-md mb-10 text-storefront-muted"
                style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300 }}
              >
                {slide.description}
              </motion.p>
            </AnimatePresence>

            {/* CTA */}
            <motion.button
              className="group relative overflow-hidden px-8 py-3 border border-storefront-gold/40 text-sm tracking-[0.2em] uppercase text-storefront-gold transition-all duration-500"
              style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 400 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10 group-hover:text-storefront-bg transition-colors duration-500">
                Смотреть каталог
              </span>
              <motion.div
                className="absolute inset-0 bg-storefront-gold"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* === NAVIGATION DOTS — right side === */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        {slides.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => goTo(i)}
            className="group relative flex items-center justify-end gap-3"
          >
            <span
              className="text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
              style={{
                color: i === active ? "#c5a572" : "rgba(255,255,255,0.3)",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              {s.name}
            </span>
            <motion.div
              animate={{
                width: i === active ? 24 : 8,
                height: 2,
                backgroundColor: i === active ? "#c5a572" : "rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.4 }}
              style={{ borderRadius: 1 }}
            />
          </button>
        ))}
      </div>

      {/* === PROGRESS BAR — bottom === */}
      <div className="absolute bottom-0 left-0 right-0 z-30 lg:pl-[260px]">
        <div className="flex gap-1 px-8 lg:px-16 pb-6">
          {slides.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] bg-white/10 overflow-hidden cursor-pointer" onClick={() => goTo(i)}>
              {i === active && (
                <motion.div
                  className="h-full bg-storefront-gold"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 6, ease: "linear" }}
                />
              )}
              {i < active && <div className="h-full w-full bg-storefront-gold/40" />}
            </div>
          ))}
        </div>

        {/* Bottom info bar */}
        <div className="flex items-center justify-between px-8 lg:px-16 py-4 border-t border-white/5">
          <span className="text-xs tracking-[0.3em] uppercase text-white/25"
            style={{ fontFamily: "'Raleway', sans-serif" }}>
            {site?.name || "BRANDOORS"}
          </span>
          <span className="text-xs tracking-[0.2em] text-white/15"
            style={{ fontFamily: "'Raleway', sans-serif" }}>
            {site?.phone || "+7 (495) 000-00-00"}
          </span>
        </div>
      </div>

      {/* === SCROLL HINT === */}
      <motion.div
        className="absolute bottom-24 left-1/2 lg:left-[calc(260px+(100%-260px)/2)] -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-white/20"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
