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
      <div className="relative z-10 mx-auto max-w-[1400px] px-6 py-24">
        <div className="flex items-end justify-center gap-6 md:gap-10 lg:gap-14">
          {DOORS.map((src, i) => (
            <motion.div
              key={i}
              className="flex-shrink-0"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                duration: 0.8,
                delay: i * 0.12,
                ease: [0.25, 0.46, 0.45, 0.94],
              }}
            >
              <img
                src={src}
                alt=""
                className="h-[340px] md:h-[440px] lg:h-[540px] w-auto object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.5)]"
                draggable={false}
              />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
