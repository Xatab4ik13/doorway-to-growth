import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import doorArtdeco from "@/assets/doors/artdeco.webp";
import doorBauhaus from "@/assets/doors/bauhaus.webp";
import doorInteriorPrime from "@/assets/doors/interior-prime.webp";
import doorInteriorEstetica from "@/assets/doors/interior-estetica.webp";
import doorInteriorGhost from "@/assets/doors/interior-ghost.webp";
import doorInteriorReflect from "@/assets/doors/interior-reflect.webp";

type CollectionItem = { src: string; name: string };

// Входные: 2 коллекции
const ENTRANCE_COLLECTIONS: CollectionItem[] = [
  { src: doorArtdeco, name: "Квартирные двери" },
  { src: doorBauhaus, name: "Двери с терморазрывом" },
];

// Межкомнатные: 6 коллекций
const INTERIOR_COLLECTIONS: CollectionItem[] = [
  { src: doorInteriorPrime, name: "PRIME" },
  { src: doorInteriorEstetica, name: "ESTETICA" },
  { src: doorInteriorGhost, name: "GHOST" },
  { src: doorInteriorReflect, name: "HEAVY" },
  { src: doorInteriorPrime, name: "ESTETICA EMALE" },
  { src: doorInteriorEstetica, name: "MAZE" },
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
  const [hovered, setHovered] = useState<number | null>(null);
  const len = items.length;

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
        : len === 2
          ? [current, getIndex(current + 1, len)]
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

  const configs2 = [
    { x: "-25%", scale: 0.85, blur: 3, opacity: 0.6 },
    { x: "25%", scale: 0.85, blur: 3, opacity: 0.6 },
  ];

  const configs1 = [{ x: "0%", scale: 1, blur: 0, opacity: 1 }];

  const configs = len >= 5 ? configs5 : len >= 3 ? configs3 : len === 2 ? configs2 : configs1;
  const centerIdx = len >= 5 ? 2 : len >= 3 ? 1 : 0;

  return (
    <div className="relative mx-auto h-[500px] md:h-[620px] lg:h-[720px]" style={{ perspective: "1200px" }}>
      {positions.map((doorIdx, posIdx) => {
        const cfg = configs[posIdx];
        const isCenter = len === 2 ? false : posIdx === centerIdx;

        return (
          <motion.div
            key={`${doorIdx}-${posIdx}`}
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
            onClick={() => onSelect(items[doorIdx].name)}
            onHoverStart={() => setHovered(doorIdx)}
            onHoverEnd={() => setHovered(null)}
            role="button"
            tabIndex={0}
          >
            <motion.img
              src={items[doorIdx].src}
              alt={items[doorIdx].name}
              className="h-[400px] md:h-[480px] lg:h-[560px] w-auto object-contain select-none"
              draggable={false}
              animate={hovered === doorIdx ? { y: -12 } : { y: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            />

            {/* Collection name below each image */}
            <motion.span
              className="mt-6 text-[13px] md:text-[14px] tracking-[0.3em] uppercase text-center"
              style={{
                fontFamily: "'Raleway', sans-serif",
                color: (isCenter || len <= 2) ? "rgba(245,245,240,0.8)" : "rgba(245,245,240,0.4)",
              }}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 }}
            >
              {items[doorIdx].name}
            </motion.span>
          </motion.div>
        );
      })}

      {/* Visible navigation arrows */}
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
