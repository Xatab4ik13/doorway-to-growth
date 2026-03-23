import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroDefault from "@/assets/hero-showroom.jpg";
import brandoorsLogo from "@/assets/logo.png";

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

  /* Animation cycle: 20s total
     Phase 1 (0-3s):   Draw on (stroke-dashoffset)
     Phase 2 (3-7s):   White → Gold color
     Phase 3 (7-12s):  Light wave sweeps diagonally (stroke-opacity pulse)
     Phase 4 (12-16s): Gold → White color
     Phase 5 (16-20s): Fade out, restart
  */
  const dur = 20;

  return (
    <section className="relative h-screen min-h-[750px] bg-[#0a0a0a] overflow-hidden select-none">

      {/* === HERO IMAGE — static === */}
      <div className="absolute inset-0 lg:left-[260px]">
        <img src={heroImage} alt="Салон дверей" className="w-full h-full object-cover" width={1920} height={1080} />
        <div className="absolute inset-0 bg-[#0a0a0a]/20" />
      </div>

      {/* === BRANDOORS PATTERN — draw → gold → light wave → fade === */}
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
            {Array.from({ length: 8 }).map((_, col) =>
              Array.from({ length: 5 }).map((_, row) => {
                const x = col * 200;
                const y = row * 200;
                const isArcs = (col + row) % 2 === 0;
                const d = (col + row) * 0.12; // stagger delay

                // Light wave delay — diagonal sweep from top-right
                const maxDiag = 7 + 4; // max col+row
                const waveDiag = (7 - col) + row; // top-right origin
                const waveDelay = d + (waveDiag / maxDiag) * 3; // spread over 3s within phase 3

                return (
                  <g key={`${col}-${row}`}>
                    {/* Grid lines */}
                    <line x1={x} y1={y} x2={x + 200} y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="0.6">
                      <animate attributeName="opacity" values="0;0;1;1;1;0" keyTimes="0;0.01;0.1;0.85;0.9;1" dur={`${dur}s`} begin={`${d}s`} repeatCount="indefinite" />
                    </line>
                    <line x1={x} y1={y} x2={x} y2={y + 200} stroke="rgba(255,255,255,0.06)" strokeWidth="0.6">
                      <animate attributeName="opacity" values="0;0;1;1;1;0" keyTimes="0;0.01;0.1;0.85;0.9;1" dur={`${dur}s`} begin={`${d}s`} repeatCount="indefinite" />
                    </line>

                    {isArcs ? (
                      /* Quarter arcs */
                      <>
                        {[
                          `M ${x+100},${y} A 100,100 0 0,1 ${x+200},${y+100}`,
                          `M ${x+200},${y+100} A 100,100 0 0,1 ${x+100},${y+200}`,
                          `M ${x},${y+100} A 100,100 0 0,0 ${x+100},${y}`,
                          `M ${x+100},${y+200} A 100,100 0 0,0 ${x},${y+100}`,
                        ].map((arcD, ai) => (
                          <path key={ai} d={arcD} fill="none" strokeWidth="1.2"
                            stroke="rgba(255,255,255,0.11)"
                            strokeDasharray="157" strokeDashoffset="157"
                          >
                            {/* Draw */}
                            <animate attributeName="stroke-dashoffset" values="157;157;0;0;0;157" keyTimes="0;0.01;0.15;0.80;0.88;1" dur={`${dur}s`} begin={`${d + ai * 0.08}s`} repeatCount="indefinite" />
                            {/* Color: white → gold → bright flash → gold → white */}
                            <animate attributeName="stroke"
                              values="rgba(255,255,255,0.11);rgba(255,255,255,0.11);rgba(197,165,114,0.35);rgba(197,165,114,0.8);rgba(197,165,114,0.35);rgba(255,255,255,0.11);rgba(255,255,255,0.11)"
                              keyTimes="0;0.15;0.30;0.45;0.55;0.70;1"
                              dur={`${dur}s`} begin={`${waveDelay}s`} repeatCount="indefinite" />
                          </path>
                        ))}
                      </>
                    ) : (
                      /* Full circle */
                      <circle
                        cx={x + 100} cy={y + 100} r={95}
                        fill="none" strokeWidth="1.2"
                        stroke="rgba(255,255,255,0.11)"
                        strokeDasharray="597" strokeDashoffset="597"
                      >
                        {/* Draw */}
                        <animate attributeName="stroke-dashoffset" values="597;597;0;0;0;597" keyTimes="0;0.01;0.15;0.80;0.88;1" dur={`${dur}s`} begin={`${d}s`} repeatCount="indefinite" />
                        {/* Color: white → gold → bright flash → gold → white */}
                        <animate attributeName="stroke"
                          values="rgba(255,255,255,0.11);rgba(255,255,255,0.11);rgba(197,165,114,0.35);rgba(197,165,114,0.8);rgba(197,165,114,0.35);rgba(255,255,255,0.11);rgba(255,255,255,0.11)"
                          keyTimes="0;0.15;0.30;0.45;0.55;0.70;1"
                          dur={`${dur}s`} begin={`${waveDelay}s`} repeatCount="indefinite" />
                      </circle>
                    )}
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </div>

      {/* === TOP-RIGHT CORNER GLOW === */}
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

      {/* === CONTENT AREA === */}
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

      {/* === LEFT SIDEBAR — gold metallic panel (matching brandbook cover) === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-20 hidden lg:flex flex-col items-center justify-between py-10"
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #cfbb96 0%, #c2b08c 10%, #b2a07c 25%, #a59370 40%, #9a8a69 55%, #887555 70%, #78674b 85%, #6e5f40 100%)",
          borderRight: "2px solid rgba(40,30,15,0.5)",
        }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
      >
        {/* Metallic sheen overlay */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: "linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 35%, rgba(255,255,255,0.04) 55%, transparent 100%)",
        }} />
        {/* Right edge dark line accent */}
        <div className="absolute top-0 right-[2px] bottom-0 w-[3px]" style={{
          background: "linear-gradient(180deg, rgba(50,40,20,0.3) 0%, rgba(30,20,10,0.6) 50%, rgba(50,40,20,0.3) 100%)",
        }} />

        <div className="flex flex-col items-center gap-1 mt-12 relative z-10">
          <AnimatePresence mode="wait">
            <motion.span
              key={current}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold"
              style={{ color: "#1a1408" }}
            >
              {String(current + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs" style={{ color: "rgba(26,20,8,0.35)" }}>/ {String(SLIDES.length).padStart(2, "0")}</span>
        </div>

        {/* BRANDOORS logo — vertical, darkened for gold bg */}
        <img
          src={brandoorsLogo}
          alt="Brandoors"
          className="relative z-10"
          style={{ filter: "brightness(0)", opacity: 0.8, transform: "rotate(-90deg)", width: "auto", height: "55px" }}
        />

        <div className="flex flex-col gap-3 mb-4 relative z-10">
          {["Ig", "Vk", "Tg"].map((s) => (
            <span key={s} className="w-8 h-8 flex items-center justify-center text-[9px] font-medium border transition-all duration-300 cursor-pointer"
              style={{ color: "rgba(26,20,8,0.5)", borderColor: "rgba(26,20,8,0.15)" }}
              onMouseEnter={(e) => { e.currentTarget.style.color = "#1a1408"; e.currentTarget.style.borderColor = "rgba(26,20,8,0.4)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.color = "rgba(26,20,8,0.5)"; e.currentTarget.style.borderColor = "rgba(26,20,8,0.15)"; }}
            >
              {s}
            </span>
          ))}
        </div>
      </motion.div>

      {/* === SLIDE ARROWS === */}
      <motion.div
        className="absolute left-24 lg:left-32 z-20"
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
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:pl-32 lg:pr-16 pb-14 lg:pb-20">
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
        className="absolute top-0 left-20 right-0 z-40 hidden md:flex items-center justify-between px-6 lg:px-12 h-16"
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
