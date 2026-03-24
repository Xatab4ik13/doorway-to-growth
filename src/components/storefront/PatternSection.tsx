import React, { useState, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import doorArtdeco from "@/assets/doors/artdeco.png";
import doorBauhaus from "@/assets/doors/bauhaus.png";
import doorCapsule from "@/assets/doors/capsule.png";
import doorHorizon from "@/assets/doors/horizon.png";
import doorLines from "@/assets/doors/lines.png";

const DOORS = [
  { src: doorArtdeco, alt: "Art Deco" },
  { src: doorBauhaus, alt: "Bauhaus" },
  { src: doorCapsule, alt: "Capsule" },
  { src: doorHorizon, alt: "Horizon" },
  { src: doorLines, alt: "Lines" },
];

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    color: `rgba(245,245,240,${0.02 + i * 0.008})`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg className="w-full h-full" viewBox="0 0 696 316" fill="none">
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke={path.color}
            strokeWidth={path.width}
            strokeOpacity={0.6}
            initial={{ pathLength: 0.3, opacity: 0.4 }}
            animate={{
              pathLength: 1,
              opacity: [0.2, 0.5, 0.2],
              pathOffset: [0, 1],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        ))}
      </svg>
    </div>
  );
}

export function PatternSection() {
  const [currentIndex, setCurrentIndex] = useState(Math.floor(DOORS.length / 2));

  const handleNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % DOORS.length);
  }, []);

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + DOORS.length) % DOORS.length);
  };

  useEffect(() => {
    const timer = setInterval(handleNext, 5000);
    return () => clearInterval(timer);
  }, [handleNext]);

  return (
    <section
      className="relative w-full overflow-hidden py-20 lg:py-32"
      style={{ backgroundColor: "#07090D" }}
    >
      <FloatingPaths position={1} />
      <FloatingPaths position={-1} />

      <div className="relative z-10 flex items-center justify-center h-[420px] md:h-[520px] lg:h-[640px]">
        {/* Carousel */}
        <div className="relative w-full h-full flex items-center justify-center" style={{ perspective: "1200px" }}>
          {DOORS.map((door, index) => {
            const offset = index - currentIndex;
            const total = DOORS.length;
            let pos = (offset + total) % total;
            if (pos > Math.floor(total / 2)) {
              pos = pos - total;
            }

            const isCenter = pos === 0;
            const isAdjacent = Math.abs(pos) === 1;

            return (
              <div
                key={index}
                className="absolute transition-all duration-700 ease-in-out"
                style={{
                  transform: `translateX(${pos * 280}px) scale(${
                    isCenter ? 1 : isAdjacent ? 0.75 : 0.55
                  }) translateZ(${isCenter ? 0 : isAdjacent ? -100 : -200}px)`,
                  zIndex: isCenter ? 30 : isAdjacent ? 20 : 10,
                  opacity: Math.abs(pos) > 1 ? 0.3 : isAdjacent ? 0.6 : 1,
                  filter: isCenter ? "none" : `blur(${isAdjacent ? 3 : 6}px)`,
                  visibility: Math.abs(pos) > 2 ? "hidden" : "visible",
                }}
              >
                <img
                  src={door.src}
                  alt={door.alt}
                  className="h-[360px] md:h-[460px] lg:h-[580px] w-auto object-contain select-none"
                  draggable={false}
                />
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <button
          onClick={handlePrev}
          className="absolute left-4 md:left-8 z-40 p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
          aria-label="Previous"
        >
          <ChevronLeft size={24} />
        </button>
        <button
          onClick={handleNext}
          className="absolute right-4 md:right-8 z-40 p-3 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-white/60 hover:text-white hover:bg-white/10 transition-all duration-300"
          aria-label="Next"
        >
          <ChevronRight size={24} />
        </button>
      </div>
    </section>
  );
}
