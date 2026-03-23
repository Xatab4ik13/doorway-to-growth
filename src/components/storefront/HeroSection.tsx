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

  // Parallax mouse tracking
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

      {/* === HERO IMAGE with parallax === */}
      <motion.div
        className="absolute inset-0 lg:left-16"
        style={{
          x: mouseX * -8,
          y: mouseY * -8,
          scale: 1.05,
        }}
        transition={{ type: "tween", duration: 0.6, ease: "easeOut" }}
      >
        <img
          src={heroImage}
          alt="Салон дверей"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
      </motion.div>

      {/* === GEOMETRIC 3D OVERLAYS === */}
      {/* Main dark veil */}
      <div className="absolute inset-0 bg-[#0a0a0a]/30 z-[1]" />

      {/* Layer 1: Large diagonal cut — bottom right dark panel */}
      <motion.div
        className="absolute z-[2] hidden lg:block"
        initial={{ clipPath: "polygon(100% 100%, 100% 100%, 100% 100%)" }}
        animate={{ clipPath: "polygon(45% 35%, 100% 20%, 100% 100%, 25% 100%)" }}
        transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
        style={{
          inset: 0,
          background: "linear-gradient(160deg, rgba(10,10,10,0.92) 0%, rgba(10,10,10,0.98) 100%)",
        }}
      />

      {/* Layer 2: Bottom base panel */}
      <motion.div
        className="absolute z-[3] hidden lg:block"
        initial={{ clipPath: "polygon(0 100%, 100% 100%, 100% 100%, 0 100%)" }}
        animate={{ clipPath: "polygon(0 72%, 55% 58%, 100% 65%, 100% 100%, 0 100%)" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        style={{
          inset: 0,
          background: "#0a0a0a",
        }}
      />

      {/* Layer 3: Top-right triangular cut */}
      <motion.div
        className="absolute z-[2] hidden lg:block"
        initial={{ clipPath: "polygon(100% 0, 100% 0, 100% 0)" }}
        animate={{ clipPath: "polygon(62% 0, 100% 0, 100% 28%, 58% 32%)" }}
        transition={{ duration: 1.0, ease: [0.22, 1, 0.36, 1], delay: 0.5 }}
        style={{
          inset: 0,
          background: "linear-gradient(180deg, rgba(10,10,10,0.88) 0%, rgba(10,10,10,0.75) 100%)",
        }}
      />

      {/* Gold diagonal beams — animated reveal */}
      <motion.div
        className="absolute z-[4] hidden lg:block pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.8 }}
        style={{ inset: 0 }}
      >
        {/* Primary gold line */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: "52%",
            width: "1px",
            height: "120%",
            background: "linear-gradient(180deg, transparent 5%, rgba(197,165,114,0.4) 30%, rgba(197,165,114,0.15) 70%, transparent 95%)",
            transform: `rotate(15deg) translateX(${mouseX * 3}px)`,
            transformOrigin: "top center",
            transition: "transform 0.8s ease-out",
          }}
        />
        {/* Secondary gold line */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: "56%",
            width: "1px",
            height: "120%",
            background: "linear-gradient(180deg, transparent 10%, rgba(197,165,114,0.2) 40%, rgba(197,165,114,0.06) 80%, transparent 95%)",
            transform: `rotate(15deg) translateX(${mouseX * 5}px)`,
            transformOrigin: "top center",
            transition: "transform 1s ease-out",
          }}
        />
        {/* Third thin white line */}
        <div
          className="absolute"
          style={{
            top: 0,
            left: "60%",
            width: "1px",
            height: "120%",
            background: "linear-gradient(180deg, transparent 15%, rgba(255,255,255,0.06) 45%, transparent 85%)",
            transform: `rotate(15deg) translateX(${mouseX * 7}px)`,
            transformOrigin: "top center",
            transition: "transform 1.2s ease-out",
          }}
        />

        {/* Horizontal gold accent line — cuts across */}
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="absolute"
          style={{
            top: "32%",
            left: "5%",
            right: "40%",
            height: "1px",
            background: "linear-gradient(90deg, transparent 0%, rgba(197,165,114,0.5) 20%, rgba(197,165,114,0.3) 80%, transparent 100%)",
            transformOrigin: "left center",
          }}
        />
      </motion.div>

      {/* Mobile overlay — simple gradient */}
      <div className="absolute inset-0 z-[3] lg:hidden bg-gradient-to-t from-[#0a0a0a] via-[#0a0a0a]/70 to-transparent" />

      {/* === LEFT SIDEBAR === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 w-16 z-20 hidden lg:flex flex-col items-center justify-between py-8 bg-[#0a0a0a]/90 backdrop-blur-sm border-r border-white/[0.03]"
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
          <span className="text-xs text-storefront-muted/50">
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        <span
          className="text-[10px] tracking-[0.35em] uppercase text-storefront-muted/20 font-light"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          BRANDOORS
        </span>

        <div className="flex flex-col gap-3 mb-4">
          {["Ig", "Vk", "Tg"].map((s) => (
            <span
              key={s}
              className="w-6 h-6 flex items-center justify-center text-[8px] text-storefront-muted/30 border border-white/[0.04] hover:text-storefront-gold hover:border-storefront-gold/30 transition-all duration-300 cursor-pointer"
            >
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
        transition={{ delay: 1.5, duration: 0.6 }}
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

      {/* === MAIN CONTENT === */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:pl-28 lg:pr-16 pb-14 lg:pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="lg:ml-[22%] max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div key={current}>
                {/* Title */}
                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-5xl lg:text-[60px] font-bold leading-[1.02] tracking-tight text-storefront-text whitespace-pre-line"
                >
                  {slide.title}
                </motion.h1>

                {/* Subtitle */}
                <motion.p
                  initial={{ y: 30, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -15, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
                  className="mt-5 text-sm sm:text-[15px] text-storefront-muted/70 leading-relaxed max-w-md"
                >
                  {slide.subtitle}
                </motion.p>

                {/* CTA */}
                <motion.div
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1], delay: 0.2 }}
                >
                  <a
                    href="#catalog"
                    className="group inline-flex items-center gap-3 mt-8 px-9 py-3.5 border border-storefront-gold/60 text-storefront-gold text-[11px] uppercase tracking-[0.25em] hover:bg-storefront-gold hover:text-[#0a0a0a] transition-all duration-500"
                  >
                    Смотреть каталог
                    <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </a>
                </motion.div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* === Top transparent nav === */}
      <motion.div
        className="absolute top-0 left-16 right-0 z-40 hidden md:flex items-center justify-between px-6 lg:px-12 h-16"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="flex items-center gap-6">
          {site.phone && (
            <span className="text-[11px] text-white/30 tracking-wider font-light">
              {site.phone}
            </span>
          )}
        </div>
        <nav className="flex items-center gap-8">
          {[
            { label: "Каталог", href: "#catalog" },
            { label: "О салоне", href: "#about" },
            { label: "Контакты", href: "#contacts" },
          ].map(({ label, href }) => (
            <a
              key={label}
              href={href}
              className="text-[10px] uppercase tracking-[0.25em] text-white/40 hover:text-storefront-gold transition-colors duration-300"
            >
              {label}
            </a>
          ))}
        </nav>
      </motion.div>

      {/* === Progress dots === */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 lg:hidden">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-[2px] transition-all duration-500 ${
              i === current ? "w-8 bg-storefront-gold" : "w-4 bg-white/20"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
