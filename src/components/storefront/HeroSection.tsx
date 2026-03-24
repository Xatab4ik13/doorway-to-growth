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
          {/* Gradient overlays for text readability */}
          <div className="absolute inset-0 bg-gradient-to-r from-storefront-bg/90 via-storefront-bg/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-storefront-bg/70 via-transparent to-storefront-bg/30" />
        </motion.div>
      </AnimatePresence>

      {/* === GOLD SIDEBAR === */}
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
            / {String(SLIDES.length).padStart(2, "0")}
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

      {/* === MAIN TEXT CONTENT === */}
      <div className="absolute inset-0 z-10 lg:pl-[260px] flex items-center">
        <div className="w-full h-full flex items-center px-8 lg:px-16 xl:px-24">
          <div className="max-w-xl">
            {/* Label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${active}`}
                variants={lineVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="mb-6 origin-left"
              >
                <div className="flex items-center gap-4">
                  <div className="h-px w-[60px] bg-storefront-gold" />
                  <span className="text-xs tracking-[0.4em] uppercase text-storefront-gold"
                    style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 500 }}>
                    Коллекция
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Title */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`title-${active}`}
                variants={textVariants}
                initial="enter"
                animate="center"
                exit="exit"
                className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.9] mb-4 text-storefront-text"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {slide.title}
              </motion.h1>
            </AnimatePresence>

            {/* Subtitle */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`sub-${active}`}
                initial={{ opacity: 0, y: 40, filter: "blur(12px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.9, delay: 0.75, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, y: -30, filter: "blur(10px)", transition: { duration: 0.5 } }}
                className="text-xl md:text-2xl font-light leading-tight mb-4 text-storefront-gold-light"
                style={{ fontFamily: "'Cormorant Garamond', serif" }}
              >
                {slide.subtitle}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${active}`}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, delay: 0.9, ease: [0.22, 1, 0.36, 1] } }}
                exit={{ opacity: 0, y: -20, transition: { duration: 0.4 } }}
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
