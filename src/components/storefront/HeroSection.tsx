import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import brandoorsLogo from "@/assets/logo.png";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/*
 * The reference has two groups of diagonal lines at 45°:
 * - Top-right corner: ~6 thin parallel lines, then 2-3 thick gold "sheets" with deep 3D shadows
 * - Bottom-left corner: mirror of the same
 * The thick sheets have a metallic gradient and strong drop shadows creating depth.
 */

function DiagonalLines({ corner }: { corner: "top-right" | "bottom-left" }) {
  const isTR = corner === "top-right";

  /* Lines are defined from outermost (corner edge) to innermost.
     type: "thin" = decorative fine line, "thick" = bold metallic sheet with 3D shadow */
  const lines: Array<{
    offset: number;
    width: number;
    type: "thin" | "thick";
    delay: number;
  }> = [
    // Outermost thin cluster
    { offset: 0, width: 1.5, type: "thin", delay: 0 },
    { offset: 22, width: 1.5, type: "thin", delay: 0.03 },
    { offset: 44, width: 1.5, type: "thin", delay: 0.06 },
    { offset: 66, width: 1.5, type: "thin", delay: 0.09 },
    { offset: 88, width: 1.5, type: "thin", delay: 0.12 },
    { offset: 110, width: 1.5, type: "thin", delay: 0.15 },
    { offset: 132, width: 1.5, type: "thin", delay: 0.18 },
    // Gap then thick metallic bars
    { offset: 175, width: 12, type: "thick", delay: 0.25 },
    { offset: 220, width: 18, type: "thick", delay: 0.35 },
    { offset: 280, width: 28, type: "thick", delay: 0.45 },
  ];

  return (
    <div
      className="absolute pointer-events-none z-[5]"
      style={{
        ...(isTR ? { top: 0, right: 0 } : { bottom: 0, left: 0 }),
        width: "100%",
        height: "100%",
        overflow: "hidden",
      }}
    >
      {lines.map((line, i) => {
        const len = 1400;
        const isThin = line.type === "thin";

        /* Gold metallic gradient — thicker bars get richer gradient */
        const gradient = isThin
          ? `linear-gradient(90deg, transparent 5%, rgba(180,155,90,0.6) 25%, rgba(210,185,120,0.8) 50%, rgba(180,155,90,0.6) 75%, transparent 95%)`
          : `linear-gradient(90deg, 
              transparent 2%,
              rgba(120,100,50,0.7) 10%,
              rgba(185,160,95,1) 25%,
              rgba(225,200,140,1) 40%,
              rgba(240,220,160,1) 50%,
              rgba(225,200,140,1) 60%,
              rgba(185,160,95,1) 75%,
              rgba(120,100,50,0.7) 90%,
              transparent 98%)`;

        /* 3D shadow — only on thick bars, creates the depth/fold illusion */
        const shadow = isThin
          ? "none"
          : `0 ${line.width * 0.4}px ${line.width * 1.2}px rgba(0,0,0,0.7), 
             0 ${line.width * 0.15}px ${line.width * 0.4}px rgba(0,0,0,0.5),
             0 0 ${line.width * 2}px rgba(197,165,114,0.15)`;

        const posStyle: React.CSSProperties = isTR
          ? {
              position: "absolute",
              top: -len / 2 + line.offset * 1.3,
              right: -len / 2 + line.offset * 1.3,
              width: len,
              height: line.width,
              transform: "rotate(45deg)",
              transformOrigin: "center center",
            }
          : {
              position: "absolute",
              bottom: -len / 2 + line.offset * 1.3,
              left: -len / 2 + line.offset * 1.3,
              width: len,
              height: line.width,
              transform: "rotate(45deg)",
              transformOrigin: "center center",
            };

        return (
          <motion.div
            key={i}
            style={{
              ...posStyle,
              background: gradient,
              boxShadow: shadow,
              borderRadius: isThin ? 0 : 1,
            }}
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 + line.delay, ease: EASE }}
          />
        );
      })}

      {/* Deep shadow "fold" between thick bars — the 3D crease */}
      <motion.div
        style={{
          position: "absolute",
          ...(isTR
            ? {
                top: -700 + 220 * 1.3,
                right: -700 + 220 * 1.3,
                width: 1400,
                height: 40,
                transform: "rotate(45deg)",
                transformOrigin: "center center",
                background: "linear-gradient(90deg, transparent 10%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.5) 70%, transparent 90%)",
                filter: "blur(8px)",
              }
            : {
                bottom: -700 + 220 * 1.3,
                left: -700 + 220 * 1.3,
                width: 1400,
                height: 40,
                transform: "rotate(45deg)",
                transformOrigin: "center center",
                background: "linear-gradient(90deg, transparent 10%, rgba(0,0,0,0.5) 30%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.5) 70%, transparent 90%)",
                filter: "blur(8px)",
              }),
        }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.8 }}
      />
    </div>
  );
}

