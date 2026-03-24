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
const SLOPE = 0.6;

export function HeroSection({ site: _site, banners: _banners }: Props) {
  const topLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 30;
    const x1 = 694 + i * gap;
    const y1 = 0;
    const x2 = 1400;
    const y2 = SLOPE * (1400 - x1);
    return {
      x1,
      y1,
      x2,
      y2,
      sw: i === 0 ? 2.1 : i < 3 ? 1.55 : 1.05,
      op: 1 - i * 0.07,
    };
  });

  const bottomLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 30;
    const x1 = 694 + i * gap;
    const y1 = 900;
    const x2 = 1400;
    const y2 = 900 - SLOPE * (1400 - x1);
    return {
      x1,
      y1,
      x2,
      y2,
      sw: i === 0 ? 2.1 : i < 3 ? 1.55 : 1.05,
      op: 1 - i * 0.07,
    };
  });

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 78% 74% at 56% 48%, hsl(220 18% 15%) 0%, hsl(220 18% 11%) 34%, hsl(224 20% 7%) 68%, hsl(0 0% 3%) 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, hsl(0 0% 2% / 0.86) 0%, hsl(0 0% 2% / 0.18) 24%, transparent 43%)",
        }}
      />

      <motion.svg
        className="absolute inset-0 z-[2] h-full w-full"
        viewBox="0 0 1400 900"
        preserveAspectRatio="xMidYMid slice"
        xmlns="http://www.w3.org/2000/svg"
        initial={{ opacity: 0, scale: 1.01 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <defs>
          <linearGradient id="panelOuter" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(221 17% 16%)" />
            <stop offset="55%" stopColor="hsl(221 15% 13%)" />
            <stop offset="100%" stopColor="hsl(220 14% 9%)" />
          </linearGradient>
          <linearGradient id="panelInner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(221 18% 13%)" />
            <stop offset="50%" stopColor="hsl(220 17% 11%)" />
            <stop offset="100%" stopColor="hsl(219 16% 8%)" />
          </linearGradient>
          <linearGradient id="goldLine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(40 35% 38%)" />
            <stop offset="22%" stopColor="hsl(41 45% 57%)" />
            <stop offset="50%" stopColor="hsl(43 61% 80%)" />
            <stop offset="78%" stopColor="hsl(41 46% 56%)" />
            <stop offset="100%" stopColor="hsl(39 33% 34%)" />
          </linearGradient>
          <linearGradient id="goldBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(36 33% 26%)" />
            <stop offset="16%" stopColor="hsl(40 46% 45%)" />
            <stop offset="31%" stopColor="hsl(43 59% 73%)" />
            <stop offset="46%" stopColor="hsl(46 70% 87%)" />
            <stop offset="54%" stopColor="hsl(44 65% 78%)" />
            <stop offset="73%" stopColor="hsl(40 46% 44%)" />
            <stop offset="100%" stopColor="hsl(36 30% 24%)" />
          </linearGradient>
          <linearGradient id="bandShadow" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(0 0% 2% / 0.95)" />
            <stop offset="50%" stopColor="hsl(220 10% 8% / 0.9)" />
            <stop offset="100%" stopColor="hsl(0 0% 1% / 0.95)" />
          </linearGradient>
          <radialGradient id="crossGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(46 70% 90% / 0.72)" />
            <stop offset="18%" stopColor="hsl(44 67% 82% / 0.42)" />
            <stop offset="44%" stopColor="hsl(42 41% 56% / 0.18)" />
            <stop offset="100%" stopColor="hsl(42 41% 56% / 0)" />
          </radialGradient>
          <radialGradient id="crossShadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(0 0% 2% / 0.58)" />
            <stop offset="100%" stopColor="hsl(0 0% 2% / 0)" />
          </radialGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="crossBlur" x="-40%" y="-40%" width="180%" height="180%">
            <feGaussianBlur stdDeviation="10" />
          </filter>
        </defs>

        <polygon points="650,0 1400,0 1400,450" fill="url(#panelOuter)" />
        <polygon points="690,0 1400,0 1400,426" fill="url(#panelInner)" />
        <polygon points="730,0 1400,0 1400,402" fill="hsl(220 15% 10% / 0.82)" />

        <polygon points="650,900 1400,900 1400,450" fill="url(#panelOuter)" />
        <polygon points="690,900 1400,900 1400,474" fill="url(#panelInner)" />
        <polygon points="730,900 1400,900 1400,498" fill="hsl(220 15% 10% / 0.82)" />

        <ellipse cx="1392" cy="450" rx="125" ry="118" fill="url(#crossShadow)" filter="url(#crossBlur)" />

        <motion.line
          x1="650"
          y1="0"
          x2="1400"
          y2="450"
          stroke="url(#bandShadow)"
          strokeWidth="25"
          strokeLinecap="square"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.62 }}
          transition={{ duration: 0.9, delay: 0.18 }}
        />
        <motion.line
          x1="650"
          y1="900"
          x2="1400"
          y2="450"
          stroke="url(#bandShadow)"
          strokeWidth="25"
          strokeLinecap="square"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.62 }}
          transition={{ duration: 0.9, delay: 0.24 }}
        />

        <motion.line
          x1="650"
          y1="0"
          x2="1400"
          y2="450"
          stroke="url(#goldBand)"
          strokeWidth="16"
          strokeLinecap="square"
          filter="url(#softGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.3 }}
        />
        <motion.line
          x1="650"
          y1="900"
          x2="1400"
          y2="450"
          stroke="url(#goldBand)"
          strokeWidth="16"
          strokeLinecap="square"
          filter="url(#softGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.9, delay: 0.38 }}
        />

        <line x1="650" y1="0" x2="1400" y2="450" stroke="hsl(46 78% 90% / 0.52)" strokeWidth="3.4" strokeLinecap="square" />
        <line x1="650" y1="900" x2="1400" y2="450" stroke="hsl(46 78% 90% / 0.52)" strokeWidth="3.4" strokeLinecap="square" />

        {topLines.map(({ x1, y1, x2, y2, sw, op }, i) => (
          <motion.line
            key={`top-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#goldLine)"
            strokeWidth={sw}
            opacity={op}
            filter={i < 3 ? "url(#softGlow)" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: op }}
            transition={{ duration: 0.72, ease: EASE, delay: 0.18 + i * 0.035 }}
          />
        ))}

        {bottomLines.map(({ x1, y1, x2, y2, sw, op }, i) => (
          <motion.line
            key={`bottom-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#goldLine)"
            strokeWidth={sw}
            opacity={op}
            filter={i < 3 ? "url(#softGlow)" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity: op }}
            transition={{ duration: 0.72, ease: EASE, delay: 0.22 + i * 0.035 }}
          />
        ))}

        <ellipse cx="1392" cy="450" rx="72" ry="66" fill="url(#crossGlow)" />
        <ellipse cx="1368" cy="428" rx="34" ry="14" fill="hsl(46 77% 90% / 0.34)" filter="url(#softGlow)" transform="rotate(-32 1368 428)" />
      </motion.svg>
    </section>
  );
}
