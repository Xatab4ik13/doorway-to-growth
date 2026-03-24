import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import brandoorsLogo from "@/assets/logo.png";
import heroSlide1 from "@/assets/hero-slide-1.jpg";
import heroSlide2 from "@/assets/hero-slide-2.jpg";
import heroSlide3 from "@/assets/hero-slide-3.jpg";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const SLIDES = [
  {
    image: heroSlide1,
    title: "ESTETICA",
    subtitle: "Современный минимализм",
    description: "Гладкое однотонное покрытие, скрытый короб Invisible, итальянский замок AGB 2.0.",
  },
  {
    image: heroSlide2,
    title: "GHOST",
    subtitle: "Невидимая интеграция",
    description: "Двери под покраску с коробом INVISIBLE. Монтаж в одной плоскости со стеной.",
  },
  {
    image: heroSlide3,
    title: "PRIME",
    subtitle: "Неоклассика без компромиссов",
    description: "Царговые двери с эмалевым покрытием Renolit. Неоклассический стиль.",
  },
];

/* Clip-path based reveal transition — dramatic diagonal wipe with parallax */
const EASE_OUT: [number, number, number, number] = [0.76, 0, 0.24, 1];
const EASE_SMOOTH: [number, number, number, number] = [0.22, 1, 0.36, 1];

const slideVariants = {
  enter: (direction: number) => ({
    clipPath: direction > 0
      ? "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)"
      : "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)",
    scale: 1.15,
    filter: "brightness(0.3)",
  }),
  center: {
    clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
    scale: 1,
    filter: "brightness(1)",
    transition: {
      clipPath: { duration: 1.2, ease: EASE_OUT },
      scale: { duration: 1.8, ease: EASE_SMOOTH },
      filter: { duration: 1.4, ease: "easeOut" as const },
    },
  },
  exit: (direction: number) => ({
    clipPath: direction > 0
      ? "polygon(0% 0%, 0% 0%, 0% 100%, 0% 100%)"
      : "polygon(100% 0%, 100% 0%, 100% 100%, 100% 100%)",
    scale: 1.08,
    filter: "brightness(0.2)",
    transition: {
      clipPath: { duration: 1.2, ease: EASE_OUT },
      scale: { duration: 1.2, ease: EASE_SMOOTH },
      filter: { duration: 0.8, ease: "easeIn" as const },
    },
  }),
};

const textVariants = {
  enter: { opacity: 0, y: 80, filter: "blur(20px)" },
  center: {
    opacity: 1, y: 0, filter: "blur(0px)",
    transition: { duration: 1, ease: EASE_SMOOTH, delay: 0.6 },
  },
  exit: {
    opacity: 0, y: -60, filter: "blur(15px)",
    transition: { duration: 0.6, ease: EASE_OUT },
  },
};

const lineVariants = {
  enter: { scaleX: 0, opacity: 0 },
  center: {
    scaleX: 1, opacity: 1,
    transition: { duration: 0.8, ease: EASE_SMOOTH, delay: 0.8 },
  },
  exit: { scaleX: 0, opacity: 0, transition: { duration: 0.4 } },
};

