import { memo, useState, useRef, useEffect } from "react";
import { DoorOpen } from "lucide-react";

type System = {
  id: string;
  name: string;
  tag: string;
  description: string;
  video: string;
};

const SYSTEMS: System[] = [
  {
    id: "invisible",
    name: "Invisible",
    tag: "Скрытая",
    description: "Скрытый короб заподлицо со стеной. Полотно становится продолжением плоскости интерьера.",
    video: "/opening-systems/invisible.mp4",
  },
  {
    id: "compact",
    name: "Compact 180°",
    tag: "Распашная",
    description: "Классическая распашная система с углом открывания до 180°. Универсальное решение для любой геометрии.",
    video: "/opening-systems/compact.mp4",
  },
  {
    id: "magic",
    name: "Magic",
    tag: "Реверсивная",
    description: "Реверсивный механизм — одна дверь открывается в обе стороны. Магия без видимых деталей.",
    video: "/opening-systems/magic.mp4",
  },
  {
    id: "penal",
    name: "Пенал",
    tag: "Откатная",
    description: "Полотно уходит внутрь стены. Экономия пространства без визуального компромисса.",
    video: "/opening-systems/penal.mp4",
  },
  {
    id: "cupe-one",
    name: "Купе",
    tag: "Одностворчатая",
    description: "Раздвижная система по направляющей вдоль стены. Минимум места — максимум характера.",
    video: "/opening-systems/cupe-one.mp4",
  },
  {
    id: "cupe-two",
    name: "Купе 2",
    tag: "Двустворчатая",
    description: "Две створки расходятся в стороны. Идеально для широких проёмов и зонирования.",
    video: "/opening-systems/cupe-two.mp4",
  },
];

const OpeningSystems = memo(function OpeningSystems() {
  const [active, setActive] = useState(SYSTEMS[0].id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = SYSTEMS.find((s) => s.id === active)!;

  useEffect(() => {
    videoRef.current?.load();
    videoRef.current?.play().catch(() => {});
  }, [active]);

  return (
    <div className="mb-10">
      <div className="flex items-center gap-2 mb-5">
        <div className="w-8 h-8 rounded-lg bg-storefront-gold/10 flex items-center justify-center">
          <DoorOpen className="w-4 h-4 text-storefront-gold" />
        </div>
        <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text">
          Системы открывания
        </span>
      </div>

      <div
        className="rounded-3xl overflow-hidden border border-storefront-gold/10"
        style={{
          background:
            "linear-gradient(140deg, rgba(207,187,150,0.06) 0%, rgba(12,14,20,0.4) 50%, rgba(207,187,150,0.04) 100%)",
        }}
      >
        {/* Stage with video */}
        <div className="relative aspect-[16/9] bg-[#0a0c12] overflow-hidden">
          {/* gold corner brackets */}
          <div className="pointer-events-none absolute inset-3 z-10">
            <div className="absolute top-0 left-0 w-6 h-6 border-l border-t border-storefront-gold/40" />
            <div className="absolute top-0 right-0 w-6 h-6 border-r border-t border-storefront-gold/40" />
            <div className="absolute bottom-0 left-0 w-6 h-6 border-l border-b border-storefront-gold/40" />
            <div className="absolute bottom-0 right-0 w-6 h-6 border-r border-b border-storefront-gold/40" />
          </div>

          <video
            ref={videoRef}
            key={current.id}
            src={current.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-contain"
          />

          {/* Bottom caption overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/80 to-transparent">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div>
                <div className="text-[10px] uppercase tracking-[0.3em] text-storefront-gold/70 mb-1.5">
                  {current.tag}
                </div>
                <div
                  className="text-[26px] leading-none font-extralight text-storefront-text"
                  style={{ fontFamily: "'Raleway', sans-serif", letterSpacing: "0.02em" }}
                >
                  {current.name}
                </div>
              </div>
              <p className="text-[12.5px] leading-relaxed text-storefront-text/65 font-light max-w-md">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* System selector strip */}
        <div className="grid grid-cols-3 md:grid-cols-6 border-t border-storefront-gold/10">
          {SYSTEMS.map((s) => {
            const isActive = s.id === active;
            return (
              <button
                key={s.id}
                onClick={() => setActive(s.id)}
                onMouseEnter={() => setActive(s.id)}
                className="group relative flex flex-col items-center justify-center px-2 py-4 border-r last:border-r-0 border-storefront-gold/10 transition-colors"
                style={{
                  background: isActive
                    ? "linear-gradient(180deg, rgba(207,187,150,0.12) 0%, rgba(207,187,150,0.04) 100%)"
                    : "transparent",
                }}
              >
                <span
                  className="text-[11px] uppercase font-semibold tracking-[0.15em] transition-colors text-center"
                  style={{ color: isActive ? "hsl(var(--storefront-gold))" : "rgba(230,225,215,0.55)" }}
                >
                  {s.name}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-[2px] bg-storefront-gold" />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
});

export default OpeningSystems;
