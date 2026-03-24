import { useState, useRef, useCallback } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";
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

export function PatternSection() {
  const [hovered, setHovered] = useState<number | null>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const isDragging = useRef(false);

  const handleDragEnd = useCallback(() => {
    isDragging.current = false;
    if (!trackRef.current) return;
    const trackW = trackRef.current.scrollWidth;
    const containerW = trackRef.current.parentElement?.clientWidth ?? 0;
    const maxDrag = -(trackW - containerW);
    const current = x.get();
    if (current > 0) animate(x, 0, { type: "spring", stiffness: 300, damping: 30 });
    else if (current < maxDrag) animate(x, maxDrag, { type: "spring", stiffness: 300, damping: 30 });
  }, [x]);

  return (
    <section
      className="relative w-full overflow-hidden py-20 lg:py-32"
      style={{ backgroundColor: "#07090d" }}
    >
      {/* Заголовок секции */}
      <div className="mx-auto max-w-[1400px] px-8 mb-14">
        <motion.h2
          className="text-[13px] uppercase tracking-[0.3em] font-medium"
          style={{ color: "rgba(197,165,114,0.6)", fontFamily: "'Raleway', sans-serif" }}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          Коллекции
        </motion.h2>
      </div>

      {/* Карусель */}
      <div className="relative overflow-hidden cursor-grab active:cursor-grabbing">
        <motion.div
          ref={trackRef}
          className="flex gap-8 lg:gap-12 px-8 lg:px-[calc((100vw-1400px)/2+2rem)]"
          style={{ x }}
          drag="x"
          dragConstraints={{ left: -2000, right: 0 }}
          dragElastic={0.1}
          onDragStart={() => { isDragging.current = true; }}
          onDragEnd={handleDragEnd}
        >
          {DOORS.map((door, i) => (
            <motion.div
              key={i}
              className="relative flex-shrink-0 flex flex-col items-center"
              onHoverStart={() => setHovered(i)}
              onHoverEnd={() => setHovered(null)}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <motion.div
                className="relative"
                animate={{
                  y: hovered === i ? -16 : 0,
                }}
                transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              >
                <img
                  src={door.src}
                  alt={door.name}
                  className="h-[400px] md:h-[500px] lg:h-[600px] w-auto object-contain select-none"
                  draggable={false}
                  style={{
                    filter: hovered === i
                      ? "drop-shadow(0 30px 50px rgba(0,0,0,0.7))"
                      : "drop-shadow(0 12px 24px rgba(0,0,0,0.4))",
                    transition: "filter 0.4s ease",
                  }}
                />
              </motion.div>

              {/* Название коллекции */}
              <motion.span
                className="mt-6 text-[12px] tracking-[0.25em] uppercase font-medium select-none"
                style={{ color: "rgba(245,245,240,0.5)", fontFamily: "'Raleway', sans-serif" }}
                initial={false}
                animate={{
                  opacity: hovered === i ? 1 : 0,
                  y: hovered === i ? 0 : 8,
                }}
                transition={{ duration: 0.3, ease: "easeOut" }}
              >
                {door.name}
              </motion.span>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
