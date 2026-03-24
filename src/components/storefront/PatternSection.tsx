import { motion } from "framer-motion";
import patternBg from "@/assets/pattern-background.svg";
import doorArtdeco from "@/assets/doors/artdeco.png";
import doorBauhaus from "@/assets/doors/bauhaus.png";
import doorCapsule from "@/assets/doors/capsule.png";
import doorHorizon from "@/assets/doors/horizon.png";
import doorLines from "@/assets/doors/lines.png";

const DOORS = [doorArtdeco, doorBauhaus, doorCapsule, doorHorizon, doorLines];

export function PatternSection() {
  return (
    <section className="relative w-full overflow-hidden" style={{ backgroundColor: "#07090d" }}>
      <img
        src={patternBg}
        alt=""
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        draggable={false}
      />
      <div className="relative z-10 mx-auto max-w-[1400px] px-8 py-20 lg:py-28">
        <div className="grid grid-cols-5 gap-4 lg:gap-6">
          {DOORS.map((src, i) => (
            <motion.div
              key={i}
              className="flex items-center justify-center cursor-pointer h-[360px] md:h-[460px] lg:h-[560px]"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.7,
                delay: i * 0.1,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
              whileHover={{
                scale: 1.06,
                y: -12,
                transition: { duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] },
              }}
            >
              <img
                src={src}
                alt=""
                className="h-full w-auto object-contain drop-shadow-[0_16px_32px_rgba(0,0,0,0.6)]"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
