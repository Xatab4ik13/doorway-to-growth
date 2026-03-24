import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";

interface Props {
  site: StorefrontSite;
  banners: Array<{
    id: string;
    title: string | null;
    subtitle: string | null;
    image_url: string;
  }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroSection({ site: _site, banners: _banners }: Props) {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none">
      {/* Base background — dark navy gradient */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 55% 48%, hsla(220, 18%, 12%, 1) 0%, hsla(222, 20%, 8%, 1) 40%, hsla(225, 22%, 5%, 1) 70%, hsla(0, 0%, 2%, 1) 100%)",
        }}
      />

      {/* Full SVG composition */}
      <motion.svg
        className="absolute inset-0 z-[2] w-full h-full"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE }}
      >
        <defs>
          <linearGradient id="gold" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a7040" />
            <stop offset="25%" stopColor="#c5a572" />
            <stop offset="50%" stopColor="#d4b88a" />
            <stop offset="75%" stopColor="#c5a572" />
            <stop offset="100%" stopColor="#8a7040" />
          </linearGradient>
          <linearGradient id="goldBand" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#6a5530" />
            <stop offset="20%" stopColor="#c5a572" />
            <stop offset="45%" stopColor="#ddc99a" />
            <stop offset="55%" stopColor="#d4b88a" />
            <stop offset="80%" stopColor="#c5a572" />
            <stop offset="100%" stopColor="#6a5530" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ============ DARK PANELS — 3D fold effect ============ */}

        {/* Top-right dark panel (outermost) */}
        <polygon
          points="1400,0 1400,520 880,0"
          fill="hsla(222, 20%, 9%, 0.97)"
        />
        {/* Top-right inner panel */}
        <polygon
          points="1400,0 1400,480 920,0"
          fill="hsla(222, 18%, 11%, 0.95)"
        />

        {/* Bottom-right dark panel (outermost) */}
        <polygon
          points="1400,900 1400,380 880,900"
          fill="hsla(222, 20%, 9%, 0.97)"
        />
        {/* Bottom-right inner panel */}
        <polygon
          points="1400,900 1400,420 920,900"
          fill="hsla(222, 18%, 11%, 0.95)"
        />

        {/* ============ THICK GOLD BANDS — main 3D accents ============ */}

        {/* Top-right thick gold band */}
        <motion.polygon
          points="1400,0 1400,14 868,0 880,0"
          fill="url(#goldBand)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />
        <motion.line
          x1="880" y1="0" x2="1400" y2="520"
          stroke="url(#goldBand)"
          strokeWidth="12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        />

        {/* Bottom-right thick gold band */}
        <motion.line
          x1="880" y1="900" x2="1400" y2="380"
          stroke="url(#goldBand)"
          strokeWidth="12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.5 }}
        />

        {/* ============ TOP-RIGHT GOLD LINES ============ */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((i) => {
          const spacing = 22;
          // Lines go from right edge downward, angled 45° into the corner
          const x1 = 920 + i * spacing;
          const y1 = 0;
          const x2 = 1400;
          const y2 = 1400 - x1;
          const sw = i === 0 ? 2.5 : i < 3 ? 1.5 : 1;
          const op = 1 - i * 0.07;
          return (
            <motion.line
              key={`top-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="url(#gold)"
              strokeWidth={sw}
              opacity={op}
              filter={i < 2 ? "url(#glow)" : undefined}
              initial={{ opacity: 0, x1: x1 + 20, y2: y2 - 20 }}
              animate={{ opacity: op, x1, y2 }}
              transition={{ duration: 1, ease: EASE, delay: 0.25 + i * 0.04 }}
            />
          );
        })}

        {/* ============ BOTTOM-RIGHT GOLD LINES ============ */}
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => {
          const spacing = 22;
          const x1 = 920 + i * spacing;
          const y1 = 900;
          const x2 = 1400;
          const y2 = x1 - 520;
          const sw = i === 0 ? 2.5 : i < 3 ? 1.5 : 1;
          const op = 1 - i * 0.07;
          return (
            <motion.line
              key={`bot-${i}`}
              x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="url(#gold)"
              strokeWidth={sw}
              opacity={op}
              filter={i < 2 ? "url(#glow)" : undefined}
              initial={{ opacity: 0, x1: x1 + 20, y2: y2 + 20 }}
              animate={{ opacity: op, x1, y2 }}
              transition={{ duration: 1, ease: EASE, delay: 0.3 + i * 0.04 }}
            />
          );
        })}
      </motion.svg>

      {/* Left-side dark vignette for depth */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsla(0, 0%, 1%, 0.6) 0%, hsla(0, 0%, 1%, 0.2) 25%, transparent 45%)",
        }}
      />
    </section>
  );
}
