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
  // Top-right lines: from top edge going to right edge at 45°
  // In the reference, lines start well into the page (around 55-60% from left)
  // and extend to the right edge
  const topLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 32;
    // Start point on top edge, moving right
    const startX = 680 + i * gap;
    const startY = 0;
    // End point on right edge, moving down
    const endX = 1400;
    const endY = 1400 - startX;
    const sw = i === 0 ? 2.8 : i < 3 ? 1.8 : 1.2;
    const op = 1 - i * 0.06;
    return { startX, startY, endX, endY, sw, op, i };
  });

  const bottomLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 32;
    const startX = 680 + i * gap;
    const startY = 900;
    const endX = 1400;
    const endY = startX - 500;
    const sw = i === 0 ? 2.8 : i < 3 ? 1.8 : 1.2;
    const op = 1 - i * 0.06;
    return { startX, startY, endX, endY, sw, op, i };
  });

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
            <stop offset="0%" stopColor="#7a6438" />
            <stop offset="20%" stopColor="#b8954e" />
            <stop offset="50%" stopColor="#d4b88a" />
            <stop offset="80%" stopColor="#b8954e" />
            <stop offset="100%" stopColor="#7a6438" />
          </linearGradient>
          <linearGradient id="goldBandV" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a4828" />
            <stop offset="15%" stopColor="#b8954e" />
            <stop offset="35%" stopColor="#ddc99a" />
            <stop offset="50%" stopColor="#e8d5a8" />
            <stop offset="65%" stopColor="#ddc99a" />
            <stop offset="85%" stopColor="#b8954e" />
            <stop offset="100%" stopColor="#5a4828" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ============ DARK PANELS — 3D fold effect ============ */}

        {/* Top-right dark folded panel */}
        <polygon
          points="660,0 1400,0 1400,740"
          fill="hsla(222, 20%, 9%, 0.98)"
        />
        <polygon
          points="700,0 1400,0 1400,700"
          fill="hsla(222, 18%, 11%, 0.96)"
        />
        <polygon
          points="740,0 1400,0 1400,660"
          fill="hsla(222, 16%, 13%, 0.94)"
        />

        {/* Bottom-right dark folded panel */}
        <polygon
          points="660,900 1400,900 1400,160"
          fill="hsla(222, 20%, 9%, 0.98)"
        />
        <polygon
          points="700,900 1400,900 1400,200"
          fill="hsla(222, 18%, 11%, 0.96)"
        />
        <polygon
          points="740,900 1400,900 1400,240"
          fill="hsla(222, 16%, 13%, 0.94)"
        />

        {/* ============ THICK GOLD BANDS ============ */}

        {/* Top-right thick gold diagonal band */}
        <motion.line
          x1="650" y1="0" x2="1400" y2="750"
          stroke="url(#goldBandV)"
          strokeWidth="16"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        />

        {/* Bottom-right thick gold diagonal band */}
        <motion.line
          x1="650" y1="900" x2="1400" y2="150"
          stroke="url(#goldBandV)"
          strokeWidth="16"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
        />

        {/* ============ TOP-RIGHT THIN GOLD LINES ============ */}
        {topLines.map(({ startX, startY, endX, endY, sw, op, i }) => (
          <motion.line
            key={`top-${i}`}
            x1={startX} y1={startY} x2={endX} y2={endY}
            stroke="url(#gold)"
            strokeWidth={sw}
            opacity={op}
            filter={i < 2 ? "url(#glow)" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: op }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.04 }}
          />
        ))}

        {/* ============ BOTTOM-RIGHT THIN GOLD LINES ============ */}
        {bottomLines.map(({ startX, startY, endX, endY, sw, op, i }) => (
          <motion.line
            key={`bot-${i}`}
            x1={startX} y1={startY} x2={endX} y2={endY}
            stroke="url(#gold)"
            strokeWidth={sw}
            opacity={op}
            filter={i < 2 ? "url(#glow)" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: op }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.25 + i * 0.04 }}
          />
        ))}
      </motion.svg>

      {/* Left-side dark vignette for depth */}
      <div
        className="absolute inset-0 z-[3] pointer-events-none"
        style={{
          background:
            "linear-gradient(90deg, hsla(0, 0%, 1%, 0.65) 0%, hsla(0, 0%, 1%, 0.2) 22%, transparent 40%)",
        }}
      />
    </section>
  );
}
