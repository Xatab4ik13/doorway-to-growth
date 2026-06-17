import { useState, useEffect, memo } from "react";
import { useNavigate, useParams } from "react-router-dom";
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

const ENTRANCE_COLLECTIONS: CollectionItem[] = [
  { src: colKvartirnye, name: "Входные двери" },
  { src: colUlichnye, name: "Двери с терморазрывом" },
];

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

const CollectionCarousel = memo(function CollectionCarousel({
  items,
  onSelect,
}: {
  items: CollectionItem[];
  onSelect: (name: string) => void;
}) {
  const [current, setCurrent] = useState(0);
  const len = items.length;
  useEffect(() => { setCurrent(0); }, [items]);

  const [isMobile, setIsMobile] = useState(() =>
    typeof window !== "undefined" ? window.innerWidth < 768 : false
  );

  useEffect(() => {
    const onResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  if (len === 0) return null;

  const prev = () => setCurrent((c) => getIndex(c - 1, len));
  const next = () => setCurrent((c) => getIndex(c + 1, len));

  const visible: { idx: number; offset: number }[] = [];
  if (isMobile) {
    visible.push({ idx: current, offset: 0 });
  } else if (len >= 5) {
    for (let o = -2; o <= 2; o++) visible.push({ idx: getIndex(current + o, len), offset: o });
  } else if (len >= 3) {
    for (let o = -1; o <= 1; o++) visible.push({ idx: getIndex(current + o, len), offset: o });
  } else if (len === 2) {
    // Show current centered + the other at the side; arrows rotate which is active.
    visible.push({ idx: current, offset: 0 });
    visible.push({ idx: getIndex(current + 1, len), offset: 1 });
  } else {
    visible.push({ idx: current, offset: 0 });
  }

  const getStyle = (offset: number) => {
    const absOff = Math.abs(offset);
    const xPercent = offset * 38;
    const scale = absOff === 0 ? 1 : absOff <= 1 ? 0.78 : 0.55;
    // Replaced expensive blur with opacity dimming (GPU cheap)
    const opacity = absOff === 0 ? 1 : absOff <= 1 ? 0.45 : 0.2;
    const z = absOff === 0 ? 10 : absOff <= 1 ? 5 : 1;
    return { xPercent, scale, opacity, z };
  };


  return (
    <div className="relative mx-auto h-[500px] md:h-[620px] lg:h-[720px] overflow-hidden">
      {visible.map(({ idx, offset }) => {
        const s = getStyle(offset);
        const isCenter = offset === 0;

        return (
          <div
            key={`${idx}-${offset}`}
            className="absolute top-0 left-1/2 h-full flex flex-col items-center justify-center cursor-pointer"
            style={{
              transform: `translate3d(calc(-50% + ${s.xPercent}%), 0, 0) scale(${s.scale})`,
              opacity: s.opacity,
              zIndex: s.z,
              transition: "transform 500ms cubic-bezier(0.76,0,0.24,1), opacity 500ms cubic-bezier(0.76,0,0.24,1)",
              willChange: "transform, opacity",
            }}
            onClick={() => (isCenter ? onSelect(items[idx].name) : setCurrent(idx))}
          >
            <img
              src={items[idx].src}
              alt={items[idx].name}
              loading="lazy"
              decoding="async"
              className="h-[400px] md:h-[480px] lg:h-[560px] w-auto object-contain select-none rounded-3xl"
              draggable={false}
            />
            <span
              className="mt-6 text-[13px] md:text-[14px] tracking-[0.3em] uppercase text-center"
              style={{
                fontFamily: "'Raleway', sans-serif",
                color: isCenter ? "rgba(245,245,240,0.8)" : "rgba(245,245,240,0.4)",
              }}
            >
              {items[idx].name}
            </span>
          </div>
        );
      })}


      {len > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-6 md:left-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border flex items-center justify-center transition-colors duration-300 hover:bg-white/5"
            style={{ borderColor: "rgba(245,245,240,0.15)" }}
            aria-label="Предыдущая"
          >
            <ChevronLeft className="w-6 h-6" style={{ color: "rgba(245,245,240,0.5)" }} />
          </button>
          <button
            onClick={next}
            className="absolute right-6 md:right-12 top-1/2 -translate-y-1/2 z-30 w-14 h-14 rounded-full border flex items-center justify-center transition-colors duration-300 hover:bg-white/5"
            style={{ borderColor: "rgba(245,245,240,0.15)" }}
            aria-label="Следующая"
          >
            <ChevronRight className="w-6 h-6" style={{ color: "rgba(245,245,240,0.5)" }} />
          </button>
        </>
      )}
    </div>
  );
});

export function PatternSection() {
  const [activeTab, setActiveTab] = useState<TabKey>("interior");
  const navigate = useNavigate();
  const { slug } = useParams<{ slug: string }>();

  const collectionsMap: Record<TabKey, CollectionItem[]> = {
    entrance: ENTRANCE_COLLECTIONS,
    interior: INTERIOR_COLLECTIONS,
  };

  const handleSelect = (name: string) => {
    if (activeTab === "entrance") {
      navigate(`/store/${slug}/catalog/list?category=entrance-doors`);
    } else {
      navigate(`/store/${slug}/catalog/list?category=mezhkomnatnye-dveri&collection=${encodeURIComponent(name)}`);
    }
  };


  return (
    <section
      className="relative w-full overflow-hidden py-16 lg:py-24"
      style={{ backgroundColor: "#07090D" }}
    >
      <div className="text-center mb-8 lg:mb-10 px-8 animate-fade-in">
        <h2
          className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.2em] uppercase"
          style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
        >
          Doors Collection
        </h2>
      </div>

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

      <CollectionCarousel items={collectionsMap[activeTab]} onSelect={handleSelect} />
    </section>
  );
}
