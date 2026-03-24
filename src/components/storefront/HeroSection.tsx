import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

/* Each line: offset from corner, thickness, opacity, gold intensity */
const TOP_RIGHT_LINES = [
  { offset: 40, thickness: 1.5, opacity: 0.5, delay: 0.1 },
  { offset: 70, thickness: 1.5, opacity: 0.55, delay: 0.15 },
  { offset: 100, thickness: 1.5, opacity: 0.6, delay: 0.2 },
  { offset: 130, thickness: 1.5, opacity: 0.6, delay: 0.25 },
  { offset: 160, thickness: 1.5, opacity: 0.65, delay: 0.3 },
  { offset: 200, thickness: 2, opacity: 0.7, delay: 0.35 },
  { offset: 240, thickness: 3, opacity: 0.8, delay: 0.4 },
  { offset: 290, thickness: 5, opacity: 0.9, delay: 0.45 },
  { offset: 340, thickness: 7, opacity: 1, delay: 0.5 },
];

const BOTTOM_LEFT_LINES = [
  { offset: 40, thickness: 1.5, opacity: 0.5, delay: 0.15 },
  { offset: 70, thickness: 1.5, opacity: 0.55, delay: 0.2 },
  { offset: 100, thickness: 1.5, opacity: 0.6, delay: 0.25 },
  { offset: 130, thickness: 1.5, opacity: 0.6, delay: 0.3 },
  { offset: 160, thickness: 1.5, opacity: 0.65, delay: 0.35 },
  { offset: 200, thickness: 2, opacity: 0.7, delay: 0.4 },
  { offset: 240, thickness: 3, opacity: 0.8, delay: 0.45 },
  { offset: 290, thickness: 5, opacity: 0.9, delay: 0.5 },
  { offset: 340, thickness: 7, opacity: 1, delay: 0.55 },
];

function GoldLine({
  corner,
  offset,
  thickness,
  opacity,
  delay,
}: {
  corner: "top-right" | "bottom-left";
  offset: number;
  thickness: number;
  opacity: number;
  delay: number;
}) {
  const isTopRight = corner === "top-right";

  /* The line goes diagonally at 45°. For top-right corner, it starts from
     the top edge and goes to the right edge. We position using a rotated div. */
  const lineLength = 800; // long enough to span the corner

  const style: React.CSSProperties = isTopRight
    ? {
        position: "absolute",
        top: -lineLength / 2 + offset,
        right: -lineLength / 2 + offset,
        width: lineLength,
        height: thickness,
        transformOrigin: "center center",
        transform: "rotate(45deg)",
        background: `linear-gradient(90deg, 
          transparent 0%, 
          rgba(160,130,70,${opacity * 0.3}) 15%,
          rgba(197,165,114,${opacity * 0.9}) 35%,
          rgba(220,195,140,${opacity}) 50%,
          rgba(197,165,114,${opacity * 0.9}) 65%,
          rgba(160,130,70,${opacity * 0.3}) 85%,
          transparent 100%)`,
        boxShadow:
          thickness > 3
            ? `0 0 ${thickness * 3}px rgba(197,165,114,${opacity * 0.3}), 0 0 ${thickness}px rgba(197,165,114,${opacity * 0.15})`
            : `0 0 ${thickness * 2}px rgba(197,165,114,${opacity * 0.15})`,
      }
    : {
        position: "absolute",
        bottom: -lineLength / 2 + offset,
        left: -lineLength / 2 + offset,
        width: lineLength,
        height: thickness,
        transformOrigin: "center center",
        transform: "rotate(45deg)",
        background: `linear-gradient(90deg, 
          transparent 0%, 
          rgba(160,130,70,${opacity * 0.3}) 15%,
          rgba(197,165,114,${opacity * 0.9}) 35%,
          rgba(220,195,140,${opacity}) 50%,
          rgba(197,165,114,${opacity * 0.9}) 65%,
          rgba(160,130,70,${opacity * 0.3}) 85%,
          transparent 100%)`,
        boxShadow:
          thickness > 3
            ? `0 0 ${thickness * 3}px rgba(197,165,114,${opacity * 0.3}), 0 0 ${thickness}px rgba(197,165,114,${opacity * 0.15})`
            : `0 0 ${thickness * 2}px rgba(197,165,114,${opacity * 0.15})`,
      };

  return (
    <motion.div
      style={style}
      initial={{ opacity: 0, scale: 0.7 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 1.2,
        delay: delay + 0.3,
        ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
      }}
    />
  );
}

/* Subtle ambient glow near the gold line clusters */
function CornerGlow({ corner }: { corner: "top-right" | "bottom-left" }) {
  const isTopRight = corner === "top-right";
  return (
    <motion.div
      className="absolute pointer-events-none"
      style={{
        ...(isTopRight
          ? { top: -100, right: -100, width: 500, height: 500 }
          : { bottom: -100, left: -100, width: 500, height: 500 }),
        background: `radial-gradient(circle, rgba(197,165,114,0.08) 0%, rgba(197,165,114,0.03) 40%, transparent 70%)`,
      }}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 0.8 }}
    />
  );
}

