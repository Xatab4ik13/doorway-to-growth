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

/*
 * Magazine page 2 composition breakdown:
 *
 * 1. Background: deep dark navy-charcoal gradient, slightly lighter center-right
 * 2. Top-right corner: ~8 thin parallel gold lines at 45°, radiating from corner
 * 3. Bottom-right corner: ~8 thin parallel gold lines at -45°, radiating from corner
 * 4. Between groups: one thick gold diagonal band creating 3D fold effect
 * 5. Dark triangular panels between lines have subtle depth shadows
 */

function TopRightLines() {
  const lines = [
    { offset: 0, width: 3, opacity: 1 },
    { offset: 28, width: 1.5, opacity: 0.95 },
    { offset: 56, width: 1.5, opacity: 0.9 },
    { offset: 84, width: 1.5, opacity: 0.85 },
    { offset: 112, width: 1.5, opacity: 0.8 },
    { offset: 140, width: 1.5, opacity: 0.75 },
    { offset: 168, width: 1.5, opacity: 0.7 },
    { offset: 196, width: 1.2, opacity: 0.65 },
    { offset: 224, width: 1, opacity: 0.55 },
    { offset: 252, width: 1, opacity: 0.45 },
  ];

  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      {lines.map((line, i) => (
        <div
          key={`tr-${i}`}
          className="absolute"
          style={{
            top: 0,
            right: -200 + line.offset,
            width: "150%",
            height: `${line.width}px`,
            transformOrigin: "top right",
            transform: "rotate(45deg)",
            background:
              "linear-gradient(90deg, transparent 0%, hsla(41, 42%, 72%, 0.3) 10%, hsla(41, 42%, 72%, 0.95) 30%, hsla(43, 48%, 78%, 1) 50%, hsla(41, 38%, 62%, 0.9) 70%, hsla(38, 32%, 48%, 0.6) 90%, transparent 100%)",
            opacity: line.opacity,
          }}
        />
      ))}
    </div>
  );
}

function BottomRightLines() {
  const lines = [
    { offset: 0, width: 3, opacity: 1 },
    { offset: 28, width: 1.5, opacity: 0.95 },
    { offset: 56, width: 1.5, opacity: 0.9 },
    { offset: 84, width: 1.5, opacity: 0.85 },
    { offset: 112, width: 1.5, opacity: 0.8 },
    { offset: 140, width: 1.5, opacity: 0.75 },
    { offset: 168, width: 1.5, opacity: 0.7 },
    { offset: 196, width: 1.2, opacity: 0.6 },
    { offset: 224, width: 1, opacity: 0.5 },
  ];

  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      {lines.map((line, i) => (
        <div
          key={`br-${i}`}
          className="absolute"
          style={{
            bottom: 0,
            right: -200 + line.offset,
            width: "150%",
            height: `${line.width}px`,
            transformOrigin: "bottom right",
            transform: "rotate(-45deg)",
            background:
              "linear-gradient(90deg, transparent 0%, hsla(41, 42%, 72%, 0.3) 10%, hsla(41, 42%, 72%, 0.95) 30%, hsla(43, 48%, 78%, 1) 50%, hsla(41, 38%, 62%, 0.9) 70%, hsla(38, 32%, 48%, 0.6) 90%, transparent 100%)",
            opacity: line.opacity,
          }}
        />
      ))}
    </div>
  );
}

function GoldBand() {
  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Thick gold diagonal band — the main 3D fold accent */}
      <div
        className="absolute"
        style={{
          bottom: 0,
          right: -200,
          width: "150%",
          height: "18px",
          transformOrigin: "bottom right",
          transform: "rotate(-45deg)",
          background:
            "linear-gradient(180deg, hsla(43, 34%, 32%, 0.9) 0%, hsla(43, 48%, 72%, 1) 20%, hsla(45, 55%, 82%, 1) 42%, hsla(43, 48%, 72%, 1) 65%, hsla(41, 38%, 42%, 0.9) 100%)",
          boxShadow:
            "0 -8px 24px hsla(0, 0%, 0%, 0.5), 0 8px 24px hsla(0, 0%, 0%, 0.5), 0 0 12px hsla(43, 48%, 68%, 0.15)",
        }}
      />
      {/* Matching band on top-right side */}
      <div
        className="absolute"
        style={{
          top: 0,
          right: -200,
          width: "150%",
          height: "18px",
          transformOrigin: "top right",
          transform: "rotate(45deg)",
          background:
            "linear-gradient(180deg, hsla(43, 34%, 32%, 0.9) 0%, hsla(43, 48%, 72%, 1) 20%, hsla(45, 55%, 82%, 1) 42%, hsla(43, 48%, 72%, 1) 65%, hsla(41, 38%, 42%, 0.9) 100%)",
          boxShadow:
            "0 -8px 24px hsla(0, 0%, 0%, 0.5), 0 8px 24px hsla(0, 0%, 0%, 0.5), 0 0 12px hsla(43, 48%, 68%, 0.15)",
        }}
      />
    </div>
  );
}

function DarkPanels() {
  return (
    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none">
      {/* Top-right dark triangular panel — between outer lines and gold band */}
      <div
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 45vw 45vw 0",
          borderColor:
            "transparent hsla(220, 16%, 10%, 0.97) transparent transparent",
        }}
      />
      {/* Inner panel with slightly different shade for depth */}
      <div
        className="absolute"
        style={{
          top: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 42vw 42vw 0",
          borderColor:
            "transparent hsla(222, 18%, 12%, 0.95) transparent transparent",
        }}
      />

      {/* Bottom-right dark triangular panel */}
      <div
        className="absolute"
        style={{
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 0 45vw 45vw",
          borderColor:
            "transparent transparent hsla(220, 16%, 10%, 0.97) transparent",
        }}
      />
      <div
        className="absolute"
        style={{
          bottom: 0,
          right: 0,
          width: 0,
          height: 0,
          borderStyle: "solid",
          borderWidth: "0 0 42vw 42vw",
          borderColor:
            "transparent transparent hsla(222, 18%, 12%, 0.95) transparent",
        }}
      />
    </div>
  );
}

export function HeroSection({ site: _site, banners: _banners }: Props) {
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

      {/* Dark panels creating depth layers */}
      <motion.div
        className="absolute inset-0 z-[1]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, ease: EASE }}
      >
        <DarkPanels />
      </motion.div>

      {/* Gold lines — top right */}
      <motion.div
        className="absolute inset-0 z-[2]"
        initial={{ opacity: 0, x: 30, y: -30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.2 }}
      >
        <TopRightLines />
      </motion.div>

      {/* Gold lines — bottom right */}
      <motion.div
        className="absolute inset-0 z-[2]"
        initial={{ opacity: 0, x: 30, y: 30 }}
        animate={{ opacity: 1, x: 0, y: 0 }}
        transition={{ duration: 1.2, ease: EASE, delay: 0.35 }}
      >
        <BottomRightLines />
      </motion.div>

      {/* Thick gold bands */}
      <motion.div
        className="absolute inset-0 z-[3]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1, ease: EASE, delay: 0.5 }}
      >
        <GoldBand />
      </motion.div>

      {/* Subtle ambient light in center-right */}
      <div
        className="absolute inset-0 z-[4] pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse 40% 35% at 62% 48%, hsla(220, 14%, 18%, 0.15) 0%, transparent 100%)",
        }}
      />
    </section>
  );
}
