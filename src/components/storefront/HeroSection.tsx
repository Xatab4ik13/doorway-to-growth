import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import brandoorsLogo from "@/assets/logo.png";
import heroBg from "@/assets/hero-bg-hq.jpg";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroSection({ site, banners }: Props) {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-[#080808]">

      {/* === BACKGROUND — exact magazine layout === */}
      <motion.div
        className="absolute inset-0 z-[1]"
        initial={{ opacity: 0, scale: 1.05 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.5, ease: EASE }}
      >
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
        />
      </motion.div>

      {/* === BOTTOM BAR === */}
      <motion.div className="absolute bottom-0 left-0 right-0 z-30"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 1, delay: 1.2 }}>
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
        className="absolute bottom-16 left-1/2 lg:left-[calc(260px+(100%-260px)/2)] -translate-x-1/2 z-20"
        initial={{ opacity: 0 }} animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}
      >
        <div className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center p-1">
          <motion.div className="w-1 h-2 rounded-full bg-white/20" animate={{ y: [0, 12, 0] }} transition={{ duration: 2, repeat: Infinity }} />
        </div>
      </motion.div>
    </section>
  );
}
