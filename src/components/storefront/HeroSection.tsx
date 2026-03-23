import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroDefault from "@/assets/hero-showroom.jpg";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const SLIDES = [
  {
    title: "МЕЖКОМНАТНЫЕ\nДВЕРИ",
    subtitle: "Салон дверей нового поколения — пространство, в котором дизайн, качество и комфорт объединяются в каждой детали.",
  },
  {
    title: "ПРЕМИУМ\nКОЛЛЕКЦИЯ",
    subtitle: "Эксклюзивные модели из натуральных материалов. Итальянский дизайн, российское производство.",
  },
  {
    title: "ИНДИВИДУАЛЬНЫЙ\nПОДХОД",
    subtitle: "Персональная консультация, 3D-визуализация, профессиональный замер и установка под ключ.",
  },
];

export function HeroSection({ site, banners }: Props) {
  const [current, setCurrent] = useState(0);
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);

  const heroImage = banners[0]?.image_url || heroDefault;
  const slide = SLIDES[current] || SLIDES[0];

  const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      setMouseX((e.clientX / window.innerWidth - 0.5) * 2);
      setMouseY((e.clientY / window.innerHeight - 0.5) * 2);
    };
    window.addEventListener("mousemove", handler);
    return () => window.removeEventListener("mousemove", handler);
  }, []);

  return (
    <section className="relative h-screen min-h-[750px] bg-[#0a0a0a] overflow-hidden select-none">

      {/* === HERO IMAGE — large, visible, with subtle parallax === */}
      <motion.div
        className="absolute inset-0 lg:left-16"
        style={{ x: mouseX * -6, y: mouseY * -6, scale: 1.04 }}
        transition={{ type: "tween", duration: 0.8, ease: "easeOut" }}
      >
        <img src={heroImage} alt="Салон дверей" className="w-full h-full object-cover" width={1920} height={1080} />
        {/* Light darken — keep image visible */}
        <div className="absolute inset-0 bg-[#0a0a0a]/20" />
      </motion.div>

      {/* === BRANDOORS GEOMETRIC PATTERN — exact checkerboard: circles + quarter-arcs === */}
      <motion.div
        className="absolute inset-0 z-[2] pointer-events-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2.5, delay: 0.2 }}
      >
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            {/* One tile = 2x2 cells. Cell size = 90px. Tile = 180x180 */}
            <pattern id="brandoors-pattern" x="0" y="0" width="180" height="180" patternUnits="userSpaceOnUse">
              {/* Grid lines — all 3 internal + borders */}
              <line x1="0" y1="0" x2="180" y2="0" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
              <line x1="0" y1="90" x2="180" y2="90" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
              <line x1="0" y1="180" x2="180" y2="180" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
              <line x1="0" y1="0" x2="0" y2="180" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
              <line x1="90" y1="0" x2="90" y2="180" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />
              <line x1="180" y1="0" x2="180" y2="180" stroke="rgba(255,255,255,0.07)" strokeWidth="0.5" />

              {/* Cell [0,0] — quarter arcs from all 4 corners */}
              <path d="M 0,0 A 42,42 0 0,1 42,0" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" transform="translate(0,0) rotate(90,0,0)" />
              <path d="M 45,0 A 45,45 0 0,1 90,45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d="M 90,45 A 45,45 0 0,1 45,90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d="M 0,45 A 45,45 0 0,0 45,0" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d="M 45,90 A 45,45 0 0,0 0,45" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Cell [1,0] — full circle */}
              <circle cx="135" cy="45" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Cell [0,1] — full circle */}
              <circle cx="45" cy="135" r="42" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

              {/* Cell [1,1] — quarter arcs from all 4 corners */}
              <path d="M 135,90 A 45,45 0 0,1 180,135" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d="M 180,135 A 45,45 0 0,1 135,180" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d="M 90,135 A 45,45 0 0,0 135,90" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
              <path d="M 135,180 A 45,45 0 0,0 90,135" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#brandoors-pattern)" />
        </svg>

        {/* Diagonal glow: bright top-right, fading to bottom-left */}
        <div
          className="absolute inset-0"
          style={{
            background: "radial-gradient(ellipse at 95% 5%, rgba(197,165,114,0.15) 0%, rgba(197,165,114,0.06) 25%, transparent 60%)",
          }}
        />
      </motion.div>

      {/* === ANIMATED GLOW PULSE — top-right corner === */}
      <motion.div
        className="absolute inset-0 z-[3] pointer-events-none"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      >
        <div
          className="absolute"
          style={{
            top: "-10%", right: "-10%", width: "70%", height: "70%",
            background: "radial-gradient(ellipse at center, rgba(197,165,114,0.08) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </motion.div>

      {/* === CONTENT AREA — bottom with semi-transparent backdrop === */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-[5]"
        initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
        animate={{ clipPath: "polygon(0 55%, 60% 42%, 100% 50%, 100% 100%, 0 100%)" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
      >
        <div className="absolute inset-0 bg-[#0a0a0a]/85 backdrop-blur-sm" />
      </motion.div>

      {/* Mobile gradient */}
      <div className="absolute bottom-0 left-0 right-0 h-[55%] z-[5] lg:hidden bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/80 to-transparent" />

      {/* === LEFT SIDEBAR === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-16 z-20 hidden lg:flex flex-col items-center justify-between py-8 bg-[#0a0a0a]/85 backdrop-blur-sm border-r border-white/[0.03]"
        initial={{ x: -64 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        <div className="flex flex-col items-center gap-1 mt-16">
          <AnimatePresence mode="wait">
            <motion.span
              key={current}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold text-storefront-text"
            >
              {String(current + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs text-storefront-muted/50">/ {String(SLIDES.length).padStart(2, "0")}</span>
        </div>
        <span className="text-[10px] tracking-[0.35em] uppercase text-storefront-muted/20 font-light" style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}>
          BRANDOORS
        </span>
        <div className="flex flex-col gap-3 mb-4">
          {["Ig", "Vk", "Tg"].map((s) => (
            <span key={s} className="w-6 h-6 flex items-center justify-center text-[8px] text-storefront-muted/30 border border-white/[0.04] hover:text-storefront-gold hover:border-storefront-gold/30 transition-all duration-300 cursor-pointer">
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      {/* === SLIDE ARROWS === */}
      <motion.div
        className="absolute left-20 lg:left-28 z-20"
        style={{ top: "42%" }}
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
      >
        <div className="flex items-center gap-5">
          <button onClick={prev} className="group flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-storefront-muted/60 hover:text-storefront-gold transition-colors duration-300">
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="hidden sm:inline">Prev</span>
          </button>
          <div className="w-8 h-[1px] bg-white/10" />
          <button onClick={next} className="group flex items-center gap-1.5 text-xs uppercase tracking-[0.15em] text-storefront-muted/60 hover:text-storefront-gold transition-colors duration-300">
            <span className="hidden sm:inline">Next</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>
      </motion.div>

      {/* === MAIN TEXT CONTENT === */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:pl-28 lg:pr-16 pb-14 lg:pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="lg:ml-[20%] max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div key={current}>
                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-5xl lg:text-[60px] font-bold leading-[1.02] tracking-tight text-storefront-text whitespace-pre-line"
                >
                  {slide.title}
                </motion.h1>
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="mt-5 text-sm sm:text-[15px] text-storefront-muted/70 leading-relaxed max-w-md"
                >
                  {slide.subtitle}
                </motion.p>
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                  <a href="#catalog" className="group inline-flex items-center gap-3 mt-8 px-9 py-3.5 border border-storefront-gold/60 text-storefront-gold text-[11px] uppercase tracking-[0.25em] hover:bg-storefront-gold hover:text-[#0a0a0a] transition-all duration-500">
                    Смотреть каталог
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* === Top nav === */}
      <motion.div
        className="absolute top-0 left-16 right-0 z-40 hidden md:flex items-center justify-between px-6 lg:px-12 h-16"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        {site.phone && <span className="text-[11px] text-white/30 tracking-wider font-light">{site.phone}</span>}
        <nav className="flex items-center gap-8">
          {[{ l: "Каталог", h: "#catalog" }, { l: "О салоне", h: "#about" }, { l: "Контакты", h: "#contacts" }].map(({ l, h }) => (
            <a key={l} href={h} className="text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-storefront-gold transition-colors duration-300">{l}</a>
          ))}
        </nav>
      </motion.div>

      {/* Mobile dots */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 lg:hidden">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`h-[2px] transition-all duration-500 ${i === current ? "w-8 bg-storefront-gold" : "w-4 bg-white/20"}`} />
        ))}
      </div>
    </section>
  );
}
