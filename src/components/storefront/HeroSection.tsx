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

// Thick band slope: from (650,0) to (1400,450) → slope = 450/750 = 0.6
const SLOPE = 0.6;

export function HeroSection({ site: _site, banners: _banners }: Props) {
  // Top-right thin lines: parallel to thick band, shifted toward corner
  const topLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 28;
    const x1 = 690 + i * gap;  // start on top edge, shifted right from thick band
    const y1 = 0;
    const x2 = 1400;
    const y2 = SLOPE * (1400 - x1);  // parallel to thick band
    const sw = i === 0 ? 2 : i < 3 ? 1.4 : 1;
    const op = 1 - i * 0.065;
    return { x1, y1, x2, y2, sw, op };
  });

  // Bottom-right thin lines: mirrored
  const bottomLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 28;
    const x1 = 690 + i * gap;
    const y1 = 900;
    const x2 = 1400;
    const y2 = 900 - SLOPE * (1400 - x1);
    const sw = i === 0 ? 2 : i < 3 ? 1.4 : 1;
    const op = 1 - i * 0.065;
    return { x1, y1, x2, y2, sw, op };
  });

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none">
      {/* Base background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 70% at 55% 48%, hsla(220, 18%, 12%, 1) 0%, hsla(222, 20%, 8%, 1) 40%, hsla(225, 22%, 5%, 1) 70%, hsla(0, 0%, 2%, 1) 100%)",
        }}
      />

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
          <linearGradient id="goldBand" x1="0" y1="0" x2="1" y2="0">
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

        {/* Dark panels — top-right triangle */}
        <polygon points="650,0 1400,0 1400,450" fill="hsla(222, 20%, 9%, 0.98)" />
        <polygon points="690,0 1400,0 1400,426" fill="hsla(222, 18%, 11%, 0.96)" />
        <polygon points="730,0 1400,0 1400,402" fill="hsla(222, 16%, 13%, 0.93)" />

        {/* Dark panels — bottom-right triangle */}
        <polygon points="650,900 1400,900 1400,450" fill="hsla(222, 20%, 9%, 0.98)" />
        <polygon points="690,900 1400,900 1400,474" fill="hsla(222, 18%, 11%, 0.96)" />
        <polygon points="730,900 1400,900 1400,498" fill="hsla(222, 16%, 13%, 0.93)" />

        {/* Thick gold band — top */}
        <motion.line
          x1="650" y1="0" x2="1400" y2="450"
          stroke="url(#goldBand)"
          strokeWidth="14"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        />

        {/* Thick gold band — bottom */}
        <motion.line
          x1="650" y1="900" x2="1400" y2="450"
          stroke="url(#goldBand)"
          strokeWidth="14"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
        />

        {/* Top-right thin gold lines (parallel to thick band) */}
        {topLines.map(({ x1, y1, x2, y2, sw, op }, i) => (
          <motion.line
            key={`top-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
            stroke="url(#gold)"
            strokeWidth={sw}
            opacity={op}
            filter={i < 2 ? "url(#glow)" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: op }}
            transition={{ duration: 0.8, ease: EASE, delay: 0.2 + i * 0.04 }}
          />
        ))}

        {/* Bottom-right thin gold lines (parallel to thick band) */}
        {bottomLines.map(({ x1, y1, x2, y2, sw, op }, i) => (
          <motion.line
            key={`bot-${i}`}
            x1={x1} y1={y1} x2={x2} y2={y2}
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

      {/* Left vignette */}
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
