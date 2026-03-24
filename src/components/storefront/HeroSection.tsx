import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

interface LineConfig {
  dist: number;
  width: number;
  type: "thin" | "thick";
  delay: number;
}

const LINES: LineConfig[] = [
  { dist: 40, width: 2, type: "thin", delay: 0 },
  { dist: 65, width: 2, type: "thin", delay: 0.03 },
  { dist: 90, width: 2, type: "thin", delay: 0.06 },
  { dist: 115, width: 2, type: "thin", delay: 0.09 },
  { dist: 140, width: 2, type: "thin", delay: 0.12 },
  { dist: 165, width: 2, type: "thin", delay: 0.15 },
  { dist: 190, width: 2, type: "thin", delay: 0.18 },
  { dist: 250, width: 16, type: "thick", delay: 0.25 },
  { dist: 310, width: 24, type: "thick", delay: 0.35 },
  { dist: 400, width: 40, type: "thick", delay: 0.45 },
];

function GoldStripe({ line, corner }: { line: LineConfig; corner: "tr" | "bl" }) {
  const isThin = line.type === "thin";

  const gradient = isThin
    ? `linear-gradient(90deg, transparent 0%, #a08c50 15%, #c5a572 35%, #d4bc8a 50%, #c5a572 65%, #a08c50 85%, transparent 100%)`
    : `linear-gradient(90deg, 
        transparent 0%,
        #7a6838 6%,
        #a89050 14%,
        #c5a572 24%,
        #d8c490 36%,
        #e8d8a8 46%,
        #f2e8b8 50%,
        #e8d8a8 54%,
        #d8c490 64%,
        #c5a572 76%,
        #a89050 86%,
        #7a6838 94%,
        transparent 100%)`;

  const shadow = isThin
    ? "0 1px 4px rgba(0,0,0,0.5)"
    : `0 ${line.width * 0.6}px ${line.width * 2}px rgba(0,0,0,0.85),
       0 ${line.width * 0.2}px ${line.width * 0.6}px rgba(0,0,0,0.7),
       inset 0 1px 0 rgba(255,245,210,0.25),
       inset 0 -1px 0 rgba(0,0,0,0.3)`;

  /* 
   * Key insight: position at corner, rotate 45°, then use translateX 
   * (perpendicular to the line) to offset each stripe.
   * For top-right: anchor at top-right corner, rotate 45° clockwise
   * For bottom-left: anchor at bottom-left corner, rotate 45° clockwise
   */
  const style: React.CSSProperties =
    corner === "tr"
      ? {
          position: "absolute",
          top: 0,
          right: 0,
          width: 3000,
          height: line.width,
          transformOrigin: "top right",
          transform: `rotate(45deg) translateY(${line.dist}px)`,
          background: gradient,
          boxShadow: shadow,
        }
      : {
          position: "absolute",
          bottom: 0,
          left: 0,
          width: 3000,
          height: line.width,
          transformOrigin: "bottom left",
          transform: `rotate(45deg) translateY(-${line.dist + line.width}px)`,
          background: gradient,
          boxShadow: shadow,
        };

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1, delay: 0.3 + line.delay, ease: EASE }}
    />
  );
}