export function HeroSection({ site, banners }: Props) {
  const [[active, direction], setActive] = useState([0, 0]);
  const timerRef = useRef<ReturnType<typeof setInterval>>();
  const slide = SLIDES[active];

  const startTimer = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setActive(([prev]) => [(prev + 1) % SLIDES.length, 1]);
    }, 7000);
  }, []);

  useEffect(() => {
    startTimer();
    return () => clearInterval(timerRef.current);
  }, [startTimer]);

  const goTo = useCallback((i: number) => {
    setActive(([prev]) => [i, i > prev ? 1 : -1]);
    startTimer();
  }, [startTimer]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goTo((active + 1) % SLIDES.length);
      if (e.key === "ArrowLeft") goTo((active - 1 + SLIDES.length) % SLIDES.length);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [active, goTo]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg">

      {/* Phone number — right side, on dark background */}
      {site.phone && (
        <div className="absolute top-0 right-0 z-40 hidden lg:flex items-center h-[56px] pr-10 xl:pr-14">
          <a
            href={`tel:${site.phone}`}
            className="flex items-center gap-2.5 font-medium text-storefront-gold hover:text-storefront-gold-light transition-colors duration-300"
            style={{ fontFamily: "'Raleway', sans-serif", fontSize: "15px", textShadow: "0 1px 4px rgba(0,0,0,0.5)" }}
          >
            <svg viewBox="0 0 24 24" className="w-4 h-4 fill-current">
              <path d="M6.62 10.79a15.05 15.05 0 006.59 6.59l2.2-2.2a1 1 0 011.01-.24 11.36 11.36 0 003.58.57 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1 11.36 11.36 0 00.57 3.58 1 1 0 01-.25 1.02l-2.2 2.19z" />
            </svg>
            {site.phone}
          </a>
        </div>
      )}

      {/* === FULLSCREEN SLIDES with clip-path transition === */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.div
          key={active}
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          className="absolute inset-0 z-0"
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="absolute inset-0 w-full h-full object-cover"
            width={1920}
            height={1080}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-storefront-bg/90 via-storefront-bg/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-storefront-bg/70 via-transparent to-storefront-bg/30" />
        </motion.div>
      </AnimatePresence>

      {/* === UNIFIED GOLD SHAPE: sidebar + nav tab as ONE figure === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-20 hidden lg:block"
        style={{ width: "820px" }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {/* Single SVG shape */}
        <svg
          className="absolute inset-0 w-full h-full"
          viewBox="0 0 820 900"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id="sidebarGold" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#cfbb96" />
              <stop offset="10%" stopColor="#c2b08c" />
              <stop offset="25%" stopColor="#b2a07c" />
              <stop offset="40%" stopColor="#a59370" />
              <stop offset="55%" stopColor="#9a8a69" />
              <stop offset="70%" stopColor="#887555" />
              <stop offset="85%" stopColor="#78674b" />
              <stop offset="100%" stopColor="#6e5f40" />
            </linearGradient>
          </defs>
          {/* L-shaped path: top nav tab (full width 780) flows into sidebar (260 wide) 
              with smooth inner curve at junction */}
          <path
            d={`
              M 0 0
              L 780 0
              L 780 16
              Q 780 56, 740 56
              L 308 56
              Q 260 56, 260 104
              L 260 852
              Q 260 900, 212 900
              L 0 900
              Z
            `}
            fill="url(#sidebarGold)"
          />
        </svg>

        {/* Nav links in top tab */}
        <div className="absolute top-0 left-[280px] h-[56px] flex items-center gap-8 xl:gap-10">
          {[
            { label: "Каталог", href: "#catalog" },
            { label: "Акции", href: "#promotions" },
            { label: "О салоне", href: "#about" },
            { label: "Контакты", href: "#contacts" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="text-[14px] font-semibold uppercase tracking-[0.25em] transition-colors duration-300"
              style={{ fontFamily: "'Raleway', sans-serif", color: "rgba(26,20,8,0.6)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(26,20,8,0.95)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.color = "rgba(26,20,8,0.6)"; }}
            >
              {item.label}
            </a>
          ))}
        </div>

        {/* Room counter */}
        <div className="absolute left-0 w-[260px] flex flex-col items-center gap-1 top-[80px]">
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
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Logo rotated */}
        <div className="absolute left-0 w-[260px] top-1/2 -translate-y-1/2 flex items-center justify-center">
          <img
            src={brandoorsLogo}
            alt="Brandoors"
            style={{ filter: "brightness(0)", opacity: 0.8, transform: "rotate(-90deg)", width: "auto", height: "82px" }}
          />
        </div>

        {/* Social links */}
        <div className="absolute left-0 w-[260px] bottom-10 flex flex-col items-center gap-3">
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


      {/* === NAVIGATION DOTS — right side === */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        {SLIDES.map((s, i) => (
          <button
            key={i}
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
              {s.title}
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
          {SLIDES.map((_, i) => (
            <div key={i} className="flex-1 h-[2px] bg-white/10 overflow-hidden cursor-pointer" onClick={() => goTo(i)}>
              {i === active && (
                <motion.div
                  className="h-full bg-storefront-gold"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 7, ease: "linear" }}
                  key={`progress-${active}`}
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
