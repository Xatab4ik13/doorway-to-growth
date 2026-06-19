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

interface OpeningSystemsProps {
  value: string | null;
  onChange: (id: string | null) => void;
}

const OpeningSystems = memo(function OpeningSystems({ value, onChange }: OpeningSystemsProps) {
  const [active, setActive] = useState(value ?? SYSTEMS[0].id);
  const videoRef = useRef<HTMLVideoElement>(null);
  const current = SYSTEMS.find((s) => s.id === active)!;

  useEffect(() => {
    if (value && value !== active) {
      setActive(value);
    }
  }, [value]);

  useEffect(() => {
    onChange(active);
  }, [active, onChange]);

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
        {/* Stage with video — taller */}
        <div className="relative aspect-[4/3] sm:aspect-[16/10] bg-[#0a0c12] overflow-hidden">
          <video
            ref={videoRef}
            key={current.id}
            src={current.video}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            className="absolute inset-0 w-full h-full object-cover"
          />

          {/* Bottom caption */}
          <div className="absolute bottom-0 left-0 right-0 p-7 z-20 bg-gradient-to-t from-[#0a0c12] via-[#0a0c12]/85 to-transparent">
            <div className="flex items-end justify-between gap-4 flex-wrap">
              <div
                className="text-[34px] leading-none font-medium text-storefront-text"
                style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.04em" }}
              >
                {current.tag}
              </div>
              <p className="text-[13px] leading-relaxed text-storefront-text/70 font-light max-w-md">
                {current.description}
              </p>
            </div>
          </div>
        </div>

        {/* 3×2 selector grid — calculator-style background */}
        <div
          className="border-t border-storefront-gold/10 p-5 sm:p-6"
          style={{
            background:
              "linear-gradient(180deg, rgba(207,187,150,0.06) 0%, rgba(207,187,150,0.01) 100%)",
          }}
        >
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {SYSTEMS.map((s) => {
              const isActive = s.id === active;
              return (
                <button
                  key={s.id}
                  onClick={() => setActive(s.id)}
                  className={`w-full px-5 py-4 rounded-2xl text-[15px] sm:text-[16px] tracking-[0.04em] whitespace-nowrap transition-colors duration-300 border ${
                    isActive
                      ? "bg-storefront-gold/15 text-storefront-gold border-storefront-gold/60"
                      : "bg-transparent text-storefront-text/80 border-storefront-gold/10 hover:border-storefront-gold/40 hover:text-storefront-text"
                  }`}
                  style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 600 }}
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
