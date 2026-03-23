import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroDefault from "@/assets/hero-showroom.jpg";

/* ── helpers for morphing: circle path ↔ diamond path ── */
function circlePath(cx: number, cy: number, r: number) {
  const k = r * 0.5523; // bezier approximation of circle
  return `M ${cx},${cy - r} C ${cx + k},${cy - r} ${cx + r},${cy - k} ${cx + r},${cy} C ${cx + r},${cy + k} ${cx + k},${cy + r} ${cx},${cy + r} C ${cx - k},${cy + r} ${cx - r},${cy + k} ${cx - r},${cy} C ${cx - r},${cy - k} ${cx - k},${cy - r} ${cx},${cy - r} Z`;
}
function diamondPath(cx: number, cy: number, r: number) {
  const s = r * 0.15; // slight curve on corners
  return `M ${cx},${cy - r} C ${cx + s},${cy - r + s} ${cx + r - s},${cy - s} ${cx + r},${cy} C ${cx + r - s},${cy + s} ${cx + s},${cy + r - s} ${cx},${cy + r} C ${cx - s},${cy + r - s} ${cx - r + s},${cy + s} ${cx - r},${cy} C ${cx - r + s},${cy - s} ${cx - s},${cy - r + s} ${cx},${cy - r} Z`;
}

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

  const heroImage = banners[0]?.image_url || heroDefault;
  const slide = SLIDES[current] || SLIDES[0];

  const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));

  return (
    <section className="relative h-screen min-h-[750px] bg-[#0a0a0a] overflow-hidden select-none">

      {/* === HERO IMAGE — static, no parallax === */}
      <div className="absolute inset-0 lg:left-16">
        <img src={heroImage} alt="Салон дверей" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-[#0a0a0a]/20" />
      </div>

      {/* === BRANDOORS GEOMETRIC PATTERN — draw-on animation === */}
      <div className="absolute inset-0 z-[2] pointer-events-none overflow-hidden">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pattern-fade" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="1" />
              <stop offset="50%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0.05" />
            </linearGradient>
            <mask id="diagonal-mask">
              <rect width="100%" height="100%" fill="url(#pattern-fade)" />
            </mask>
          </defs>

          <g mask="url(#diagonal-mask)">
            {/* Generate grid manually for draw animation */}
            {Array.from({ length: 8 }).map((_, col) =>
              Array.from({ length: 5 }).map((_, row) => {
                const x = col * 200;
                const y = row * 200;
                const isArcs = (col + row) % 2 === 0;
                const delay = (col + row) * 0.15;
                const dashLen = isArcs ? 628 : 597;
                return (
                  <g key={`${col}-${row}`}>
                    {/* Grid lines for this cell */}
                    <line x1={x} y1={y} x2={x + 200} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.6">
                      <animate attributeName="opacity" from="0" to="1" begin={`${delay}s`} dur="0.8s" fill="freeze" />
                    </line>
                    <line x1={x} y1={y} x2={x} y2={y + 200} stroke="rgba(255,255,255,0.06)" strokeWidth="0.6">
                      <animate attributeName="opacity" from="0" to="1" begin={`${delay}s`} dur="0.8s" fill="freeze" />
                    </line>

                    {isArcs ? (
                      /* Quarter arcs from corners */
                      <>
                        <path
                          d={`M ${x + 100},${y} A 100,100 0 0,1 ${x + 200},${y + 100}`}
                          fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2"
                          strokeDasharray="157" strokeDashoffset="157"
                        >
                          <animate attributeName="stroke-dashoffset" to="0" begin={`${delay}s`} dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                        </path>
                        <path
                          d={`M ${x + 200},${y + 100} A 100,100 0 0,1 ${x + 100},${y + 200}`}
                          fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2"
                          strokeDasharray="157" strokeDashoffset="157"
                        >
                          <animate attributeName="stroke-dashoffset" to="0" begin={`${delay + 0.2}s`} dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                        </path>
                        <path
                          d={`M ${x},${y + 100} A 100,100 0 0,0 ${x + 100},${y}`}
                          fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2"
                          strokeDasharray="157" strokeDashoffset="157"
                        >
                          <animate attributeName="stroke-dashoffset" to="0" begin={`${delay + 0.1}s`} dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                        </path>
                        <path
                          d={`M ${x + 100},${y + 200} A 100,100 0 0,0 ${x},${y + 100}`}
                          fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2"
                          strokeDasharray="157" strokeDashoffset="157"
                        >
                          <animate attributeName="stroke-dashoffset" to="0" begin={`${delay + 0.3}s`} dur="1.2s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                        </path>
                      </>
                    ) : (
                      /* Full circle */
                      <circle
                        cx={x + 100} cy={y + 100} r="95"
                        fill="none" stroke="rgba(255,255,255,0.11)" strokeWidth="1.2"
                        strokeDasharray="597" strokeDashoffset="597"
                      >
                        <animate attributeName="stroke-dashoffset" to="0" begin={`${delay}s`} dur="1.8s" fill="freeze" calcMode="spline" keySplines="0.4 0 0.2 1" />
                      </circle>
                    )}
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </div>

      {/* === TOP-RIGHT CORNER GLOW — static, no pulse === */}
      <div className="absolute inset-0 z-[3] pointer-events-none">
        <div
          style={{
            position: "absolute",
            top: "-10%", right: "-10%", width: "60%", height: "60%",
            background: "radial-gradient(ellipse at center, rgba(197,165,114,0.1) 0%, transparent 70%)",
            filter: "blur(40px)",
          }}
        />
      </div>

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