export function HeroSection({ site, banners }: Props) {
  /* Subtle shimmer animation on the thick lines */
  const [shimmer, setShimmer] = useState(false);
  useEffect(() => {
    const interval = setInterval(() => {
      setShimmer((s) => !s);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none"
      style={{ background: "linear-gradient(135deg, #0a0a0a 0%, #111111 40%, #0d0d0d 70%, #080808 100%)" }}>

      {/* Subtle noise texture overlay */}
      <div className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
        }}
      />

      {/* === TOP-RIGHT DIAGONAL GOLD LINES === */}
      <div className="absolute top-0 right-0 w-full h-full pointer-events-none z-[1]">
        <CornerGlow corner="top-right" />
        {TOP_RIGHT_LINES.map((line, i) => (
          <GoldLine key={`tr-${i}`} corner="top-right" {...line} />
        ))}
      </div>

      {/* === BOTTOM-LEFT DIAGONAL GOLD LINES === */}
      <div className="absolute bottom-0 left-0 w-full h-full pointer-events-none z-[1]">
        <CornerGlow corner="bottom-left" />
        {BOTTOM_LEFT_LINES.map((line, i) => (
          <GoldLine key={`bl-${i}`} corner="bottom-left" {...line} />
        ))}
      </div>

      {/* === DEPTH SHADOW between line clusters — creates the "fold" effect === */}
      <div className="absolute top-0 right-0 pointer-events-none z-[2]"
        style={{
          width: "600px",
          height: "600px",
          background: `linear-gradient(225deg, transparent 40%, rgba(0,0,0,0.6) 55%, transparent 70%)`,
          transform: "translate(10%, -10%)",
        }}
      />
      <div className="absolute bottom-0 left-0 pointer-events-none z-[2]"
        style={{
          width: "600px",
          height: "600px",
          background: `linear-gradient(45deg, transparent 40%, rgba(0,0,0,0.6) 55%, transparent 70%)`,
          transform: "translate(-10%, 10%)",
        }}
      />

      {/* === LEFT GOLD SIDEBAR (preserved) === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-20 hidden lg:flex flex-col items-center justify-between py-10 overflow-hidden"
        style={{
          width: "260px",
          background: "linear-gradient(180deg, #cfbb96 0%, #c2b08c 10%, #b2a07c 25%, #a59370 40%, #9a8a69 55%, #887555 70%, #78674b 85%, #6e5f40 100%)",
          borderRadius: "0 48px 48px 0",
        }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] as [number, number, number, number], delay: 0.1 }}
      >
        <div className="flex flex-col items-center gap-1 mt-12 relative z-10">
          <span className="text-3xl font-bold" style={{ color: "#1a1408" }}>01</span>
          <span className="text-xs" style={{ color: "rgba(26,20,8,0.35)" }}>/ 01</span>
        </div>

        <img
          src={brandoorsLogo}
          alt="Brandoors"
          className="relative z-10"
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
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.5)" }}>
                <path d={s.icon} />
              </svg>
            </a>
          ))}
        </div>
      </motion.div>

      {/* === CENTER CONTENT — Logo + Subtitle === */}
      <div className="absolute inset-0 z-10 flex items-center justify-center lg:pl-[260px]">
        <div className="flex flex-col items-center text-center">
          {/* Logo */}
          <motion.img
            src={brandoorsLogo}
            alt="BRANDOORS"
            className="h-16 md:h-20 lg:h-24 w-auto mb-6"
            style={{ filter: "brightness(1.1) sepia(0.3) saturate(1.5) hue-rotate(-10deg)" }}
            initial={{ opacity: 0, scale: 0.8, filter: "blur(20px) brightness(1.1) sepia(0.3) saturate(1.5) hue-rotate(-10deg)" }}
            animate={{ opacity: 1, scale: 1, filter: "blur(0px) brightness(1.1) sepia(0.3) saturate(1.5) hue-rotate(-10deg)" }}
            transition={{ duration: 1.2, delay: 0.6, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          />

          {/* Subtitle */}
          <motion.p
            className="text-base md:text-lg tracking-[0.25em] uppercase"
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              color: "rgba(197,165,114,0.7)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] }}
          >
            Входные и межкомнатные двери
          </motion.p>
        </div>
      </div>

      {/* === BOTTOM INFO BAR === */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30 lg:pl-[260px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="flex items-center justify-between px-8 lg:px-16 py-4 border-t border-white/5">
          <span className="text-xs tracking-[0.3em] uppercase text-white/25"
            style={{ fontFamily: "'Raleway', sans-serif" }}>
            {site?.name || "BRANDOORS"}
          </span>
          <span className="text-xs tracking-[0.2em] text-white/15"
            style={{ fontFamily: "'Raleway', sans-serif" }}>
            {site?.phone || "+7 (495) 137 77 87"}
          </span>
        </div>
      </motion.div>

      {/* === SCROLL HINT === */}
      <motion.div
        className="absolute bottom-16 left-1/2 lg:left-[calc(260px+(100%-260px)/2)] -translate-x-1/2 z-20 flex flex-col items-center gap-2"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 8, 0] }}
        transition={{ opacity: { delay: 1.5 }, y: { duration: 2, repeat: Infinity } }}
      >
        <div className="w-5 h-8 border border-white/10 rounded-full flex items-start justify-center p-1">
          <motion.div
            className="w-1 h-2 rounded-full bg-white/20"
            animate={{ y: [0, 12, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </div>
      </motion.div>
    </section>
  );
}
