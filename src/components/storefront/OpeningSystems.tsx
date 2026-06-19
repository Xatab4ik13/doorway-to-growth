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
      {/* Section header — gold rule + label, no icon */}
      <div className="flex items-baseline justify-between gap-2 mb-5 pb-3 border-b border-white/5">
        <h2 className="text-[13px] uppercase tracking-[0.22em] font-light text-storefront-text/85">
          Системы открывания
        </h2>
        <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-text/35 tabular-nums">
          {SYSTEMS.length} реш.
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
                  className="text-[28px] leading-none font-light text-storefront-text"
                  style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.04em" }}
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

        {/* System selector — large premium cards, horizontal scroll on mobile */}
        <div className="bg-[#0a0c12]/60 border-t border-storefront-gold/10 p-4">
          <div className="-mx-1 px-1 overflow-x-auto scrollbar-hide snap-x sm:overflow-visible">
            <div className="flex sm:grid sm:grid-cols-3 gap-3 min-w-min sm:min-w-0">
              {SYSTEMS.map((s, idx) => {
                const isActive = s.id === active;
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className={`group relative flex flex-col items-start justify-between gap-3 shrink-0 sm:shrink snap-start w-[180px] sm:w-auto min-h-[112px] px-5 py-4 rounded-2xl border text-left transition-all duration-300 overflow-hidden ${
                      isActive
                        ? "bg-gradient-to-br from-storefront-gold to-[#b89860] text-[#07090d] border-storefront-gold shadow-[0_14px_36px_-14px_rgba(207,187,150,0.7)]"
                        : "bg-white/[0.025] border-white/10 hover:border-storefront-gold/50 hover:bg-white/[0.05] hover:-translate-y-0.5"
                    }`}
                  >
                    {/* Decorative gold number — top-right */}
                    <span
                      className={`absolute top-3 right-4 text-[26px] leading-none font-light tabular-nums transition-opacity ${
                        isActive ? "text-[#07090d]/30" : "text-storefront-gold/25"
                      }`}
                      style={{ fontFamily: "'Cormorant Garamond', serif" }}
                    >
                      {String(idx + 1).padStart(2, "0")}
                    </span>

                    <span
                      className={`text-[10px] uppercase tracking-[0.28em] font-semibold ${
                        isActive ? "text-[#07090d]/70" : "text-storefront-gold/75"
                      }`}
                    >
                      {s.tag}
                    </span>

                    <span
                      className={`text-[17px] leading-tight font-medium ${
                        isActive ? "text-[#07090d]" : "text-storefront-text"
                      }`}
                      style={{ fontFamily: "'Cormorant Garamond', serif", letterSpacing: "0.02em" }}
                    >
                      {s.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

export default OpeningSystems;
