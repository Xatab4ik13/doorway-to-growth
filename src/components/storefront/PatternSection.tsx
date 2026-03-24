import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import doorArtdeco from "@/assets/doors/artdeco.png";
import doorBauhaus from "@/assets/doors/bauhaus.png";
import doorCapsule from "@/assets/doors/capsule.png";
import doorHorizon from "@/assets/doors/horizon.png";
import doorLines from "@/assets/doors/lines.png";

const DOORS = [doorArtdeco, doorBauhaus, doorCapsule, doorHorizon, doorLines];

function getIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

export function PatternSection() {
  const [current, setCurrent] = useState(0);
  const len = DOORS.length;

  const prev = () => setCurrent((c) => getIndex(c - 1, len));
  const next = () => setCurrent((c) => getIndex(c + 1, len));

  const positions = [
    getIndex(current - 2, len),
    getIndex(current - 1, len),
    current,
    getIndex(current + 1, len),
    getIndex(current + 2, len),
  ];

  const configs = [
    { x: "-75%", scale: 0.5, z: -200, blur: 8, opacity: 0.3 },
    { x: "-38%", scale: 0.72, z: -100, blur: 4, opacity: 0.6 },
    { x: "0%", scale: 1, z: 0, blur: 0, opacity: 1 },
    { x: "38%", scale: 0.72, z: -100, blur: 4, opacity: 0.6 },
    { x: "75%", scale: 0.5, z: -200, blur: 8, opacity: 0.3 },
  ];

  return (
    <section
      className="relative w-full overflow-hidden py-20 lg:py-32"
      style={{ backgroundColor: "#07090d" }}
    >
      <div className="relative mx-auto h-[420px] md:h-[520px] lg:h-[640px]" style={{ perspective: "1200px" }}>
        {positions.map((doorIdx, posIdx) => {
          const cfg = configs[posIdx];
          return (
            <motion.div
              key={doorIdx}
              className="absolute top-0 left-1/2 h-full flex items-center justify-center"
              initial={false}
              animate={{
                x: cfg.x,
                scale: cfg.scale,
                opacity: cfg.opacity,
                filter: `blur(${cfg.blur}px)`,
              }}
              transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
              style={{
                translateX: "-50%",
                zIndex: posIdx === 2 ? 10 : posIdx === 1 || posIdx === 3 ? 5 : 1,
              }}
            >
              <img
                src={DOORS[doorIdx]}
                alt=""
                className="h-[360px] md:h-[460px] lg:h-[580px] w-auto object-contain select-none"
                draggable={false}
              />
            </motion.div>
          );
        })}

        {/* Hit areas for navigation */}
        <button
          onClick={prev}
          className="absolute left-0 top-0 w-1/3 h-full z-20 cursor-w-resize focus:outline-none"
          aria-label="Previous"
        />
        <button
          onClick={next}
          className="absolute right-0 top-0 w-1/3 h-full z-20 cursor-e-resize focus:outline-none"
          aria-label="Next"
        />
      </div>
    </section>
  );
}
