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
  // All lines converge toward the right edge center (~1400, 450)
  const meetX = 1400;
  const meetY = 450;

  const topLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 30;
    // Start from top edge, each line shifted right
    const x1 = 680 + i * gap;
    const y1 = 0;
    // End at right edge, proportionally
    const ratio = (meetX - x1) / meetX;
    const endY = meetY * (1 - ratio) + 0 * ratio;
    return {
      x1, y1,
      x2: meetX,
      y2: Math.max(0, meetY - (meetX - x1)),
      sw: i === 0 ? 2.5 : i < 3 ? 1.6 : 1.1,
      op: 1 - i * 0.06,
    };
  });

  const bottomLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 30;
    const x1 = 680 + i * gap;
    const y1 = 900;
    return {
      x1, y1,
      x2: meetX,
      y2: Math.min(900, meetY + (meetX - x1)),
      sw: i === 0 ? 2.5 : i < 3 ? 1.6 : 1.1,
      op: 1 - i * 0.06,
    };
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
        <polygon points={`660,0 1400,0 1400,${meetY}`} fill="hsla(222, 20%, 9%, 0.98)" />
        <polygon points={`700,0 1400,0 1400,${meetY - 30}`} fill="hsla(222, 18%, 11%, 0.96)" />
        <polygon points={`740,0 1400,0 1400,${meetY - 60}`} fill="hsla(222, 16%, 13%, 0.93)" />

        {/* Dark panels — bottom-right triangle */}
        <polygon points={`660,900 1400,900 1400,${meetY}`} fill="hsla(222, 20%, 9%, 0.98)" />
        <polygon points={`700,900 1400,900 1400,${meetY + 30}`} fill="hsla(222, 18%, 11%, 0.96)" />
        <polygon points={`740,900 1400,900 1400,${meetY + 60}`} fill="hsla(222, 16%, 13%, 0.93)" />

        {/* Thick gold band — top diagonal */}
        <motion.line
          x1="650" y1="0" x2={meetX} y2={meetY}
          stroke="url(#goldBand)"
          strokeWidth="14"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.35 }}
        />

        {/* Thick gold band — bottom diagonal */}
        <motion.line
          x1="650" y1="900" x2={meetX} y2={meetY}
          stroke="url(#goldBand)"
          strokeWidth="14"
          filter="url(#glow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.45 }}
        />

        {/* Top-right thin gold lines */}
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

        {/* Bottom-right thin gold lines */}
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
