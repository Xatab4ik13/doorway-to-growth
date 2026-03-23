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
      {/* === LEFT SIDEBAR — slide counter + social === */}
      <div className="absolute left-0 top-0 bottom-0 w-16 z-30 hidden lg:flex flex-col items-center justify-between py-8 border-r border-white/5">
        {/* Slide counter */}
        <div className="flex flex-col items-center gap-1 mt-16">
          <span className="text-3xl font-bold text-storefront-text">
            {String(current + 1).padStart(2, "0")}
          </span>
          <span className="text-xs text-storefront-muted">
            / {String(SLIDES.length).padStart(2, "0")}
          </span>
        </div>

        {/* Vertical text */}
        <span
          className="text-[10px] tracking-[0.35em] uppercase text-storefront-muted/40"
          style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
        >
          BRANDOORS
        </span>

        {/* Social icons placeholder */}
        <div className="flex flex-col gap-3 mb-4">
          {["Ig", "Vk", "Fb"].map((s) => (
            <span key={s} className="w-6 h-6 flex items-center justify-center text-[9px] text-storefront-muted/40 border border-white/5 hover:text-storefront-gold hover:border-storefront-gold/30 transition-colors cursor-pointer">
              {s}
            </span>
          ))}
        </div>
      </div>

      {/* === HERO IMAGE — top portion with diagonal clip === */}
      <div className="absolute top-0 left-16 right-0 h-[65%] lg:h-[60%] overflow-hidden">
        <img
          src={heroImage}
          alt="Салон дверей"
          className="w-full h-full object-cover"
          width={1920}
          height={1080}
        />
        {/* Gradient overlay — bottom fade to bg */}
        <div className="absolute inset-0 bg-gradient-to-b from-storefront-bg/30 via-transparent to-storefront-bg" />
        {/* Left dark gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-storefront-bg/70 via-storefront-bg/20 to-transparent" />
        {/* Diagonal cut at bottom */}
        <div
          className="absolute bottom-0 left-0 right-0 h-24"
          style={{
            background: "linear-gradient(170deg, transparent 40%, #111111 40.5%)",
          }}
        />
      </div>

      {/* === NAV ARROWS === */}
      <div className="absolute left-20 lg:left-24 bottom-[42%] lg:bottom-[45%] z-20 flex items-center gap-4">
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

      {/* === MAIN CONTENT — bottom right === */}
      <div className="absolute bottom-0 left-0 right-0 z-20 px-6 lg:pl-24 lg:pr-16 pb-12 lg:pb-16">
        <div className="max-w-[1400px] mx-auto">
          <div className="lg:ml-[10%] max-w-3xl">
            {/* Title */}
            <h1
              key={current}
              className="text-4xl sm:text-5xl lg:text-[64px] font-bold leading-[1.05] tracking-tight text-storefront-text animate-fade-up"
              style={{ fontFamily: "'Plus Jakarta Sans', sans-serif" }}
            >
              {slide.title}
            </h1>

            {/* Subtitle */}
            <p
              key={`sub-${current}`}
              className="mt-5 text-sm sm:text-base text-storefront-muted leading-relaxed max-w-md animate-fade-up"
              style={{ animationDelay: "80ms" }}
            >
              {slide.subtitle}
            </p>

            {/* CTA */}
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

      {/* === Decorative diagonal gold line === */}
      <div className="absolute top-16 right-[15%] w-[1px] h-[45%] bg-gradient-to-b from-storefront-gold/30 via-storefront-gold/10 to-transparent rotate-[20deg] hidden lg:block" />

      {/* === Top nav bar (transparent over image) === */}
      <div className="absolute top-0 left-16 right-0 z-40 flex items-center justify-between px-6 lg:px-12 h-16">
        <div className="flex items-center gap-6">
          {site.phone && (
            <span className="text-xs text-storefront-muted/60 tracking-wider hidden sm:block">
              {site.phone}
            </span>
          )}
        </div>
        <nav className="hidden md:flex items-center gap-8">
          {["Каталог", "Акции", "О салоне", "Контакты"].map((label) => (
            <a
              key={label}
              href={`#${label.toLowerCase()}`}
              className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted/70 hover:text-storefront-gold transition-colors"
            >
              {label}
            </a>
          ))}
        </nav>
      </div>
    </section>
  );
}
