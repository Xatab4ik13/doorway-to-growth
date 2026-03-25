import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import doorArtdeco from "@/assets/doors/artdeco.webp";
import doorBauhaus from "@/assets/doors/bauhaus.webp";
import doorCapsule from "@/assets/doors/capsule.webp";
import doorHorizon from "@/assets/doors/horizon.webp";
import doorLines from "@/assets/doors/lines.webp";
import doorSmart from "@/assets/doors/smart.webp";
import doorInteriorPrime from "@/assets/doors/interior-prime.webp";
import doorInteriorEstetica from "@/assets/doors/interior-estetica.webp";
import doorInteriorGhost from "@/assets/doors/interior-ghost.webp";
import doorInteriorReflect from "@/assets/doors/interior-reflect.webp";

type DoorItem = { src: string; name: string };

const ENTRANCE_DOORS: DoorItem[] = [
  { src: doorArtdeco, name: "ART DECO" },
  { src: doorBauhaus, name: "BAUHAUS" },
  { src: doorCapsule, name: "CAPSULE" },
  { src: doorHorizon, name: "HORIZON" },
  { src: doorLines, name: "LINES" },
  { src: doorSmart, name: "SMART" },
];

const INTERIOR_DOORS: DoorItem[] = [
  { src: doorInteriorPrime, name: "PRIME" },
  { src: doorInteriorEstetica, name: "ESTETICA" },
  { src: doorInteriorGhost, name: "GHOST" },
  { src: doorInteriorReflect, name: "REFLECT" },
];

const TABS = [
  { key: "entrance", label: "ВХОДНЫЕ" },
  { key: "interior", label: "МЕЖКОМНАТНЫЕ" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function getIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

function DoorCarousel({ doors }: { doors: DoorItem[] }) {
  const [current, setCurrent] = useState(0);
  const [hovered, setHovered] = useState<number | null>(null);
  const len = doors.length;

  if (len === 0) return null;

  const prev = () => setCurrent((c) => getIndex(c - 1, len));
  const next = () => setCurrent((c) => getIndex(c + 1, len));

  const positions =
    len >= 5
      ? [
          getIndex(current - 2, len),
          getIndex(current - 1, len),
          current,
          getIndex(current + 1, len),
          getIndex(current + 2, len),
        ]
      : len >= 3
        ? [
            getIndex(current - 1, len),
            current,
            getIndex(current + 1, len),
          ]
        : [current];

  const configs5 = [
    { x: "-72%", scale: 0.55, blur: 8, opacity: 0.25 },
    { x: "-36%", scale: 0.78, blur: 4, opacity: 0.55 },
    { x: "0%", scale: 1, blur: 0, opacity: 1 },
    { x: "36%", scale: 0.78, blur: 4, opacity: 0.55 },
    { x: "72%", scale: 0.55, blur: 8, opacity: 0.25 },
  ];

  const configs3 = [
    { x: "-40%", scale: 0.75, blur: 4, opacity: 0.5 },
    { x: "0%", scale: 1, blur: 0, opacity: 1 },
    { x: "40%", scale: 0.75, blur: 4, opacity: 0.5 },
  ];

  const configs1 = [{ x: "0%", scale: 1, blur: 0, opacity: 1 }];

  const configs = len >= 5 ? configs5 : len >= 3 ? configs3 : configs1;
  const centerIdx = len >= 5 ? 2 : len >= 3 ? 1 : 0;

  return (
    <div
      className="relative mx-auto h-[500px] md:h-[620px] lg:h-[720px]"
      style={{ perspective: "1200px" }}
    >
      {positions.map((doorIdx, posIdx) => {
        const cfg = configs[posIdx];
        const isCenter = posIdx === centerIdx;

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
              zIndex: isCenter ? 10 : posIdx === centerIdx - 1 || posIdx === centerIdx + 1 ? 5 : 1,
            }}
            onHoverStart={() => isCenter && setHovered(doorIdx)}
            onHoverEnd={() => setHovered(null)}
          >
            <motion.img
              src={doors[doorIdx].src}
              alt={doors[doorIdx].name}
              className="h-[440px] md:h-[540px] lg:h-[640px] w-auto object-contain select-none"
              draggable={false}
              animate={
                isCenter && hovered === doorIdx ? { y: -12 } : { y: 0 }
              }
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />

            {isCenter && (
              <motion.span
                className="mt-4 text-[13px] tracking-[0.35em] uppercase"
                style={{
                  fontFamily: "'Raleway', sans-serif",
                  color: "rgba(245,245,240,0.6)",
                }}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.15 }}
              >
                {doors[doorIdx].name}
              </motion.span>
            )}
          </motion.div>
        );
      })}

      {len > 1 && (
        <>
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
        </>
      )}
    </div>
  );
}

export function PatternSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("entrance");

  const doorsMap: Record<TabKey, DoorItem[]> = {
    entrance: ENTRANCE_DOORS,
    interior: INTERIOR_DOORS,
  };

  return (
    <section
      className="relative w-full overflow-hidden py-16 lg:py-24"
      style={{ backgroundColor: "#07090D" }}
    >
      {/* Section title */}
      <motion.div
        className="text-center mb-8 lg:mb-10 px-8"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
      >
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.2em] uppercase"
          style={{
            fontFamily: "'Raleway', sans-serif",
            color: "#F5F5F0",
          }}
        >
          Doors Collection
        </h2>
      </motion.div>

      {/* Tabs */}
      <div className="flex justify-center gap-8 mb-10 lg:mb-14">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className="text-[13px] md:text-[14px] font-semibold tracking-[0.3em] uppercase transition-colors duration-300 focus:outline-none"
            style={{
              fontFamily: "'Raleway', sans-serif",
              color: activeTab === tab.key ? "#F5F5F0" : "rgba(245,245,240,0.35)",
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Carousel */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <DoorCarousel doors={doorsMap[activeTab]} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