export function HeroSection({ site, banners }: Props) {
  return (
    <section
      className="relative h-screen min-h-[700px] overflow-hidden select-none"
      style={{ background: "linear-gradient(145deg, #0c0c0e 0%, #111114 30%, #0e0e10 60%, #08080a 100%)" }}
    >
      {/* Subtle vignette */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: "radial-gradient(ellipse at center, transparent 40%, rgba(0,0,0,0.4) 100%)",
        }}
      />

      {/* === DIAGONAL GOLD LINE CLUSTERS === */}
      <DiagonalLines corner="top-right" />
      <DiagonalLines corner="bottom-left" />

      {/* === LEFT GOLD SIDEBAR === */}
      <motion.div
        className="absolute left-0 top-0 bottom-0 z-20 hidden lg:flex flex-col items-center justify-between py-10 overflow-hidden"
        style={{
          width: "260px",
          background:
            "linear-gradient(180deg, #cfbb96 0%, #c2b08c 10%, #b2a07c 25%, #a59370 40%, #9a8a69 55%, #887555 70%, #78674b 85%, #6e5f40 100%)",
          borderRadius: "0 48px 48px 0",
        }}
        initial={{ x: -260 }}
        animate={{ x: 0 }}
        transition={{ duration: 0.8, ease: EASE, delay: 0.1 }}
      >
        <div className="flex flex-col items-center gap-1 mt-12 relative z-10">
          <span className="text-3xl font-bold" style={{ color: "#1a1408" }}>
            01
          </span>
          <span className="text-xs" style={{ color: "rgba(26,20,8,0.35)" }}>
            / 01
          </span>
        </div>

        <img
          src={brandoorsLogo}
          alt="Brandoors"
          className="relative z-10"
          style={{
            filter: "brightness(0)",
            opacity: 0.8,
            transform: "rotate(-90deg)",
            width: "auto",
            height: "55px",
          }}
        />

        <div className="flex flex-col gap-3 mb-4 relative z-10">
          {[
            {
              href: "https://vk.com",
              icon: "M12.77 19.15h1.33s.4-.04.61-.27c.19-.2.18-.59.18-.59s-.03-1.8.81-2.07c.83-.26 1.89 1.73 3.02 2.5.85.58 1.5.45 1.5.45l3.01-.04s1.57-.1.83-1.33c-.06-.1-.44-.92-2.26-2.61-1.9-1.77-1.65-1.48.64-4.54 1.4-1.86 1.96-3 1.78-3.49-.16-.46-1.16-.34-1.16-.34l-3.39.02s-.25-.03-.44.08c-.18.11-.3.36-.3.36s-.53 1.42-1.24 2.63c-1.5 2.55-2.1 2.69-2.34 2.53-.57-.37-.43-1.52-.43-2.33 0-2.53.39-3.59-.75-3.86-.38-.09-.65-.15-1.62-.16-1.24-.01-2.29 0-2.88.29-.39.2-.7.63-.51.65.23.03.75.14 1.03.52.36.49.35 1.59.35 1.59s.2 2.98-.48 3.35c-.47.25-1.12-.26-2.5-2.6-.67-1.19-1.18-2.51-1.18-2.51s-.1-.24-.27-.37c-.22-.16-.52-.21-.52-.21l-3.22.02s-.48.01-.66.22c-.16.19-.01.58-.01.58s2.51 5.87 5.35 8.83c2.6 2.71 5.55 2.53 5.55 2.53z",
            },
            {
              href: "https://t.me",
              icon: "M11.94 24c6.6 0 12-5.4 12-12s-5.4-12-12-12-12 5.4-12 12 5.4 12 12 12zm-3.85-8.4l.42-3.97 7.47-6.76c.33-.3-.07-.44-.51-.18l-9.22 5.81-3.56-1.11c-.77-.24-.78-.77.16-1.14l13.9-5.36c.64-.29 1.24.15 1 1.14l-2.37 11.16c-.17.8-.65.99-1.31.62l-3.62-2.67-1.75 1.69c-.19.2-.36.36-.71.36z",
            },
          ].map((s, i) => (
            <a
              key={i}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              className="w-8 h-8 flex items-center justify-center border transition-all duration-300"
              style={{ borderColor: "rgba(26,20,8,0.15)" }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.4)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = "rgba(26,20,8,0.15)";
              }}
            >
              <svg viewBox="0 0 24 24" className="w-3.5 h-3.5" style={{ fill: "rgba(26,20,8,0.5)" }}>
                <path d={s.icon} />
              </svg>
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
            style={{
              fontFamily: "'Raleway', sans-serif",
              fontWeight: 300,
              color: "rgba(197,165,114,0.7)",
            }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1, ease: EASE }}
          >
            Входные и межкомнатные двери
          </motion.p>
        </div>
      </div>

      {/* === BOTTOM BAR === */}
      <motion.div
        className="absolute bottom-0 left-0 right-0 z-30 lg:pl-[260px]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, delay: 1.2 }}
      >
        <div className="flex items-center justify-between px-8 lg:px-16 py-4 border-t border-white/5">
          <span
            className="text-xs tracking-[0.3em] uppercase text-white/25"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            {site?.name || "BRANDOORS"}
          </span>
          <span
            className="text-xs tracking-[0.2em] text-white/15"
            style={{ fontFamily: "'Raleway', sans-serif" }}
          >
            {site?.phone || "+7 (495) 137 77 87"}
          </span>
        </div>
      </motion.div>

      {/* === SCROLL HINT === */}
      <motion.div
        className="absolute bottom-16 left-1/2 lg:left-[calc(260px+(100%-260px)/2)] -translate-x-1/2 z-20"
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
