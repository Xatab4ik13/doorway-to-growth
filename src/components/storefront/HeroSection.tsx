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
const MEET_X = 1400;
const MEET_Y = 450;

export function HeroSection({ site: _site, banners: _banners }: Props) {
  const topLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 28;
    const x1 = 780 + i * gap;

    return {
      x1,
      y1: 0,
      x2: MEET_X,
      y2: SLOPE * (MEET_X - x1),
      sw: i === 0 ? 2 : i < 3 ? 1.45 : 1,
      opacity: 1 - i * 0.07,
    };
  });

  const bottomLines = Array.from({ length: 10 }, (_, i) => {
    const gap = 28;
    const x1 = 780 + i * gap;

    return {
      x1,
      y1: 900,
      x2: MEET_X,
      y2: 900 - SLOPE * (MEET_X - x1),
      sw: i === 0 ? 2 : i < 3 ? 1.45 : 1,
      opacity: 1 - i * 0.07,
    };
  });

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg">
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(ellipse 82% 76% at 56% 48%, hsl(0 0% 12%) 0%, hsl(0 0% 9%) 34%, hsl(0 0% 5%) 68%, hsl(0 0% 2%) 100%)",
        }}
      />

      <div
        className="absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, hsl(0 0% 2% / 0.94) 0%, hsl(0 0% 2% / 0.4) 24%, transparent 44%)",
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
          <linearGradient id="panelOuter" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(0 0% 14%)" />
            <stop offset="55%" stopColor="hsl(0 0% 10%)" />
            <stop offset="100%" stopColor="hsl(0 0% 6%)" />
          </linearGradient>
          <linearGradient id="panelInner" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(0 0% 11%)" />
            <stop offset="60%" stopColor="hsl(0 0% 8%)" />
            <stop offset="100%" stopColor="hsl(0 0% 4%)" />
          </linearGradient>
          <linearGradient id="goldThin" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(38 30% 30%)" />
            <stop offset="32%" stopColor="hsl(41 37% 52%)" />
            <stop offset="52%" stopColor="hsl(43 46% 74%)" />
            <stop offset="74%" stopColor="hsl(41 37% 52%)" />
            <stop offset="100%" stopColor="hsl(38 28% 28%)" />
          </linearGradient>
          <linearGradient id="goldBand" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(36 28% 22%)" />
            <stop offset="18%" stopColor="hsl(39 36% 40%)" />
            <stop offset="38%" stopColor="hsl(43 47% 67%)" />
            <stop offset="50%" stopColor="hsl(45 58% 82%)" />
            <stop offset="60%" stopColor="hsl(43 47% 67%)" />
            <stop offset="82%" stopColor="hsl(39 36% 40%)" />
            <stop offset="100%" stopColor="hsl(36 28% 22%)" />
          </linearGradient>
          <linearGradient id="bandShade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="hsl(0 0% 3%)" />
            <stop offset="50%" stopColor="hsl(0 0% 9%)" />
            <stop offset="100%" stopColor="hsl(0 0% 3%)" />
          </linearGradient>
          <linearGradient id="nodeHighlight" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="hsl(45 52% 82% / 0.95)" />
            <stop offset="45%" stopColor="hsl(42 42% 62% / 0.55)" />
            <stop offset="100%" stopColor="hsl(0 0% 8% / 0)" />
          </linearGradient>
          <filter id="softGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.25" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <polygon points="650,0 1400,0 1400,450" fill="url(#panelOuter)" />
        <polygon points="700,0 1400,0 1400,420" fill="url(#panelInner)" />
        <polygon points="746,0 1400,0 1400,392" fill="hsl(0 0% 7% / 0.88)" />

        <polygon points="650,900 1400,900 1400,450" fill="url(#panelOuter)" />
        <polygon points="700,900 1400,900 1400,480" fill="url(#panelInner)" />
        <polygon points="746,900 1400,900 1400,508" fill="hsl(0 0% 7% / 0.88)" />

        <motion.line
          x1="650"
          y1="0"
          x2={MEET_X}
          y2={MEET_Y}
          stroke="url(#bandShade)"
          strokeWidth="26"
          strokeLinecap="square"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.78 }}
          transition={{ duration: 0.6, delay: 0.08 }}
        />
        <motion.line
          x1="650"
          y1="900"
          x2={MEET_X}
          y2={MEET_Y}
          stroke="url(#bandShade)"
          strokeWidth="26"
          strokeLinecap="square"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.78 }}
          transition={{ duration: 0.6, delay: 0.12 }}
        />

        <motion.line
          x1="650"
          y1="0"
          x2={MEET_X}
          y2={MEET_Y}
          stroke="url(#goldBand)"
          strokeWidth="15"
          strokeLinecap="square"
          filter="url(#softGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.15 }}
        />
        <motion.line
          x1="650"
          y1="900"
          x2={MEET_X}
          y2={MEET_Y}
          stroke="url(#goldBand)"
          strokeWidth="15"
          strokeLinecap="square"
          filter="url(#softGlow)"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.7, delay: 0.2 }}
        />

        <line
          x1="650"
          y1="0"
          x2={MEET_X}
          y2={MEET_Y}
          stroke="hsl(45 62% 88% / 0.38)"
          strokeWidth="2.2"
          strokeLinecap="square"
        />
        <line
          x1="650"
          y1="900"
          x2={MEET_X}
          y2={MEET_Y}
          stroke="hsl(45 62% 88% / 0.38)"
          strokeWidth="2.2"
          strokeLinecap="square"
        />

        {topLines.map(({ x1, y1, x2, y2, sw, opacity }, i) => (
          <motion.line
            key={`top-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#goldThin)"
            strokeWidth={sw}
            opacity={opacity}
            filter={i < 2 ? "url(#softGlow)" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.08 + i * 0.025 }}
          />
        ))}

        {bottomLines.map(({ x1, y1, x2, y2, sw, opacity }, i) => (
          <motion.line
            key={`bottom-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="url(#goldThin)"
            strokeWidth={sw}
            opacity={opacity}
            filter={i < 2 ? "url(#softGlow)" : undefined}
            initial={{ opacity: 0 }}
            animate={{ opacity }}
            transition={{ duration: 0.55, ease: EASE, delay: 0.1 + i * 0.025 }}
          />
        ))}

        <polygon
          points="1348,450 1400,412 1400,488"
          fill="hsl(0 0% 5% / 0.86)"
        />
        <polygon
          points="1360,450 1400,420 1400,480"
          fill="url(#nodeHighlight)"
        />
      </motion.svg>
    </section>
  );
}
