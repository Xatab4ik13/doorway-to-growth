import { useState } from "react";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { ChevronLeft, ChevronRight } from "lucide-react";
import heroDefault from "@/assets/hero-showroom.jpg";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const SLIDES = [
  {
    title: "МЕЖКОМНАТНЫЕ ДВЕРИ",
    subtitle: "Салон дверей нового поколения — пространство, в котором дизайн, качество и комфорт объединяются в каждой детали.",
  },
  {
    title: "ПРЕМИУМ КОЛЛЕКЦИЯ",
    subtitle: "Эксклюзивные модели из натуральных материалов. Итальянский дизайн, российское производство.",
  },
  {
    title: "ИНДИВИДУАЛЬНЫЙ ПОДХОД",
    subtitle: "Персональная консультация, 3D-визуализация, профессиональный замер и установка под ключ.",
  },
];

export function HeroSection({ site, banners }: Props) {
  const [current, setCurrent] = useState(0);

  const heroImage = banners[0]?.image_url || heroDefault;
  const slide = SLIDES[current] || SLIDES[0];

  const prev = () => setCurrent((c) => (c === 0 ? SLIDES.length - 1 : c - 1));
  const next = () => setCurrent((c) => (c === SLIDES.length - 1 ? 0 : c + 1));

  return (
    <section className="relative h-screen min-h-[700px] bg-storefront-bg overflow-hidden">

      {/* === LEFT SIDEBAR === */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-30 hidden lg:flex flex-col items-center justify-between py-8 bg-storefront-bg/80 backdrop-blur-sm border-r border-white/5">
        <div className="flex flex-col items-center gap-1 mt-16">
          <span className="text-3xl font-bold text-storefront-text">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="text-xs text-storefront-muted">
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>
        <span
          className="text-[10px] tracking-[0.35em] uppercase text-storefront-muted/40"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          BRANDOORS
        </span>
        <div className="flex flex-col gap-3 mb-4">
          {["Ig", "Vk", "Fb"].map((s) => (
            <span key={s} className="w-6 h-6 flex items-center justify-center text-[9px] text-storefront-muted/40 border border-white/5 hover:text-storefront-gold hover:border-storefront-gold/30 transition-colors cursor-pointer">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* === HERO IMAGE — full area === */}
      <div className="absolute inset-0 lg:left-16">
        <img
          src={heroImage}
          alt="Салон дверей"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Darken overlay */}
        <div className="absolute inset-0 bg-storefront-bg/40" />
      </div>

      {/* === GEOMETRIC 3D CUTS — dark shapes over the image === */}
      <svg
        className="absolute inset-0 w-full h-full z-10 pointer-events-none hidden lg:block"
        viewBox="0 0 1400 900"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Top-left large diagonal panel — creates the "frame" feel */}
        <polygon
          points="0,0 0,900 80,900 80,0"
          fill="#111111"
          fillOpacity="0.85"
        />

        {/* Top-right diagonal strip */}
        <polygon
          points="900,0 1400,0 1400,200 850,250"
          fill="#111111"
          fillOpacity="0.7"
        />

        {/* Right diagonal beam — thin gold-tinged line */}
        <polygon
          points="850,0 860,0 1050,900 1040,900"
          fill="#c5a572"
          fillOpacity="0.15"
        />

        {/* Another diagonal beam */}
        <polygon
          points="920,0 925,0 1120,900 1115,900"
          fill="#c5a572"
          fillOpacity="0.08"
        />

        {/* Bottom-right large panel — content area */}
        <polygon
          points="700,550 1400,350 1400,900 400,900"
          fill="#111111"
          fillOpacity="0.88"
        />

        {/* Bottom dark trapezoid — base */}
        <polygon
          points="0,750 500,620 1400,700 1400,900 0,900"
          fill="#111111"
          fillOpacity="0.92"
        />

        {/* Thin decorative diagonal lines — 3D depth */}
        <line x1="700" y1="0" x2="400" y2="900" stroke="#c5a572" strokeWidth="0.5" strokeOpacity="0.25" />
        <line x1="850" y1="0" x2="550" y2="900" stroke="white" strokeWidth="0.3" strokeOpacity="0.06" />
        <line x1="950" y1="0" x2="650" y2="900" stroke="white" strokeWidth="0.3" strokeOpacity="0.04" />

        {/* Top edge accent line */}
        <line x1="80" y1="0" x2="900" y2="0" stroke="#c5a572" strokeWidth="1" strokeOpacity="0.3" />
      </svg>

      {/* === MOBILE geometric overlay — simpler === */}
      <div className="absolute inset-0 z-10 lg:hidden">
        <div className="absolute bottom-0 left-0 right-0 h-[55%] bg-gradient-to-t from-storefront-bg via-storefront-bg/90 to-transparent" />
      </div>

      {/* === NAV ARROWS === */}
      <div className="absolute left-20 lg:left-28 top-[55%] lg:top-[45%] z-20 flex items-center gap-4">
        <button
          onClick={prev}
          className="flex items-center gap-1 text-xs uppercase tracking-wider text-storefront-muted hover:text-storefront-gold transition-colors"
        >
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>
        <button
          onClick={next}
          className="flex items-center gap-1 text-xs uppercase tracking-wider text-storefront-muted hover:text-storefront-gold transition-colors"
        >
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* === MAIN CONTENT — over the dark geometric panels === */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:pl-28 lg:pr-16 pb-16 lg:pb-20">
        <div className="max-w-[1400px] mx-auto">
          <div className="lg:ml-[25%] max-w-2xl">
            <h1
              key={current}
              className="text-3xl sm:text-5xl lg:text-[56px] font-bold leading-[1.05] tracking-tight text-storefront-text animate-fade-up"
            >
              {slide.title}
            </h1>

            <p
              key={`sub-${current}`}
              className="mt-5 text-sm sm:text-base text-storefront-muted/80 leading-relaxed max-w-md animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              {slide.subtitle}
            </p>

            <a
              href="#catalog"
              className="inline-flex items-center gap-2 mt-8 px-8 py-3 border border-storefront-gold text-storefront-gold text-xs uppercase tracking-[0.2em] hover:bg-storefront-gold hover:text-storefront-bg transition-all duration-300"
            >
              Смотреть каталог
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>

      {/* === Top nav === */}
      <div className="absolute top-0 left-16 right-0 z-40 hidden md:flex items-center justify-between px-6 lg:px-12 h-16">
        <div className="flex items-center gap-6">
          {site.phone && (
            <span className="text-xs text-white/40 tracking-wider">
              {site.phone}
            </span>
          )}
        </div>
        <nav className="flex items-center gap-8">
          {["Каталог", "Акции", "О салоне", "Контакты"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.2em] text-white/50 hover:text-storefront-gold transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
