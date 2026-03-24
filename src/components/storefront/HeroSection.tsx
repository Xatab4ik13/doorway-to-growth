import { useState, useRef, useEffect, useCallback } from "react";
import { motion, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

/* Each room = a collection with its own world */
const ROOMS = [
  {
    collection: "ESTETICA",
    tagline: "Современный\nминимализм",
    description: "Гладкое однотонное покрытие, скрытый короб Invisible, итальянский замок AGB 2.0. Чистые линии для современного интерьера.",
    accent: "#c5a572",
    bg: "#0c0a08",
    ambient: "#1a1408",
    particleColor: "197,165,114",
    models: "856 моделей",
  },
  {
    collection: "GHOST",
    tagline: "Невидимая\nинтеграция",
    description: "Каркасно-щитовые двери под покраску с коробом INVISIBLE. Монтаж в одной плоскости со стеной, без наличников. Итальянские петли AGB.",
    accent: "#8fa4b8",
    bg: "#080a0e",
    ambient: "#0c1220",
    particleColor: "143,164,184",
    models: "12 моделей",
  },
  {
    collection: "HEAVY",
    tagline: "Монументальная\nсила",
    description: "Полотно 60 мм на скрытом коробе. HPL-пластик, PET, глянец. До 3000 мм без перемычки. Алюминиевый короб, партнёры: Arpa, Cleaf, Renolit.",
    accent: "#b87a4a",
    bg: "#0a0806",
    ambient: "#1a1006",
    particleColor: "184,122,74",
    models: "288 моделей",
  },
  {
    collection: "PRIME",
    tagline: "Неоклассика\nбез компромиссов",
    description: "Царговые двери с эмалевым покрытием Renolit (Германия). Гладкая однотонная поверхность передаёт эффект эмалевых дверей.",
    accent: "#a8b89a",
    bg: "#080a08",
    ambient: "#0c180c",
    particleColor: "168,184,154",
    models: "666 моделей",
  },
  {
    collection: "REFLECT",
    tagline: "Зеркало\nи свет",
    description: "Двери с зеркалом и лакобелью. Итальянский замок AGB 2.0, 3.0. Алюминиевые кромки: Al, Black Edition, Gold Edition, White Edition.",
    accent: "#b8b0c8",
    bg: "#0a080e",
    ambient: "#14101e",
    particleColor: "184,176,200",
    models: "180 моделей",
  },
];

/* Floating particles for ambience */
function AmbientParticles({ color, count = 30 }: { color: string; count?: number }) {
  const particles = useRef(
    Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 2.5 + 0.5,
      duration: Math.random() * 15 + 10,
      delay: Math.random() * 5,
      opacity: Math.random() * 0.3 + 0.05,
    }))
  ).current;

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((p) => (
        <motion.div
          key={p.id}
          className="absolute rounded-full"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            width: p.size,
            height: p.size,
            background: `rgba(${color}, ${p.opacity})`,
          }}
          animate={{
            y: [0, -30, 0],
            x: [0, Math.random() * 20 - 10, 0],
            opacity: [p.opacity, p.opacity * 2, p.opacity],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
}

/* Architectural line drawing per room — based on real BRANDOORS door silhouettes */
function RoomArchitecture({ roomIndex, accent }: { roomIndex: number; accent: string }) {
  const architectures = [
    // ESTETICA — clean minimal single door, smooth surface, thin vertical line accent (like ESTETICA 01-04)
    <svg key="est" viewBox="0 0 400 550" className="w-full h-full">
      <defs>
        <linearGradient id={`est-glow-${roomIndex}`} x1="0.5" y1="0" x2="0.5" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor={accent} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Door frame — wall opening */}
      <motion.rect x="110" y="30" width="180" height="460" rx="1"
        fill="none" stroke={accent} strokeWidth="1" opacity="0.2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, ease: "easeOut" }}
      />
      {/* Door panel — smooth surface */}
      <motion.rect x="118" y="38" width="164" height="444" rx="1"
        fill={`url(#est-glow-${roomIndex})`} stroke={accent} strokeWidth="0.6" opacity="0.5"
        initial={{ opacity: 0 }} animate={{ opacity: 0.5 }}
        transition={{ duration: 1.5, delay: 0.5 }}
      />
      {/* Single thin vertical groove — signature ESTETICA detail */}
      <motion.line x1="200" y1="60" x2="200" y2="460"
        stroke={accent} strokeWidth="0.8" opacity="0.35"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 1 }}
      />
      {/* Invisible frame hint (скрытый короб) */}
      <motion.rect x="105" y="25" width="190" height="470" rx="0"
        fill="none" stroke={accent} strokeWidth="0.3" opacity="0.1"
        strokeDasharray="3 6"
        initial={{ opacity: 0 }} animate={{ opacity: 0.1 }}
        transition={{ duration: 2, delay: 1.5 }}
      />
      {/* Handle — minimal L-shape */}
      <motion.path d="M 265,270 L 265,290 L 270,290"
        fill="none" stroke={accent} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.6, delay: 2.2 }}
      />
      {/* AGB lock indicator */}
      <motion.circle cx="268" cy="280" r="2" fill={accent} opacity="0.3"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 2.5 }}
      />
    </svg>,

    // GHOST — fully hidden door, flush with wall, NO visible frame/наличники
    <svg key="gho" viewBox="0 0 400 550" className="w-full h-full">
      {/* Wall texture — horizontal lines suggesting plaster */}
      {Array.from({ length: 20 }).map((_, i) => (
        <motion.line key={`wall-${i}`}
          x1="50" y1={30 + i * 25} x2="350" y2={30 + i * 25}
          stroke={accent} strokeWidth="0.2" opacity="0.06"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.5, delay: i * 0.05 }}
        />
      ))}
      {/* Ghost door — barely visible, same plane as wall */}
      <motion.rect x="140" y="30" width="120" height="460" rx="0"
        fill="none" stroke={accent} strokeWidth="0.4" opacity="0"
        animate={{ opacity: [0, 0.2, 0.1, 0.2, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Hidden hinge points — AGB petli */}
      {[80, 200, 400].map((y, i) => (
        <motion.circle key={`hinge-${i}`}
          cx="140" cy={y} r="1.5"
          fill={accent} opacity="0"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 4, delay: 2 + i * 0.3, repeat: Infinity }}
        />
      ))}
      {/* Minimal handle — flush */}
      <motion.line x1="248" y1="255" x2="248" y2="275"
        stroke={accent} strokeWidth="1" opacity="0"
        animate={{ opacity: [0, 0.4, 0] }}
        transition={{ duration: 5, delay: 1, repeat: Infinity }}
      />
      {/* "Under painting" text hint */}
      <motion.text x="200" y="520" textAnchor="middle"
        fill={accent} opacity="0.15" fontSize="9"
        style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: "0.3em" }}
        initial={{ opacity: 0 }} animate={{ opacity: 0.15 }}
        transition={{ delay: 2 }}
      >
        ПОД ПОКРАСКУ
      </motion.text>
    </svg>,

    // HEAVY — thick 60mm panel, tall (up to 3000mm), aluminum frame, industrial
    <svg key="hea" viewBox="0 0 400 550" className="w-full h-full">
      {/* Aluminum frame — thick double border */}
      <motion.rect x="100" y="20" width="200" height="490" rx="0"
        fill="none" stroke={accent} strokeWidth="3.5" opacity="0.5"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
      <motion.rect x="106" y="26" width="188" height="478" rx="0"
        fill="none" stroke={accent} strokeWidth="1" opacity="0.25"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2, delay: 0.3 }}
      />
      {/* 60mm thick panel fill — subtle */}
      <motion.rect x="108" y="28" width="184" height="474" rx="0"
        fill={accent} opacity="0"
        animate={{ opacity: [0, 0.04, 0.02] }}
        transition={{ duration: 4, repeat: Infinity, repeatType: "reverse" }}
      />
      {/* HPL/PET surface — horizontal texture lines */}
      {Array.from({ length: 8 }).map((_, i) => (
        <motion.line key={`tex-${i}`}
          x1="112" y1={80 + i * 55} x2="288" y2={80 + i * 55}
          stroke={accent} strokeWidth="0.3" opacity="0.08"
          initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
          transition={{ duration: 1.2, delay: 1 + i * 0.1 }}
        />
      ))}
      {/* Height dimension line — showing 3000mm capability */}
      <motion.line x1="85" y1="25" x2="85" y2="505"
        stroke={accent} strokeWidth="0.5" opacity="0.2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 2 }}
      />
      <motion.text x="80" y="270" textAnchor="middle"
        fill={accent} opacity="0.2" fontSize="8"
        transform="rotate(-90, 80, 270)"
        style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: "0.2em" }}
        initial={{ opacity: 0 }} animate={{ opacity: 0.2 }}
        transition={{ delay: 2.5 }}
      >
        3000 MM
      </motion.text>
      {/* Heavy bar handle */}
      <motion.rect x="270" y="245" width="6" height="45" rx="3"
        fill={accent} opacity="0.4"
        initial={{ scaleY: 0 }} animate={{ scaleY: 1 }}
        transition={{ duration: 0.5, delay: 2.8 }}
      />
    </svg>,

    // PRIME — царговые двери, неоклассика, paneled door with moldings
    <svg key="pri" viewBox="0 0 400 550" className="w-full h-full">
      {/* Main door frame */}
      <motion.rect x="130" y="30" width="140" height="460" rx="1"
        fill="none" stroke={accent} strokeWidth="1.2" opacity="0.45"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
      {/* Top panel (shorter) */}
      <motion.rect x="146" y="55" width="108" height="140" rx="2"
        fill="none" stroke={accent} strokeWidth="0.7" opacity="0.25"
        initial={{ opacity: 0 }} animate={{ opacity: 0.25 }}
        transition={{ duration: 1, delay: 1.2 }}
      />
      {/* Bottom panel (taller) */}
      <motion.rect x="146" y="220" width="108" height="245" rx="2"
        fill="none" stroke={accent} strokeWidth="0.7" opacity="0.25"
        initial={{ opacity: 0 }} animate={{ opacity: 0.25 }}
        transition={{ duration: 1, delay: 1.5 }}
      />
      {/* Царга — horizontal bar between panels */}
      <motion.line x1="138" y1="207" x2="262" y2="207"
        stroke={accent} strokeWidth="1" opacity="0.3"
        initial={{ scaleX: 0 }} animate={{ scaleX: 1 }}
        transition={{ duration: 0.8, delay: 1.8 }}
      />
      {/* Inner panel molding detail — top */}
      <motion.rect x="152" y="61" width="96" height="128" rx="1"
        fill="none" stroke={accent} strokeWidth="0.3" opacity="0.12"
        initial={{ opacity: 0 }} animate={{ opacity: 0.12 }}
        transition={{ delay: 2 }}
      />
      {/* Inner panel molding detail — bottom */}
      <motion.rect x="152" y="226" width="96" height="233" rx="1"
        fill="none" stroke={accent} strokeWidth="0.3" opacity="0.12"
        initial={{ opacity: 0 }} animate={{ opacity: 0.12 }}
        transition={{ delay: 2.2 }}
      />
      {/* Эмалевое покрытие — subtle surface sheen */}
      <motion.rect x="136" y="36" width="128" height="448"
        fill={accent} opacity="0"
        animate={{ opacity: [0, 0.03, 0.01] }}
        transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
      />
      {/* Handle */}
      <motion.line x1="253" y1="270" x2="253" y2="300"
        stroke={accent} strokeWidth="1.5" opacity="0.45" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 2.5 }}
      />
      <motion.circle cx="253" cy="285" r="2.5" fill="none" stroke={accent} strokeWidth="1" opacity="0.3"
        initial={{ scale: 0 }} animate={{ scale: 1 }}
        transition={{ delay: 2.7 }}
      />
    </svg>,

    // REFLECT — mirror/lacobel door, full glass panel with aluminum edge
    <svg key="ref" viewBox="0 0 400 550" className="w-full h-full">
      <defs>
        <linearGradient id={`mirror-${roomIndex}`} x1="0" y1="0" x2="0.7" y2="1">
          <stop offset="0%" stopColor={accent} stopOpacity="0.18" />
          <stop offset="30%" stopColor={accent} stopOpacity="0.04" />
          <stop offset="60%" stopColor={accent} stopOpacity="0.12" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.06" />
        </linearGradient>
        <linearGradient id={`edge-${roomIndex}`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor={accent} stopOpacity="0.5" />
          <stop offset="100%" stopColor={accent} stopOpacity="0.15" />
        </linearGradient>
      </defs>
      {/* Aluminum frame */}
      <motion.rect x="120" y="30" width="160" height="460" rx="1"
        fill="none" stroke={accent} strokeWidth="1.5" opacity="0.4"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 2 }}
      />
      {/* Mirror/lacobel panel */}
      <motion.rect x="124" y="34" width="152" height="452" rx="0"
        fill={`url(#mirror-${roomIndex})`}
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ duration: 2, delay: 0.5 }}
      />
      {/* Aluminum edge — Al Black/Gold/White Edition */}
      <motion.line x1="124" y1="34" x2="124" y2="486"
        stroke={`url(#edge-${roomIndex})`} strokeWidth="2"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, delay: 1.2 }}
      />
      {/* Mirror reflection — diagonal light streak */}
      <motion.line x1="160" y1="50" x2="145" y2="470"
        stroke={accent} strokeWidth="1.5" opacity="0"
        animate={{ opacity: [0, 0.15, 0.03, 0.1, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      {/* Secondary reflection */}
      <motion.line x1="210" y1="40" x2="200" y2="480"
        stroke={accent} strokeWidth="0.5" opacity="0"
        animate={{ opacity: [0, 0.08, 0] }}
        transition={{ duration: 5, delay: 1, repeat: Infinity }}
      />
      {/* Surface shimmer dots */}
      {[[180, 120], [230, 300], [155, 380], [240, 200]].map(([x, y], i) => (
        <motion.circle key={`shimmer-${i}`} cx={x} cy={y} r="1"
          fill={accent} opacity="0"
          animate={{ opacity: [0, 0.3, 0] }}
          transition={{ duration: 3, delay: 2 + i * 0.8, repeat: Infinity }}
        />
      ))}
      {/* Handle — minimal */}
      <motion.line x1="262" y1="255" x2="262" y2="280"
        stroke={accent} strokeWidth="1.5" opacity="0.5" strokeLinecap="round"
        initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
        transition={{ duration: 0.5, delay: 2.5 }}
      />
    </svg>,
  ];

  return (
    <div className="w-[280px] h-[400px] lg:w-[350px] lg:h-[480px]">
      {architectures[roomIndex]}
    </div>
  );
}

export function HeroSection({ site, banners }: Props) {
  const [activeRoom, setActiveRoom] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const springX = useSpring(mouseX, { stiffness: 50, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 50, damping: 20 });

  const room = ROOMS[activeRoom];

  // Mouse tracking for parallax
  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    mouseX.set((e.clientX - rect.left - rect.width / 2) / rect.width * 30);
    mouseY.set((e.clientY - rect.top - rect.height / 2) / rect.height * 20);
  }, [mouseX, mouseY]);

  // Auto-advance rooms
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveRoom((r) => (r + 1) % ROOMS.length);
    }, 8000);
    return () => clearInterval(timer);
  }, []);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight" || e.key === "ArrowDown") {
        setActiveRoom((r) => (r + 1) % ROOMS.length);
      } else if (e.key === "ArrowLeft" || e.key === "ArrowUp") {
        setActiveRoom((r) => (r - 1 + ROOMS.length) % ROOMS.length);
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative h-screen min-h-[750px] overflow-hidden select-none"
      onMouseMove={handleMouseMove}
    >
      {/* === ROOM BACKGROUND TRANSITION === */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeRoom}
          className="absolute inset-0 z-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.2, ease: "easeInOut" }}
          style={{ backgroundColor: room.bg }}
        >
          {/* Ambient radial glow */}
          <div className="absolute inset-0" style={{
            background: `radial-gradient(ellipse 70% 60% at 55% 45%, ${room.ambient}aa 0%, transparent 70%)`,
          }} />
          <div className="absolute inset-0" style={{
            background: `radial-gradient(circle at 70% 60%, ${room.accent}08 0%, transparent 50%)`,
          }} />
        </motion.div>
      </AnimatePresence>

      {/* === AMBIENT PARTICLES === */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`particles-${activeRoom}`}
          className="absolute inset-0 z-[1]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1 }}
        >
          <AmbientParticles color={room.particleColor} />
        </motion.div>
      </AnimatePresence>

      {/* === GRID OVERLAY (subtle) === */}
      <div className="absolute inset-0 z-[2] pointer-events-none" style={{
        backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                          linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
        backgroundSize: "80px 80px",
      }} />

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
              key={activeRoom}
              initial={{ y: 10, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -10, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="text-3xl font-bold"
              style={{ color: "#1a1408" }}
            >
              {String(activeRoom + 1).padStart(2, "0")}
            </motion.span>
          </AnimatePresence>
          <span className="text-xs" style={{ color: "rgba(26,20,8,0.35)" }}>/ {String(ROOMS.length).padStart(2, "0")}</span>
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
        <div className="w-full h-full flex items-center justify-between px-8 lg:px-16 xl:px-24">

          {/* LEFT: Text content */}
          <div className="flex-1 max-w-xl">
            {/* Collection label */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`label-${activeRoom}`}
                initial={{ opacity: 0, x: -30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 30 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6"
              >
                <div className="flex items-center gap-4 mb-2">
                  <motion.div
                    className="h-px"
                    style={{ backgroundColor: room.accent }}
                    initial={{ width: 0 }}
                    animate={{ width: 60 }}
                    transition={{ duration: 0.8, delay: 0.3 }}
                  />
                  <span
                    className="text-xs tracking-[0.4em] uppercase"
                    style={{ color: room.accent, fontFamily: "'Raleway', sans-serif", fontWeight: 500 }}
                  >
                    Коллекция
                  </span>
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Collection name — HUGE */}
            <AnimatePresence mode="wait">
              <motion.h1
                key={`name-${activeRoom}`}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                exit={{ opacity: 0, y: -40, filter: "blur(10px)" }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                className="text-6xl md:text-7xl lg:text-8xl xl:text-9xl font-light leading-[0.9] mb-6"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: room.accent,
                  textShadow: `0 0 80px ${room.accent}20`,
                }}
              >
                {room.collection}
              </motion.h1>
            </AnimatePresence>

            {/* Tagline */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`tag-${activeRoom}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                className="text-xl md:text-2xl font-light leading-tight mb-4 whitespace-pre-line"
                style={{
                  fontFamily: "'Cormorant Garamond', serif",
                  color: `${room.accent}cc`,
                }}
              >
                {room.tagline}
              </motion.p>
            </AnimatePresence>

            {/* Description */}
            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${activeRoom}`}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, delay: 0.35 }}
                className="text-sm md:text-base leading-relaxed max-w-md mb-10"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  fontWeight: 300,
                  color: `rgba(255,255,255,0.4)`,
                }}
              >
                {room.description}
              </motion.p>
            </AnimatePresence>

            {/* Model count badge */}
            <AnimatePresence mode="wait">
              <motion.div
                key={`models-${activeRoom}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ duration: 0.4, delay: 0.45 }}
                className="mb-8 flex items-center gap-3"
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: room.accent, opacity: 0.6 }} />
                <span
                  className="text-xs tracking-[0.2em] uppercase"
                  style={{ color: `${room.accent}80`, fontFamily: "'Raleway', sans-serif" }}
                >
                  {room.models}
                </span>
              </motion.div>
            </AnimatePresence>

            {/* CTA Button */}
            <motion.button
              className="group relative overflow-hidden px-8 py-3 border text-sm tracking-[0.2em] uppercase transition-all duration-500"
              style={{
                borderColor: `${room.accent}40`,
                color: room.accent,
                fontFamily: "'Raleway', sans-serif",
                fontWeight: 400,
              }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="relative z-10">Смотреть каталог</span>
              <motion.div
                className="absolute inset-0"
                style={{ backgroundColor: room.accent }}
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </motion.button>
          </div>

          {/* RIGHT: Architectural drawing with parallax */}
          <motion.div
            className="hidden lg:flex items-center justify-center flex-shrink-0"
            style={{
              x: springX,
              y: springY,
            }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={`arch-${activeRoom}`}
                initial={{ opacity: 0, scale: 0.85, rotateY: -15 }}
                animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                exit={{ opacity: 0, scale: 0.85, rotateY: 15 }}
                transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              >
                <RoomArchitecture roomIndex={activeRoom} accent={room.accent} />
              </motion.div>
            </AnimatePresence>
          </motion.div>
        </div>
      </div>

      {/* === ROOM NAVIGATION — right side vertical dots === */}
      <div className="absolute right-8 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-4">
        {ROOMS.map((r, i) => (
          <button
            key={i}
            onClick={() => setActiveRoom(i)}
            className="group relative flex items-center justify-end gap-3"
          >
            {/* Label on hover */}
            <span
              className="text-[10px] tracking-[0.3em] uppercase opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap"
              style={{
                color: i === activeRoom ? r.accent : "rgba(255,255,255,0.3)",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              {r.collection}
            </span>

            {/* Dot / line indicator */}
            <motion.div
              className="relative"
              animate={{
                width: i === activeRoom ? 24 : 8,
                height: 2,
                backgroundColor: i === activeRoom ? r.accent : "rgba(255,255,255,0.15)",
              }}
              transition={{ duration: 0.4 }}
              style={{ borderRadius: 1 }}
            />
          </button>
        ))}
      </div>

      {/* === BOTTOM INFO BAR === */}
      <div className="absolute bottom-0 left-0 right-0 z-20 lg:pl-[260px]">
        <div className="flex items-center justify-between px-8 lg:px-16 py-6 border-t"
          style={{ borderColor: "rgba(255,255,255,0.05)" }}
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={`site-${activeRoom}`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs tracking-[0.3em] uppercase"
              style={{
                color: "rgba(255,255,255,0.25)",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              {site?.name || "BRANDOORS"}
            </motion.span>
          </AnimatePresence>

          <span
            className="text-xs tracking-[0.2em]"
            style={{
              color: "rgba(255,255,255,0.15)",
              fontFamily: "'Raleway', sans-serif",
            }}
          >
            {site?.phone || "+7 (495) 000-00-00"}
          </span>
        </div>
      </div>

      {/* === SCROLL HINT === */}
      <motion.div
        className="absolute bottom-20 left-1/2 lg:left-[calc(260px+(100%-260px)/2)] -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        <div className="w-5 h-8 border rounded-full flex items-start justify-center p-1"
          style={{ borderColor: "rgba(255,255,255,0.1)" }}
        >
          <motion.div
            className="w-1 h-2 rounded-full"
            style={{ backgroundColor: "rgba(255,255,255,0.2)" }}
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
