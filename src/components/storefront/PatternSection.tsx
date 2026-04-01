import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";

import colPrime from "@/assets/collections/prime.webp";
import colEstetica from "@/assets/collections/estetica.webp";
import colGhost from "@/assets/collections/ghost.webp";
import colHeavy from "@/assets/collections/heavy.webp";
import colEsteticaEmale from "@/assets/collections/estetica-emale.webp";
import colMaze from "@/assets/collections/maze.webp";
import colKvartirnye from "@/assets/collections/kvartirnye.webp";
import colUlichnye from "@/assets/collections/ulichnye.webp";

type CollectionItem = { src: string; name: string };

// Входные: 2 коллекции
const ENTRANCE_COLLECTIONS: CollectionItem[] = [
  { src: colKvartirnye, name: "Квартирные двери" },
  { src: colUlichnye, name: "Двери с терморазрывом" },
];

// Межкомнатные: 6 коллекций
const INTERIOR_COLLECTIONS: CollectionItem[] = [
  { src: colPrime, name: "PRIME" },
  { src: colEstetica, name: "ESTETICA" },
  { src: colGhost, name: "GHOST" },
  { src: colHeavy, name: "HEAVY" },
  { src: colEsteticaEmale, name: "ESTETICA EMALE" },
  { src: colMaze, name: "MAZE" },
];

const TABS = [
  { key: "interior", label: "МЕЖКОМНАТНЫЕ" },
  { key: "entrance", label: "ВХОДНЫЕ" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

function getIndex(i: number, len: number) {
  return ((i % len) + len) % len;
}

function CollectionCarousel({ items, onSelect }: { items: CollectionItem[]; onSelect: (name: string) => void }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const len = items.length;

  if (len === 0) return null;

  const prev = () => {
    setDirection(-1);
    setCurrent((c) => getIndex(c - 1, len));
  };
  const next = () => {
    setDirection(1);
    setCurrent((c) => getIndex(c + 1, len));
  };

  // Build visible positions array
  const visible: { idx: number; offset: number }[] = [];
  if (len >= 5) {
    for (let o = -2; o <= 2; o++) visible.push({ idx: getIndex(current + o, len), offset: o });
  } else if (len >= 3) {
    for (let o = -1; o <= 1; o++) visible.push({ idx: getIndex(current + o, len), offset: o });
  } else if (len === 2) {
    // Show both side by side, both fully visible
    visible.push({ idx: 0, offset: -0.7 }, { idx: 1, offset: 0.7 });
  } else {
    visible.push({ idx: current, offset: 0 });
  }

  const getStyle = (offset: number) => {
    if (len === 2) {
      // Both items equally visible, no blur, full opacity
      return { xPercent: offset * 38, scale: 0.9, blur: 0, opacity: 1, z: 5 };
    }
    const absOff = Math.abs(offset);
    const xPercent = offset * 38;
    const scale = absOff === 0 ? 1 : absOff <= 1 ? 0.78 : 0.55;
    const blur = absOff === 0 ? 0 : absOff <= 1 ? 4 : 8;
    const opacity = absOff === 0 ? 1 : absOff <= 1 ? 0.6 : 0.3;
    const z = absOff === 0 ? 10 : absOff <= 1 ? 5 : 1;
    return { xPercent, scale, blur, opacity, z };
  };

  return (
    <div className="relative mx-auto h-[500px] md:h-[620px] lg:h-[720px] overflow-hidden">
      {visible.map(({ idx, offset }) => {
        const s = getStyle(offset);
        const isCenter = len > 2 && offset === 0;

        return (
          <motion.div
            key={idx}
            className="absolute top-0 left-1/2 h-full flex flex-col items-center justify-center cursor-pointer"
            animate={{
              x: `calc(-50% + ${s.xPercent}%)`,
              scale: s.scale,
              opacity: s.opacity,
              filter: `blur(${s.blur}px)`,
            }}
            transition={{ duration: 0.5, ease: [0.76, 0, 0.24, 1] }}
            style={{ zIndex: s.z }}
            onClick={() => onSelect(items[idx].name)}
          >
            <motion.img
              src={items[idx].src}
              alt={items[idx].name}
              className="h-[400px] md:h-[480px] lg:h-[560px] w-auto object-contain select-none rounded-3xl"
              draggable={false}
              whileHover={{ y: -12 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />

            <span
              className="mt-6 text-[13px] md:text-[14px] tracking-[0.3em] uppercase text-center"
              style={{
                fontFamily: "'Raleway', sans-serif",
                color: (isCenter || len <= 2) ? "rgba(245,245,240,0.8)" : "rgba(245,245,240,0.4)",
              }}
            >
              {items[idx].name}
            </span>
          </motion.div>
        );
      })}

      {len > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 hover:bg-white/5"
            style={{ borderColor: "rgba(245,245,240,0.15)" }}
            aria-label="Предыдущая"
          >
            <ChevronLeft className="w-6 h-6" style={{ color: "rgba(245,245,240,0.5)" }} />
          </button>
          <button
            onClick={next}
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border flex items-center justify-center transition-all duration-300 hover:bg-white/5"
            style={{ borderColor: "rgba(245,245,240,0.15)" }}
            aria-label="Следующая"
          >
            <ChevronRight className="w-6 h-6" style={{ color: "rgba(245,245,240,0.5)" }} />
          </button>
        </>
      )}
    </div>
  );
}

export function PatternSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("interior");
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const collectionsMap: Record<TabKey, CollectionItem[]> = {
    entrance: ENTRANCE_COLLECTIONS,
    interior: INTERIOR_COLLECTIONS,
  };

  const handleSelect = (name: string) => {
    navigate(`/store/${slug}/catalog?collection=${encodeURIComponent(name)}`);
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

      {/* Tabs — МЕЖКОМНАТНЫЕ first */}
      <div className="flex justify-center gap-8 mb-6 lg:mb-8">
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
          <CollectionCarousel items={collectionsMap[activeTab]} onSelect={handleSelect} />
        </motion.div>
      </AnimatePresence>
    </section>
  );
}
