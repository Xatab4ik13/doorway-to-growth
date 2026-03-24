import { useState } from "react";
import { motion } from "framer-motion";
import doorArtdeco from "@/assets/doors/artdeco.png";
import doorBauhaus from "@/assets/doors/bauhaus.png";
import doorCapsule from "@/assets/doors/capsule.png";
import doorHorizon from "@/assets/doors/horizon.png";
import doorLines from "@/assets/doors/lines.png";

const DOORS = [
  { src: doorArtdeco, name: "ART DECO" },
  { src: doorBauhaus, name: "BAUHAUS" },
  { src: doorCapsule, name: "CAPSULE" },
  { src: doorHorizon, name: "HORIZON" },
  { src: doorLines, name: "LINES" },
];

function getIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

export function PatternSection() {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
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
    { x: "-72%", scale: 0.55, blur: 8, opacity: 0.25 },
    { x: "-36%", scale: 0.78, blur: 4, opacity: 0.55 },
    { x: "0%", scale: 1, blur: 0, opacity: 1 },
    { x: "36%", scale: 0.78, blur: 4, opacity: 0.55 },
    { x: "72%", scale: 0.55, blur: 8, opacity: 0.25 },
  ];

  return (
    <section
      className="relative w-full overflow-hidden py-16 lg:py-24"
      style={{ backgroundColor: "#07090D" }}
    >
      {/* Section title */}
      <motion.div
        className="text-center mb-12 lg:mb-16 px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-light tracking-[0.15em] uppercase"
          style={{
            fontFamily: "'Raleway', sans-serif",
            color: "#F5F5F0",
          }}
        >
          Коллекция входных дверей
        </h2>
      </motion.div>

      {/* Carousel */}
      <div
        className="relative mx-auto h-[500px] md:h-[620px] lg:h-[720px]"
        style={{ perspective: "1200px" }}
      >
        {positions.map((doorIdx, posIdx) => {
          const cfg = configs[posIdx];
          const isCenter = posIdx === 2;

          return (
            <motion.div
              key={doorIdx}
              className="absolute top-0 left-1/2 h-full flex flex-col items-center justify-center"
              initial={false}
              animate={{
                x: cfg.x,
                scale: cfg.scale,
                opacity: cfg.opacity,
                filter: `blur(${cfg.blur}px)`,
              }}
              transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
              style={{
                translateX: "-50%",
                zIndex: posIdx === 2 ? 10 : posIdx === 1 || posIdx === 3 ? 5 : 1,
              }}
              onHoverStart={() => isCenter && setHovered(doorIdx)}
              onHoverEnd={() => setHovered(null)}
            >
              <motion.img
                src={DOORS[doorIdx].src}
                alt={DOORS[doorIdx].name}
                className="h-[440px] md:h-[540px] lg:h-[640px] w-auto object-contain select-none"
                draggable={false}
                animate={
                  isCenter && hovered === doorIdx
                    ? { y: -12 }
                    : { y: 0 }
                }
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />

              {/* Door name on hover */}
              {isCenter && (
                <motion.span
                  className="mt-4 text-[13px] tracking-[0.35em] uppercase"
                  style={{
                    fontFamily: "'Raleway', sans-serif",
                    color: "rgba(245,245,240,0.6)",
                  }}
                  initial={false}
                  animate={{
                    opacity: hovered === doorIdx ? 1 : 0,
                    y: hovered === doorIdx ? 0 : 8,
                  }}
                  transition={{ duration: 0.35 }}
                >
                  {DOORS[doorIdx].name}
                </motion.span>
              )}
            </motion.div>
          );
        })}

        {/* Invisible click zones — cursor:none so custom cursor handles it */}
        <button
          onClick={prev}
          className="absolute left-0 top-0 w-1/3 h-full z-20 cursor-pointer focus:outline-none"
          aria-label="Previous"
        />
        <button
          onClick={next}
          className="absolute right-0 top-0 w-1/3 h-full z-20 cursor-pointer focus:outline-none"
          aria-label="Next"
        />
      </div>
    </section>
  );
}
