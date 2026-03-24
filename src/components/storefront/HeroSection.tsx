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

/*
 * Architecture of the magazine page 2:
 *
 * - Background: warm dark charcoal (#0e0e0e → #181816 center glow)
 * - Top-right corner: folded dark panel with subtle warm lighting
 * - Bottom-right corner: same, mirrored
 * - Each fold edge: thick gold 3D ribbon (shadow + body + highlight)
 * - Between ribbon and corner: 8-10 thin gold parallel lines
 * - Where ribbons meet at right edge: one goes OVER the other (overlap)
 */

const MEET_X = 1400;
const MEET_Y = 450;
const SLOPE = MEET_Y / (MEET_X - 650); // ≈0.6

function makeLine(startX: number, fromTop: boolean) {
  const y1 = fromTop ? 0 : 900;
  const dist = MEET_X - startX;
  const y2 = fromTop ? SLOPE * dist : 900 - SLOPE * dist;
  return { x1: startX, y1, x2: MEET_X, y2 };
}

export function HeroSection({ site: _site, banners: _banners }: Props) {
  const topThinLines = Array.from({ length: 9 }, (_, i) => {
    const { x1, y1, x2, y2 } = makeLine(770 + i * 32, true);
    return { x1, y1, x2, y2, sw: i < 2 ? 1.6 : 1, op: 0.92 - i * 0.07 };
  });

  const bottomThinLines = Array.from({ length: 9 }, (_, i) => {
    const { x1, y1, x2, y2 } = makeLine(770 + i * 32, false);
    return { x1, y1, x2, y2, sw: i < 2 ? 1.6 : 1, op: 0.92 - i * 0.07 };
  });

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none">
      {/* Warm charcoal background with center glow */}
      <div
        className="absolute inset-0"
        style={{
          background: `
            radial-gradient(ellipse 70% 60% at 54% 46%, #1a1816 0%, #131210 30%, #0c0b0a 60%, #060605 100%)
          `,
        }}
      />

      {/* Left darkening */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, #030303 0%, rgba(3,3,3,0.5) 20%, transparent 42%)",
        }}
      />

      <motion.svg
        className="absolute inset-0 z-[2] h-full w-full"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.7, ease: EASE }}
      >
        <defs>
          {/* Dark panel gradients — warm, not blue */}
          <linearGradient id="panelTop" x1="0.5" y1="0" x2="0.8" y2="1">
            <stop offset="0%" stopColor="#1c1a17" />
            <stop offset="40%" stopColor="#151311" />
            <stop offset="100%" stopColor="#0d0c0a" />
          </linearGradient>
          <linearGradient id="panelBot" x1="0.5" y1="1" x2="0.8" y2="0">
            <stop offset="0%" stopColor="#1c1a17" />
            <stop offset="40%" stopColor="#151311" />
            <stop offset="100%" stopColor="#0d0c0a" />
          </linearGradient>

          {/* Gold for thin lines */}
          <linearGradient id="goldThin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#6b5a35" />
            <stop offset="30%" stopColor="#a08a55" />
            <stop offset="50%" stopColor="#c4aa6a" />
            <stop offset="70%" stopColor="#a08a55" />
            <stop offset="100%" stopColor="#6b5a35" />
          </linearGradient>

          {/* 3D ribbon: dark edge (shadow side) */}
          <linearGradient id="ribbonShadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#2a2318" />
            <stop offset="50%" stopColor="#3d3222" />
            <stop offset="100%" stopColor="#2a2318" />
          </linearGradient>

          {/* 3D ribbon: main gold body */}
          <linearGradient id="ribbonBody" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#5c4d30" />
            <stop offset="20%" stopColor="#9a8352" />
            <stop offset="42%" stopColor="#c4ad6e" />
            <stop offset="58%" stopColor="#c4ad6e" />
            <stop offset="80%" stopColor="#9a8352" />
            <stop offset="100%" stopColor="#5c4d30" />
          </linearGradient>

          {/* 3D ribbon: bright highlight stripe */}
          <linearGradient id="ribbonHighlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#8a7548" stopOpacity="0" />
            <stop offset="25%" stopColor="#d4be82" />
            <stop offset="50%" stopColor="#e8d6a4" />
            <stop offset="75%" stopColor="#d4be82" />
            <stop offset="100%" stopColor="#8a7548" stopOpacity="0" />
          </linearGradient>

          {/* Cast shadow under ribbon */}
          <linearGradient id="castShadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#000" stopOpacity="0" />
            <stop offset="30%" stopColor="#000" stopOpacity="0.6" />
            <stop offset="70%" stopColor="#000" stopOpacity="0.6" />
            <stop offset="100%" stopColor="#000" stopOpacity="0" />
          </linearGradient>

          <filter id="glow1" x="-10%" y="-30%" width="120%" height="160%">
            <feGaussianBlur stdDeviation="1" result="b" />
            <feMerge>
              <feMergeNode in="b" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          <filter id="shadowBlur" x="-10%" y="-40%" width="120%" height="180%">
            <feGaussianBlur stdDeviation="4" />
          </filter>
        </defs>

        {/* ===== DARK FOLDED PANELS ===== */}

        {/* Top-right panel — outermost fold */}
        <polygon points="650,0 1400,0 1400,450" fill="url(#panelTop)" />
        {/* Inner layer */}
        <polygon points="730,0 1400,0 1400,402" fill="#12110f" opacity="0.9" />

        {/* Bottom-right panel — outermost fold */}
        <polygon points="650,900 1400,900 1400,450" fill="url(#panelBot)" />
        {/* Inner layer */}
        <polygon points="730,900 1400,900 1400,498" fill="#12110f" opacity="0.9" />

        {/* ===== THIN GOLD LINES — top group ===== */}
        {topThinLines.map(({ x1, y1, x2, y2, sw, op }, i) => (
          <line
            key={`tl-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="url(#goldThin)"
            strokeWidth={sw}
            opacity={op}
          />
        ))}

        {/* ===== THIN GOLD LINES — bottom group ===== */}
        {bottomThinLines.map(({ x1, y1, x2, y2, sw, op }, i) => (
          <line
            key={`bl-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="url(#goldThin)"
            strokeWidth={sw}
            opacity={op}
          />
        ))}

        {/* ===== 3D GOLD RIBBON — BOTTOM (drawn first = goes UNDER) ===== */}

        {/* Cast shadow */}
        <line
          x1="650" y1="900" x2={MEET_X} y2={MEET_Y}
          stroke="url(#castShadow)" strokeWidth="30"
          filter="url(#shadowBlur)"
        />
        {/* Dark edge (left side of ribbon thickness) */}
        <line
          x1="646" y1="900" x2={MEET_X} y2={MEET_Y - 4}
          stroke="url(#ribbonShadow)" strokeWidth="4"
        />
        {/* Main ribbon body */}
        <line
          x1="650" y1="900" x2={MEET_X} y2={MEET_Y}
          stroke="url(#ribbonBody)" strokeWidth="14"
        />
        {/* Highlight stripe (center of ribbon) */}
        <line
          x1="650" y1="900" x2={MEET_X} y2={MEET_Y}
          stroke="url(#ribbonHighlight)" strokeWidth="3"
          filter="url(#glow1)"
        />
        {/* Thin bright edge (right side) */}
        <line
          x1="654" y1="900" x2={MEET_X} y2={MEET_Y + 4}
          stroke="#d4be82" strokeWidth="1" opacity="0.35"
        />

        {/* ===== 3D GOLD RIBBON — TOP (drawn second = goes OVER) ===== */}

        {/* Cast shadow */}
        <line
          x1="650" y1="0" x2={MEET_X} y2={MEET_Y}
          stroke="url(#castShadow)" strokeWidth="30"
          filter="url(#shadowBlur)"
        />
        {/* Dark edge */}
        <line
          x1="654" y1="0" x2={MEET_X} y2={MEET_Y + 4}
          stroke="url(#ribbonShadow)" strokeWidth="4"
        />
        {/* Main ribbon body */}
        <line
          x1="650" y1="0" x2={MEET_X} y2={MEET_Y}
          stroke="url(#ribbonBody)" strokeWidth="14"
        />
        {/* Highlight stripe */}
        <line
          x1="650" y1="0" x2={MEET_X} y2={MEET_Y}
          stroke="url(#ribbonHighlight)" strokeWidth="3"
          filter="url(#glow1)"
        />
        {/* Thin bright edge */}
        <line
          x1="646" y1="0" x2={MEET_X} y2={MEET_Y - 4}
          stroke="#d4be82" strokeWidth="1" opacity="0.35"
        />

        {/* ===== OVERLAP NODE — shadow under top ribbon over bottom ===== */}
        {/* Small dark wedge where top ribbon crosses over bottom */}
        <polygon
          points={`${MEET_X - 60},${MEET_Y - 18} ${MEET_X},${MEET_Y} ${MEET_X - 60},${MEET_Y + 18}`}
          fill="#000" opacity="0.4"
          filter="url(#shadowBlur)"
        />
        {/* Bright edge at overlap point */}
        <line
          x1={MEET_X - 52} y1={MEET_Y}
          x2={MEET_X} y2={MEET_Y}
          stroke="#d4be82" strokeWidth="1.5" opacity="0.6"
        />
      </motion.svg>
    </section>
  );
}
