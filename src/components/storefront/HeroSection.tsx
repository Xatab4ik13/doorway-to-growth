import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { ChevronRight } from "lucide-react";
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

/* Door panel patterns for each slide */
const DOOR_STYLES = [
  // Ribbed vertical lines
  (x: number, y: number, w: number, h: number) => (
    <g key="ribbed">
      {Array.from({ length: 12 }).map((_, i) => {
        const lx = x + 20 + i * ((w - 40) / 11);
        return (
          <line key={i} x1={lx} y1={y + 30} x2={lx} y2={y + h - 30}
            stroke="rgba(197,165,114,0.15)" strokeWidth="1.5" />
        );
      })}
      {/* Handle */}
      <circle cx={x + w - 35} cy={y + h / 2} r="4" fill="none" stroke="rgba(197,165,114,0.5)" strokeWidth="1.5" />
      <line x1={x + w - 35} y1={y + h / 2 - 20} x2={x + w - 35} y2={y + h / 2 + 20}
        stroke="rgba(197,165,114,0.4)" strokeWidth="1.5" />
    </g>
  ),
  // Geometric diamond pattern
  (x: number, y: number, w: number, h: number) => (
    <g key="diamond">
      <line x1={x + w / 2} y1={y + 30} x2={x + w - 20} y2={y + h / 2}
        stroke="rgba(197,165,114,0.2)" strokeWidth="1.5" />
      <line x1={x + w - 20} y1={y + h / 2} x2={x + w / 2} y2={y + h - 30}
        stroke="rgba(197,165,114,0.2)" strokeWidth="1.5" />
      <line x1={x + w / 2} y1={y + h - 30} x2={x + 20} y2={y + h / 2}
        stroke="rgba(197,165,114,0.2)" strokeWidth="1.5" />
      <line x1={x + 20} y1={y + h / 2} x2={x + w / 2} y2={y + 30}
        stroke="rgba(197,165,114,0.2)" strokeWidth="1.5" />
      {/* Inner diamond */}
      <rect x={x + w / 2 - 25} y={y + h / 2 - 25} width={50} height={50}
        fill="none" stroke="rgba(197,165,114,0.15)" strokeWidth="1"
        transform={`rotate(45, ${x + w / 2}, ${y + h / 2})`} />
      {/* Handle */}
      <line x1={x + 30} y1={y + h / 2 - 15} x2={x + 30} y2={y + h / 2 + 15}
        stroke="rgba(197,165,114,0.4)" strokeWidth="1.5" />
    </g>
  ),
  // Classic panel with glass insert
  (x: number, y: number, w: number, h: number) => (
    <g key="classic">
      {/* Top glass panel */}
      <rect x={x + 25} y={y + 30} width={w - 50} height={h * 0.4}
        fill="none" stroke="rgba(197,165,114,0.15)" strokeWidth="1.2" rx="2" />
      {/* Glass pattern */}
      {Array.from({ length: 3 }).map((_, i) => (
        <line key={i} x1={x + 25} y1={y + 30 + (h * 0.4 / 4) * (i + 1)}
          x2={x + w - 25} y2={y + 30 + (h * 0.4 / 4) * (i + 1)}
          stroke="rgba(197,165,114,0.08)" strokeWidth="0.8" />
      ))}
      {/* Bottom panel */}
      <rect x={x + 25} y={y + 30 + h * 0.45} width={w - 50} height={h * 0.45}
        fill="none" stroke="rgba(197,165,114,0.12)" strokeWidth="1.2" rx="2" />
      {/* Handle */}
      <circle cx={x + w - 35} cy={y + h / 2 + 20} r="3.5" fill="none"
        stroke="rgba(197,165,114,0.45)" strokeWidth="1.5" />
    </g>
  ),
];

