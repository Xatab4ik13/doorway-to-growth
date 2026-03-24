import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import slide1 from "@/assets/slide-1.jpg";
import slide2 from "@/assets/slide-2.jpg";

interface Props {
  site: StorefrontSite;
  banners: Array<{
    id: string;
    title: string | null;
    subtitle: string | null;
    image_url: string;
  }>;
}

const SLIDES = [slide1, slide2];
const INTERVAL = 5000;

const slideVariants = {
  enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0.6 }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0.6 }),
};

/* ── Gold ribbon overlay as SVG ── */
function GoldRibbonOverlay() {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none"
      viewBox="0 0 1920 1080"
      preserveAspectRatio="xMidYMid slice"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Gold gradient for thick bands */}
        <linearGradient id="gold-band" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4a84b" />
          <stop offset="30%" stopColor="#f0d078" />
          <stop offset="50%" stopColor="#ffe8a0" />
          <stop offset="70%" stopColor="#d4a84b" />
          <stop offset="100%" stopColor="#8b6914" />
        </linearGradient>
        {/* Dark edge for 3D depth */}
        <linearGradient id="gold-edge" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#6b4f0a" />
          <stop offset="100%" stopColor="#3d2e06" />
        </linearGradient>
        {/* Thin line gold */}
        <linearGradient id="gold-thin" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="#8b6914" stopOpacity="0" />
          <stop offset="20%" stopColor="#c9993a" />
          <stop offset="50%" stopColor="#f0d078" />
          <stop offset="80%" stopColor="#c9993a" />
          <stop offset="100%" stopColor="#8b6914" stopOpacity="0" />
        </linearGradient>
        {/* Shadow filter */}
        <filter id="ribbon-shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="4" dy="6" stdDeviation="12" floodColor="#000000" floodOpacity="0.6" />
        </filter>
        <filter id="thin-glow">
          <feDropShadow dx="0" dy="0" stdDeviation="1" floodColor="#d4a84b" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* ── Upper band group: goes from top-right to bottom-right ── */}
      <g filter="url(#ribbon-shadow)">
        {/* Thin parallel lines above the thick band */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const gap = 38;
          const baseY = -60;
          const y = baseY + i * gap;
          return (
            <line
              key={`top-thin-${i}`}
              x1={1050 + y * 0.4}
              y1={y}
              x2={1920 + 200}
              y2={y + (1920 - 1050) * 0.55}
              stroke="url(#gold-thin)"
              strokeWidth="2"
              filter="url(#thin-glow)"
            />
          );
        })}
        {/* Main thick band – upper */}
        <polygon
          points="1000,280 1920,780 1920,830 1000,330"
          fill="url(#gold-band)"
        />
        {/* Dark bottom edge for 3D */}
        <polygon
          points="1000,330 1920,830 1920,842 1000,342"
          fill="url(#gold-edge)"
        />
        {/* Bright highlight on top edge */}
        <line x1="1000" y1="280" x2="1920" y2="780" stroke="#ffe8a0" strokeWidth="1.5" strokeOpacity="0.6" />
      </g>

      {/* ── Lower band group: goes from bottom-left area to right ── */}
      <g filter="url(#ribbon-shadow)">
        {/* Thin parallel lines below the thick band */}
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => {
          const gap = 38;
          const baseY = 720 + i * gap;
          return (
            <line
              key={`bot-thin-${i}`}
              x1={800 + (baseY - 500) * 0.3}
              y1={baseY}
              x2={1920 + 200}
              y2={baseY + (1920 - 800) * 0.2}
              stroke="url(#gold-thin)"
              strokeWidth="2"
              filter="url(#thin-glow)"
            />
          );
        })}
        {/* Main thick band – lower */}
        <polygon
          points="700,620 1920,920 1920,970 700,670"
          fill="url(#gold-band)"
        />
        {/* Dark bottom edge for 3D */}
        <polygon
          points="700,670 1920,970 1920,982 700,682"
          fill="url(#gold-edge)"
        />
        {/* Bright highlight on top edge */}
        <line x1="700" y1="620" x2="1920" y2="920" stroke="#ffe8a0" strokeWidth="1.5" strokeOpacity="0.6" />
      </g>

      {/* ── Intersection shadow wedge ── */}
      <polygon
        points="1320,580 1500,620 1480,660 1300,630"
        fill="black"
        fillOpacity="0.35"
        filter="url(#thin-glow)"
      />

      {/* Dark overlay vignette for depth */}
      <rect width="1920" height="1080" fill="url(#vignette)" />
    </svg>
  );
}

export function HeroSection({ site: _site, banners: _banners }: Props) {
  const [[current, direction], setCurrent] = useState([0, 1]);

  const next = useCallback(() => {
    setCurrent(([prev]) => [(prev + 1) % SLIDES.length, 1]);
  }, []);

  useEffect(() => {
    const id = setInterval(next, INTERVAL);
    return () => clearInterval(id);
  }, [next]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-black">
      {/* Slideshow layer */}
      <AnimatePresence custom={direction} initial={false}>
        <motion.img
          key={current}
          src={SLIDES[current]}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          custom={direction}
          variants={slideVariants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.9, ease: [0.42, 0, 0.2, 1] }}
        />
      </AnimatePresence>

      {/* Darken overlay so ribbons pop */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Gold ribbons overlay */}
      <GoldRibbonOverlay />
    </section>
  );
}