export function HeroSection({ site, banners }: Props) {
  return (
    <section
      className="relative h-screen min-h-[700px] overflow-hidden select-none"
      style={{ background: "linear-gradient(145deg, #0c0c0e 0%, #111114 30%, #0e0e10 60%, #08080a 100%)" }}
    >
      {/* Vignette */}
      <div className="absolute inset-0 z-[1]"
        style={{ background: "radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.5) 100%)" }}
      />

      {/* === TOP-RIGHT GOLD LINES === */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        {LINES.map((line, i) => (
          <GoldStripe key={`tr-${i}`} line={line} corner="tr" />
        ))}
      </div>

      {/* === BOTTOM-LEFT GOLD LINES === */}
      <div className="absolute inset-0 pointer-events-none z-[5] overflow-hidden">
        {LINES.map((line, i) => (
          <GoldStripe key={`bl-${i}`} line={line} corner="bl" />
        ))}
      </div>

      {/* Shadow "crease" between thick bars — 3D depth */}
      {["tr", "bl"].map((corner) => (
        <motion.div
          key={`shadow-${corner}`}
          className="absolute pointer-events-none z-[6]"
          style={{
            ...(corner === "tr"
              ? { top: 0, right: 0, width: 3000, height: 60, transformOrigin: "top right", transform: "rotate(45deg) translateY(330px)" }
              : { bottom: 0, left: 0, width: 3000, height: 60, transformOrigin: "bottom left", transform: "rotate(45deg) translateY(-390px)" }),
            background: "linear-gradient(90deg, transparent 5%, rgba(0,0,0,0.5) 20%, rgba(0,0,0,0.85) 50%, rgba(0,0,0,0.5) 80%, transparent 95%)",
            filter: "blur(15px)",
          }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.8 }}
        />
      ))}

      {/* Ambient gold glow near corners */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] pointer-events-none z-[4]"
        style={{ background: "radial-gradient(circle at top right, rgba(197,165,114,0.06) 0%, transparent 60%)" }}
      />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] pointer-events-none z-[4]"
        style={{ background: "radial-gradient(circle at bottom left, rgba(197,165,114,0.06) 0%, transparent 60%)" }}
      />

      {/* === LEFT GOLD SIDEBAR === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-20 hidden lg:flex flex-col items-center justify-between py-10 overflow-hidden"
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #cfbb96 0%, #c2b08c 10%, #b2a07c 25%, #a59370 40%, #9a8a69 55%, #887555 70%, #78674b 85%, #6e5f40 100%)",
          borderRadius: "0 48px 48px 0",
        }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      >
        <div className="flex flex-col items-center gap-1 mt-12 relative z-10">
          <span className="text-3xl font-bold" style={{ color: "#1a1408" }}>01</span>
          <span className="text-xs" style={{ color: "rgba(26,20,8,0.35)" }}>/ 01</span>
        </div>
        <img src={brandoorsLogo} alt="Brandoors" className="relative z-10"
          style={{ filter: "brightness(0)", opacity: 0.8, transform: "rotate(-90deg)", width: "auto", height: "55px" }}
        />
        <div className="flex flex-col gap-3 mb-4 relative z-10">
          {[
            { href: "https://vk.com", icon: "M12.77 19.15h1.33s.4-.04.61-.27c.19-.2.18-.59.18-.59s-.03-1.8.81-2.07c.83-.26 1.89 1.73 3.02 2.5.85.58 1.5.45 1.5.45l3.01-.04s1.57-.1.83-1.33c-.06-.1-.44-.92-2.26-2.61-1.9-1.77-1.65-1.48.64-4.54 1.4-1.86 1.96-3 1.78-3.49-.16-.46-1.16-.34-1.16-.34l-3.39.02s-.25-.03-.44.08c-.18.11-.3.36-.3.36s-.53 1.42-1.24 2.63c-1.5 2.55-2.1 2.69-2.34 2.53-.57-.37-.43-1.52-.43-2.33 0-2.53.39-3.59-.75-3.86-.38-.09-.65-.15-1.62-.16-1.24-.01-2.29 0-2.88.29-.39.2-.7.63-.51.65.23.03.75.14 1.03.52.36.49.35 1.59.35 1.59s.2 2.98-.48 3.35c-.47.25-1.12-.26-2.5-2.6-.67-1.19-1.18-2.51-1.18-2.51s-.1-.24-.27-.37c-.22-.16-.52-.21-.52-.21l-3.22.02s-.48.01-.66.22c-.16.19-.01.58-.01.58s2.51 5.87 5.35 8.83c2.6 2.71 5.55 2.53 5.55 2.53z" },
            { href: "https://t.me", icon: "M11.94 24c6.6 0 12-5.4 12-12s-5.4-12-12-12-12 5.4-12 12 5.4 12 12 12zm-3.85-8.4l.42-3.97 7.47-6.76c.33-.3-.07-.44-.51-.18l-9.22 5.81-3.56-1.11c-.77-.24-.78-.77.16-1.14l13.9-5.36c.64-.29 1.24.15 1 1.14l-2.37 11.16c-.17.8-.65.99-1.31.62l-3.62-2.67-1.75 1.69c-.19.2-.36.36-.71.36z" },
          ].map((s, i) => (
            <a key={i} href={s.href} target="_blank" rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center border transition-all duration-300"
              style={{ borderColor: "rgba(26,20,8,0.15)" }}
              onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.4)"; }}
              onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.15)"; }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.5)" }}><path d={s.icon} /></svg>
            </a>
          ))}
        </div>
      </motion.div>

      {/* === CENTER — Logo + Subtitle === */}
      <div className="absolute inset-0 z-10 flex items-center justify-center lg:pl-[260px]">
        <div className="flex flex-col items-center text-center">
          <motion.img
            src={brandoorsLogo}
            alt="BRANDOORS"
            className="h-16 md:h-20 lg:h-24 w-auto mb-6"
            style={{ filter: "brightness(1.1) sepia(0.3) saturate(1.5) hue-rotate(-10deg)" }}
            initial={{ opacity: 0, scale: 0.85 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.6, ease: EASE }}
          />
          <motion.p
            className="text-base md:text-lg tracking-[0.25em] uppercase"
            style={{ fontFamily: "'Raleway', sans-serif", fontWeight: 300, color: "rgba(197,165,114,0.7)" }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: EASE }}
          >
            Входные и межкомнатные двери
          </motion.p>
        </div>
      </div>

      {/* === BOTTOM BAR === */}
      <motion.div className="absolute bottom-0 left-0 right-0 z-30 lg:pl-[260px]"
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
