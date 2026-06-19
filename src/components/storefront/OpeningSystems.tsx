import { memo, useState, useRef, useEffect } from "react";

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
      {/* Section header */}
      <div className="mb-5 pb-3 border-b border-white/5">
        <h2 className="text-[13px] uppercase tracking-[0.22em] font-light text-storefront-text/85">
          Системы открывания
        </h2>
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

          {/* Bottom caption — system name + description */}
          <div className="absolute bottom-0 left-0 right-0 p-6 z-20 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/85 to-transparent">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div
                className="text-[26px] leading-none font-light text-storefront-text"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.04em" }}
              >
                {current.tag}
              </div>
              <p className="text-[12.5px] leading-relaxed text-storefront-text/65 font-light max-w-md">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* Thin elegant pill selector */}
        <div className="bg-[#0a0c12]/60 border-t border-storefront-gold/10 p-4">
          <div className="flex flex-wrap gap-2 justify-center">
            {SYSTEMS.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`px-5 py-2.5 rounded-full text-[12px] tracking-[0.06em] whitespace-nowrap transition-all duration-300 border ${
                    isActive
                      ? "bg-storefront-gold text-[#07090d] border-storefront-gold shadow-[0_8px_22px_-10px_rgba(207,187,150,0.7)]"
                      : "bg-transparent text-storefront-text/70 border-white/12 hover:border-storefront-gold/50 hover:text-storefront-text"
                  }`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: isActive ? 500 : 400 }}
                >
                  {s.tag}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
});

export default OpeningSystems;

