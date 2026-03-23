import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { GeometricPattern } from "./GeometricPattern";
import { ChevronRight } from "lucide-react";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

export function HeroSection({ site, banners }: Props) {
  const banner = banners[0];

  return (
    <section className="relative min-h-[90vh] flex items-center overflow-hidden">
      {/* Background: dark with geometric pattern */}
      <div className="absolute inset-0 bg-storefront-bg">
        <GeometricPattern />
        {/* Gold gradient accent on left */}
        <div className="absolute left-0 top-0 bottom-0 w-[30%] bg-gradient-to-r from-storefront-gold/8 to-transparent" />
        {/* Diagonal gold line decoration */}
        <div className="absolute top-20 right-[20%] w-[1px] h-[60%] bg-gradient-to-b from-transparent via-storefront-gold/20 to-transparent rotate-[25deg]" />
        <div className="absolute top-10 right-[35%] w-[1px] h-[40%] bg-gradient-to-b from-transparent via-storefront-gold/10 to-transparent rotate-[25deg]" />
      </div>

      {/* Banner image (if available) */}
      {banner?.image_url && (
        <div className="absolute right-0 top-0 bottom-0 w-[55%] hidden lg:block">
          <img
            src={banner.image_url}
            alt={banner.title || ""}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-storefront-bg via-storefront-bg/80 to-transparent" />
        </div>
      )}

      {/* Content */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-6 pt-24">
        <div className="max-w-2xl">
          {/* Location label */}
          <div className="flex items-center gap-2 mb-6">
            <div className="w-8 h-[1px] bg-storefront-gold" />
            <span className="text-xs uppercase tracking-[0.3em] text-storefront-gold">
              {site.city}{site.district ? `, ${site.district}` : ""}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight tracking-tight text-storefront-text">
            {banner?.title || "Межкомнатные двери"}
            <br />
            <span className="text-storefront-gold">премиум-класса</span>
          </h1>

          <p className="mt-6 text-base sm:text-lg text-storefront-muted leading-relaxed max-w-lg">
            {banner?.subtitle || site.description || "Широкий ассортимент дверей от ведущего производителя. Посетите наш салон для подбора идеального решения."}
          </p>

          <div className="flex flex-wrap gap-4 mt-10">
            <a
              href="#catalog"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-storefront-gold text-storefront-bg font-medium uppercase tracking-wider text-sm hover:bg-storefront-gold-light transition-colors"
            >
              Каталог
              <ChevronRight className="w-4 h-4" />
            </a>
            <a
              href="#contacts"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-storefront-gold/30 text-storefront-gold font-medium uppercase tracking-wider text-sm hover:border-storefront-gold hover:bg-storefront-gold/5 transition-all"
            >
              Записаться в салон
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
