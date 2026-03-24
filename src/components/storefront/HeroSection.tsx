import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* Gold diagonal lines — top-right corner */
function GoldCornerTR() {
  return (
    <svg
      className="absolute top-0 right-0 w-[55%] h-[55%]"
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Dark layered panels with gold edges */}
      {/* Outermost gold line */}
      <line x1="600" y1="0" x2="0" y2="600" stroke="url(#goldGrad)" strokeWidth="1.5" />
      {/* Second line */}
      <line x1="600" y1="0" x2="60" y2="540" stroke="url(#goldGrad)" strokeWidth="1" opacity="0.7" />
      {/* Third line */}
      <line x1="600" y1="0" x2="120" y2="480" stroke="url(#goldGrad)" strokeWidth="0.8" opacity="0.5" />
      {/* Fourth line */}
      <line x1="600" y1="0" x2="180" y2="420" stroke="url(#goldGrad)" strokeWidth="0.6" opacity="0.35" />
      {/* Fifth thin line */}
      <line x1="600" y1="0" x2="230" y2="370" stroke="url(#goldGrad)" strokeWidth="0.5" opacity="0.25" />

      {/* Dark panels between lines for 3D depth */}
      <polygon points="600,0 600,0 0,600 60,540" fill="#0d0d12" opacity="0.9" />
      <polygon points="600,0 600,0 60,540 120,480" fill="#101018" opacity="0.85" />
      <polygon points="600,0 600,0 120,480 180,420" fill="#131320" opacity="0.7" />
      <polygon points="600,0 600,0 180,420 230,370" fill="#161628" opacity="0.5" />

      {/* Thick gold accent strip */}
      <line x1="600" y1="0" x2="30" y2="570" stroke="url(#goldGrad)" strokeWidth="3" opacity="0.9" />

      <defs>
        <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d4b88a" />
          <stop offset="40%" stopColor="#c5a572" />
          <stop offset="100%" stopColor="#a08050" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* Gold diagonal lines — bottom-left corner */
function GoldCornerBL() {
  return (
    <svg
      className="absolute bottom-0 left-0 w-[55%] h-[55%]"
      viewBox="0 0 600 600"
      preserveAspectRatio="none"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Mirror of top-right */}
      <line x1="0" y1="600" x2="600" y2="0" stroke="url(#goldGrad2)" strokeWidth="1.5" />
      <line x1="0" y1="600" x2="540" y2="60" stroke="url(#goldGrad2)" strokeWidth="1" opacity="0.7" />
      <line x1="0" y1="600" x2="480" y2="120" stroke="url(#goldGrad2)" strokeWidth="0.8" opacity="0.5" />
      <line x1="0" y1="600" x2="420" y2="180" stroke="url(#goldGrad2)" strokeWidth="0.6" opacity="0.35" />
      <line x1="0" y1="600" x2="370" y2="230" stroke="url(#goldGrad2)" strokeWidth="0.5" opacity="0.25" />

      <polygon points="0,600 0,600 600,0 540,60" fill="#0d0d12" opacity="0.9" />
      <polygon points="0,600 0,600 540,60 480,120" fill="#101018" opacity="0.85" />
      <polygon points="0,600 0,600 480,120 420,180" fill="#131320" opacity="0.7" />
      <polygon points="0,600 0,600 420,180 370,230" fill="#161628" opacity="0.5" />

      <line x1="0" y1="600" x2="570" y2="30" stroke="url(#goldGrad2)" strokeWidth="3" opacity="0.9" />

      <defs>
        <linearGradient id="goldGrad2" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#d4b88a" />
          <stop offset="40%" stopColor="#c5a572" />
          <stop offset="100%" stopColor="#a08050" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function HeroSection({ site, banners }: Props) {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg, #0a0a14 0%, #0d0d18 30%, #101020 60%, #0a0a14 100%)" }}>

      {/* === GOLD CORNER LINES — top-right === */}
      <motion.div
        className="absolute inset-0 z-[2]"
        initial={{ opacity: 0, x: 40, y: -40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.3 }}
      >
        <GoldCornerTR />
      </motion.div>

      {/* === GOLD CORNER LINES — bottom-left === */}
      <motion.div
        className="absolute inset-0 z-[2]"
        initial={{ opacity: 0, x: -40, y: 40 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.8, ease: EASE, delay: 0.5 }}
      >
        <GoldCornerBL />
      </motion.div>

      {/* === Subtle radial glow in center === */}
      <div className="absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse 60% 50% at 40% 50%, rgba(197,165,114,0.03) 0%, transparent 70%)"
        }}
      />

      {/* === LOGO + TEXT — centered like magazine === */}
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: EASE, delay: 0.6 }}
        >
          {/* Logo */}
          <motion.img
            src={brandoorsLogo}
            alt="BRANDOORS"
            className="h-16 md:h-20 lg:h-24 mx-auto mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: EASE, delay: 0.8 }}
          />

          {/* Subtitle */}
          <motion.p
            className="text-storefront-gold tracking-[0.25em] text-sm md:text-base lg:text-lg uppercase"
            style={{ fontFamily: "'Raleway', sans-serif" }}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE, delay: 1.1 }}
          >
            Входные и межкомнатные двери
          </motion.p>
        </motion.div>
      </div>

      {/* === BOTTOM BAR === */}
      <motion.div className="absolute bottom-0 left-0 right-0 z-30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.4 }}>
        <div className="flex items-center justify-between px-8 lg:px-16 py-4 border-t border-white/5">
          <span className="text-xs tracking-[0.3em] uppercase text-white/25" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {site?.name || "BRANDOORS"}
          </span>
          <span className="text-xs tracking-[0.2em] text-white/15" style={{ fontFamily: "'Raleway', sans-serif" }}>
            {site?.phone || "+7 (495) 137 77 87"}
          </span>
        </div>
      </motion.div>

      {/* Scroll hint */}
      <motion.div
        className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20"
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.8 }, y: { duration: 2, repeat: Infinity } }}
      >
        <div className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center p-1">
          <motion.div className="w-1 h-2 rounded-full bg-white/20" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}
