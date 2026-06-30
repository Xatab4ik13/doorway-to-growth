import { Link, useParams } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { storeHref } from "@/lib/storeHref";

import colPrime from "@/assets/collections/prime.webp";
import colEstetica from "@/assets/collections/estetica.webp";
import colGhost from "@/assets/collections/ghost.webp";
import colHeavy from "@/assets/collections/heavy.webp";
import colEsteticaEmale from "@/assets/collections/estetica-emale.webp";
import colMaze from "@/assets/collections/maze.webp";

type CollectionCard = {
  name: string;
  subtitle: string;
  image: string;
};

const COLLECTIONS: CollectionCard[] = [
  { name: "PRIME", subtitle: "Классика премиум-сегмента", image: colPrime },
  { name: "ESTETICA", subtitle: "Эстетика чистых линий", image: colEstetica },
  { name: "GHOST", subtitle: "Скрытый монтаж", image: colGhost },
  { name: "HEAVY", subtitle: "Массивные формы", image: colHeavy },
  { name: "ESTETICA EMALE", subtitle: "Эмаль ручной работы", image: colEsteticaEmale },
  { name: "MAZE", subtitle: "Геометрия и фактура", image: colMaze },
];

export default function StorefrontCollectionSelect() {
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const slug = useSiteSlug(urlSlug);
  const { data: site, isLoading } = useSiteBySlug(slug);

  useDocumentMeta({
    title: site ? `Межкомнатные двери — ${site.name}` : "Межкомнатные двери — Brandoors",
    description: site
      ? `Выберите коллекцию межкомнатных дверей: PRIME, ESTETICA, GHOST, HEAVY, MAZE — салон ${site.name}, ${site.city}`
      : "Коллекции межкомнатных дверей Brandoors: PRIME, ESTETICA, GHOST, HEAVY, MAZE",
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-storefront-gold/20 border-t-storefront-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!site) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center text-storefront-text">
        <h1 className="text-2xl">Сайт не найден</h1>
      </div>
    );
  }

  const listHref = storeHref(slug, "catalog/list");

  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-[68px] md:pt-0 bg-[#07090d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-16">
          {/* Breadcrumbs */}
          <div className="flex items-center gap-2 mb-6 text-xs">
            <Link
              to={storeHref(slug)}
              className="uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              Главная
            </Link>
            <span className="text-storefront-muted/40">/</span>
            <Link
              to={storeHref(slug, "catalog")}
              className="uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors"
            >
              Каталог
            </Link>
            <span className="text-storefront-muted/40">/</span>
            <span className="uppercase tracking-[0.15em] text-storefront-text">Межкомнатные двери</span>
          </div>

          {/* Header */}
          <div className="mb-10 md:mb-16 text-center">
            <h1
              className="text-3xl md:text-5xl font-extralight text-storefront-text tracking-wide"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              Выберите коллекцию
            </h1>
            <p
              className="mt-3 text-sm md:text-base text-storefront-muted tracking-[0.15em] uppercase"
              style={{ fontFamily: "'Raleway', sans-serif" }}
            >
              {COLLECTIONS.length} коллекций межкомнатных дверей
            </p>
          </div>

          {/* Cards grid */}
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 md:gap-8">
            {COLLECTIONS.map((col) => (
              <Link
                key={col.name}
                to={`${listHref}?category=mezhkomnatnye-dveri&collection=${encodeURIComponent(col.name)}`}
                className="group relative flex flex-col items-center text-center"
              >
                {/* Image container — floating door silhouette */}
                <div className="relative w-full aspect-[2/3] flex items-end justify-center overflow-hidden">
                  {/* Soft golden glow behind on hover */}
                  <div
                    className="absolute inset-x-4 inset-y-8 rounded-full opacity-0 group-hover:opacity-100 blur-3xl transition-opacity duration-500"
                    style={{ background: "radial-gradient(ellipse at center, rgba(207,187,150,0.18), transparent 70%)" }}
                  />
                  <img
                    src={col.image}
                    alt={col.name}
                    loading="lazy"
                    className="relative max-h-full w-auto object-contain transition-transform duration-500 ease-out group-hover:scale-[1.03] drop-shadow-[0_30px_40px_rgba(0,0,0,0.5)]"
                  />
                </div>

                {/* Caption */}
                <div className="mt-4 md:mt-6">
                  <h2
                    className="text-base md:text-lg text-storefront-text tracking-[0.18em] uppercase font-light transition-colors duration-300 group-hover:text-storefront-gold"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                  >
                    {col.name}
                  </h2>
                  <p
                    className="mt-1 text-xs md:text-sm text-storefront-muted tracking-[0.1em]"
                    style={{ fontFamily: "'Raleway', sans-serif" }}
                  >
                    {col.subtitle}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