export function HeroSection({ site, banners }: Props) {
  const [current, setCurrent] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const slide = SLIDES[current] || SLIDES[0];

  // Auto-advance slides
  useEffect(() => {
    if (isHovered) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));
    }, 7000);
    return () => clearInterval(timer);
  }, [isHovered]);

  /* Door dimensions */
  const doorW = 180;
  const doorH = 380;
  const doorGap = 30;
  const totalW = doorW * 3 + doorGap * 2;

  return (
    <section className="relative h-screen min-h-[750px] bg-[#0a0a0a] overflow-hidden select-none">

      {/* === DEEP BACKGROUND — subtle radial glow === */}
      <div className="absolute inset-0">
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 80% 60% at 60% 45%, rgba(197,165,114,0.06) 0%, transparent 70%)",
        }} />
        <div className="absolute inset-0" style={{
          background: "radial-gradient(ellipse 40% 50% at 65% 50%, rgba(197,165,114,0.04) 0%, transparent 60%)",
        }} />
      </div>

      {/* === BRANDOORS PATTERN — subtle grid === */}
      <div className="absolute inset-0 z-[1] pointer-events-none overflow-hidden opacity-30">
        <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="pattern-fade-portal" x1="1" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="white" stopOpacity="0.6" />
              <stop offset="60%" stopColor="white" stopOpacity="0.15" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <mask id="diagonal-mask-portal">
              <rect width="100%" height="100%" fill="url(#pattern-fade-portal)" />
            </mask>
          </defs>
          <g mask="url(#diagonal-mask-portal)">
            {Array.from({ length: 10 }).map((_, col) =>
              Array.from({ length: 6 }).map((_, row) => {
                const x = col * 180;
                const y = row * 180;
                return (
                  <g key={`${col}-${row}`}>
                    <line x1={x} y1={y} x2={x + 180} y2={y}
                      stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    <line x1={x} y1={y} x2={x} y2={y + 180}
                      stroke="rgba(255,255,255,0.04)" strokeWidth="0.5" />
                    {(col + row) % 2 === 0 ? (
                      <circle cx={x + 90} cy={y + 90} r={80}
                        fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                    ) : (
                      <>
                        <path d={`M ${x + 90},${y} A 90,90 0 0,1 ${x + 180},${y + 90}`}
                          fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                        <path d={`M ${x + 90},${y + 180} A 90,90 0 0,0 ${x},${y + 90}`}
                          fill="none" stroke="rgba(255,255,255,0.03)" strokeWidth="0.5" />
                      </>
                    )}
                  </g>
                );
              })
            )}
          </g>
        </svg>
      </div>

      {/* === THE PORTAL — 3D Door Triptych === */}
      <motion.div
        className="absolute z-[4] hidden lg:flex items-center justify-center"
        style={{
          left: "calc(260px + (100% - 260px) / 2)",
          top: "50%",
          transform: "translate(-50%, -50%)",
        }}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1], delay: 0.4 }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <svg
          width={totalW + 60}
          height={doorH + 80}
          viewBox={`0 0 ${totalW + 60} ${doorH + 80}`}
          className="overflow-visible"
        >
          <defs>
            {/* Golden glow behind active door */}
            <radialGradient id="door-glow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="rgba(197,165,114,0.3)" />
              <stop offset="70%" stopColor="rgba(197,165,114,0.05)" />
              <stop offset="100%" stopColor="transparent" />
            </radialGradient>
            {/* Floor reflection gradient */}
            <linearGradient id="floor-reflection" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="rgba(197,165,114,0.08)" />
              <stop offset="100%" stopColor="transparent" />
            </linearGradient>
          </defs>

          {/* Floor line */}
          <line x1="0" y1={doorH + 40} x2={totalW + 60} y2={doorH + 40}
            stroke="rgba(197,165,114,0.15)" strokeWidth="0.8" />
          {/* Floor reflection */}
          <rect x="30" y={doorH + 41} width={totalW} height="30"
            fill="url(#floor-reflection)" opacity="0.5" />

          {/* Three doors */}
          <AnimatePresence mode="wait">
            {SLIDES.map((_, i) => {
              const doorX = 30 + i * (doorW + doorGap);
              const doorY = 40;
              const isActive = i === current;
              const drawPattern = DOOR_STYLES[i];

              return (
                <g key={i} onClick={() => setCurrent(i)} style={{ cursor: "pointer" }}>
                  {/* Glow behind active door */}
                  {isActive && (
                    <motion.ellipse
                      cx={doorX + doorW / 2}
                      cy={doorY + doorH / 2}
                      rx={doorW * 0.8}
                      ry={doorH * 0.6}
                      fill="url(#door-glow)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.8 }}
                    />
                  )}

                  {/* Door frame — outer */}
                  <motion.rect
                    x={doorX}
                    y={doorY}
                    width={doorW}
                    height={doorH}
                    rx="3"
                    fill="none"
                    strokeWidth={isActive ? 2 : 1}
                    animate={{
                      stroke: isActive
                        ? "rgba(197,165,114,0.6)"
                        : "rgba(255,255,255,0.08)",
                    }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Door surface — inner rect */}
                  <motion.rect
                    x={doorX + 8}
                    y={doorY + 8}
                    width={doorW - 16}
                    height={doorH - 16}
                    rx="2"
                    fill="none"
                    strokeWidth="0.8"
                    animate={{
                      stroke: isActive
                        ? "rgba(197,165,114,0.2)"
                        : "rgba(255,255,255,0.04)",
                    }}
                    transition={{ duration: 0.6 }}
                  />

                  {/* Door pattern — unique per door */}
                  <motion.g
                    animate={{
                      opacity: isActive ? 1 : 0.3,
                    }}
                    transition={{ duration: 0.6 }}
                  >
                    {drawPattern(doorX + 8, doorY + 8, doorW - 16, doorH - 16)}
                  </motion.g>

                  {/* "Light" from inside when active — the portal glow */}
                  {isActive && (
                    <motion.rect
                      x={doorX + 12}
                      y={doorY + 12}
                      width={doorW - 24}
                      height={doorH - 24}
                      rx="1"
                      fill="rgba(197,165,114,0.03)"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 0.06, 0.03] }}
                      transition={{ duration: 3, repeat: Infinity, repeatType: "reverse" }}
                    />
                  )}

                  {/* Top arch for active door */}
                  {isActive && (
                    <motion.path
                      d={`M ${doorX},${doorY} Q ${doorX + doorW / 2},${doorY - 30} ${doorX + doorW},${doorY}`}
                      fill="none"
                      stroke="rgba(197,165,114,0.25)"
                      strokeWidth="1"
                      initial={{ pathLength: 0 }}
                      animate={{ pathLength: 1 }}
                      transition={{ duration: 1, ease: "easeOut" }}
                    />
                  )}

                  {/* Floor shadow */}
                  <rect
                    x={doorX + 10}
                    y={doorH + 41}
                    width={doorW - 20}
                    height="15"
                    fill={isActive ? "rgba(197,165,114,0.06)" : "rgba(255,255,255,0.01)"}
                    style={{ transition: "fill 0.6s" }}
                  />
                </g>
              );
            })}
          </AnimatePresence>

          {/* Slide indicator dots below doors */}
          {SLIDES.map((_, i) => (
            <motion.circle
              key={`dot-${i}`}
              cx={30 + totalW / 2 + (i - 1) * 20}
              cy={doorH + 65}
              r={i === current ? 3 : 2}
              animate={{
                fill: i === current ? "rgba(197,165,114,0.8)" : "rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.4 }}
              onClick={() => setCurrent(i)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </svg>
      </motion.div>

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

        <img
          src={brandoorsLogo}
          alt="Brandoors"
          className="relative z-10"
          style={{ filter: "brightness(0)", opacity: 0.8, transform: "rotate(-90deg)", width: "auto", height: "55px" }}
        />

        <div className="flex flex-col gap-3 mb-4 relative z-10">
          {/* VK */}
          <a href="https://vk.com" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center border transition-all duration-300 cursor-pointer"
            style={{ borderColor: "rgba(26,20,8,0.15)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.15)"; }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.5)" }}>
              <path d="M12.77 19.15h1.33s.4-.04.61-.27c.19-.2.18-.59.18-.59s-.03-1.8.81-2.07c.83-.26 1.89 1.73 3.02 2.5.85.58 1.5.45 1.5.45l3.01-.04s1.57-.1.83-1.33c-.06-.1-.44-.92-2.26-2.61-1.9-1.77-1.65-1.48.64-4.54 1.4-1.86 1.96-3 1.78-3.49-.16-.46-1.16-.34-1.16-.34l-3.39.02s-.25-.03-.44.08c-.18.11-.3.36-.3.36s-.53 1.42-1.24 2.63c-1.5 2.55-2.1 2.69-2.34 2.53-.57-.37-.43-1.52-.43-2.33 0-2.53.39-3.59-.75-3.86-.38-.09-.65-.15-1.62-.16-1.24-.01-2.29 0-2.88.29-.39.2-.7.63-.51.65.23.03.75.14 1.03.52.36.49.35 1.59.35 1.59s.2 2.98-.48 3.35c-.47.25-1.12-.26-2.5-2.6-.67-1.19-1.18-2.51-1.18-2.51s-.1-.24-.27-.37c-.22-.16-.52-.21-.52-.21l-3.22.02s-.48.01-.66.22c-.16.19-.01.58-.01.58s2.51 5.87 5.35 8.83c2.6 2.71 5.55 2.53 5.55 2.53z"/>
            </svg>
          </a>
          {/* Telegram */}
          <a href="https://t.me" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center border transition-all duration-300 cursor-pointer"
            style={{ borderColor: "rgba(26,20,8,0.15)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.15)"; }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.5)" }}>
              <path d="M11.94 24c6.6 0 12-5.4 12-12s-5.4-12-12-12-12 5.4-12 12 5.4 12 12 12zm-3.85-8.4l.42-3.97 7.47-6.76c.33-.3-.07-.44-.51-.18l-9.22 5.81-3.56-1.11c-.77-.24-.78-.77.16-1.14l13.9-5.36c.64-.29 1.24.15 1 1.14l-2.37 11.16c-.17.8-.65.99-1.31.62l-3.62-2.67-1.75 1.69c-.19.2-.36.36-.71.36z"/>
            </svg>
          </a>
          {/* Max */}
          <a href="https://max.ru" target="_blank" rel="noopener noreferrer"
            className="w-8 h-8 flex items-center justify-center border transition-all duration-300 cursor-pointer"
            style={{ borderColor: "rgba(26,20,8,0.15)" }}
            onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.4)"; }}
            onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.15)"; }}
          >
            <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.5)" }}>
              <path d="M2 4l4.5 8L2 20h2.5l3.25-5.75L11 20h2.5L9.25 12 13.5 4H11L7.75 9.75 4.5 4H2zm10 0l4.5 8L12 20h2.5l3.25-5.75L21 20h2.5l-4.25-8L23.5 4H21l-3.25 5.75L14.5 4H12z"/>
            </svg>
          </a>
        </div>
      </motion.div>

      {/* === MAIN TEXT CONTENT === */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 pb-14 lg:pb-20" style={{ paddingLeft: "calc(260px + 3rem)" }}>
        <div className="max-w-[1400px] mx-auto">
          <div className="max-w-xl">
            <AnimatePresence mode="wait">
              <motion.div key={current}>
                <motion.h1
                  initial={{ y: 40, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -20, opacity: 0 }}
                  transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="text-4xl sm:text-5xl lg:text-[56px] font-bold leading-[1.02] tracking-tight text-storefront-text whitespace-pre-line"
                  style={{ fontFamily: "'Cormorant Garamond', serif" }}
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
        className="absolute top-0 right-0 z-40 hidden md:flex items-center justify-between px-10 lg:px-16 h-24"
        style={{ left: "260px" }}
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        <div className="relative z-10 flex items-center gap-6">
          {site.phone && (
            <a href={`tel:${site.phone}`} className="text-base text-white/90 tracking-wider font-semibold hover:text-storefront-gold transition-colors duration-300" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>
              {site.phone}
            </a>
          )}
        </div>
        <nav className="relative z-10 flex items-center gap-12">
          {[{ l: "Каталог", h: "#catalog" }, { l: "О салоне", h: "#about" }, { l: "Контакты", h: "#contacts" }].map(({ l, h }) => (
            <a key={l} href={h} className="text-[15px] uppercase tracking-[0.2em] text-white/80 hover:text-storefront-gold transition-colors duration-300 font-semibold" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.5)" }}>{l}</a>
          ))}
        </nav>
      </motion.div>

      {/* Mobile: simplified door + dots */}
      <div className="absolute inset-0 flex items-center justify-center z-[4] lg:hidden">
        <svg width="200" height="340" viewBox="0 0 200 340" className="opacity-30">
          <rect x="10" y="10" width="180" height="320" rx="3" fill="none"
            stroke="rgba(197,165,114,0.4)" strokeWidth="1.5" />
          <rect x="20" y="20" width="160" height="300" rx="2" fill="none"
            stroke="rgba(197,165,114,0.15)" strokeWidth="0.8" />
          {Array.from({ length: 8 }).map((_, i) => (
            <line key={i} x1={35 + i * 18} y1="40" x2={35 + i * 18} y2="300"
              stroke="rgba(197,165,114,0.1)" strokeWidth="1" />
          ))}
          <circle cx="165" cy="170" r="4" fill="none" stroke="rgba(197,165,114,0.35)" strokeWidth="1.5" />
        </svg>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2 lg:hidden">
        {SLIDES.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)}
            className={`h-[2px] transition-all duration-500 ${i === current ? "w-8 bg-storefront-gold" : "w-4 bg-white/20"}`} />
        ))}
      </div>
    </section>
  );
}
