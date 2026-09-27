import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { storeHref } from "@/lib/storeHref";
import { siteShortName, cityIn } from "@/lib/catalogRoutes";
import { buildBreadcrumbSchema } from "@/lib/seo";
import { supabase } from "@/integrations/supabase/client";
import { resolveStorageUrl } from "@/lib/storageUrl";
import { MIRROR_DOOR_SLUGS, MIRROR_INTRO, MIRROR_BODY, MIRROR_PAGE_PATH } from "@/lib/mirrorDoors";

type Card = { slug: string; name: string; image: string | null };

function useMirrorDoors() {
  return useQuery({
    queryKey: ["mirror-doors"],
    staleTime: 5 * 60 * 1000,
    queryFn: async (): Promise<Card[]> => {
      const { data, error } = await supabase
        .from("products")
        .select("slug, name, product_images(url, is_primary, sort_order)")
        .eq("is_active", true)
        .in("slug", MIRROR_DOOR_SLUGS);
      if (error) throw error;
      const bySlug = new Map((data ?? []).map((p: any) => [p.slug, p]));
      return MIRROR_DOOR_SLUGS.filter((s) => bySlug.has(s)).map((s) => {
        const p: any = bySlug.get(s);
        const imgs = [...(p.product_images ?? [])].sort(
          (a: any, b: any) => (a.sort_order ?? 0) - (b.sort_order ?? 0)
        );
        const url = imgs.find((i: any) => i.is_primary)?.url ?? imgs[0]?.url ?? null;
        return { slug: p.slug, name: p.name, image: url ? resolveStorageUrl(url) : null };
      });
    },
  });
}

const CRUMBS = buildBreadcrumbSchema([
  { name: "Главная", path: "/" },
  { name: "Каталог", path: "/catalog" },
  { name: "Межкомнатные двери", path: "/catalog/mezhkomnatnye-dveri" },
  { name: "Двери с зеркалом" },
]);

export default function StorefrontMirrorDoors() {
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const slug = useSiteSlug(urlSlug);
  const { data: site, isLoading } = useSiteBySlug(slug);
  const { data: doors = [], isLoading: doorsLoading } = useMirrorDoors();

  useDocumentMeta({
    title: site
      ? `Межкомнатные двери с зеркалом в ${cityIn(site.city)} — ${siteShortName(site)}`
      : "Межкомнатные двери с зеркалом Brandoors",
    description: site
      ? `Межкомнатные двери с зеркалом Brandoors: 20 моделей PRIME, MAZE, ESTETICA, HEAVY, REFLECT. Салон ${siteShortName(site)}, ${site.city}: цены, замер, установка.`
      : MIRROR_INTRO,
    canonical: MIRROR_PAGE_PATH,
    jsonLd: CRUMBS,
  });

  if (isLoading || (!site && !slug)) {
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

  const crumb = "uppercase tracking-[0.15em] text-storefront-muted hover:text-storefront-gold transition-colors";

  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-[68px] md:pt-0 bg-[#07090d]">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 py-8 md:py-16">
          <div className="flex flex-wrap items-center gap-2 mb-6 text-xs">
            <Link to={storeHref(slug)} className={crumb}>Главная</Link>
            <span className="text-storefront-muted/40">/</span>
            <Link to={storeHref(slug, "catalog")} className={crumb}>Каталог</Link>
            <span className="text-storefront-muted/40">/</span>
            <Link to={storeHref(slug, "catalog/mezhkomnatnye-dveri")} className={crumb}>Межкомнатные двери</Link>
            <span className="text-storefront-muted/40">/</span>
            <span className="uppercase tracking-[0.15em] text-storefront-text">С зеркалом</span>
          </div>

          <div className="mb-10 md:mb-16 text-center max-w-3xl mx-auto">
            <h1
              className="text-3xl md:text-5xl font-extralight text-storefront-text tracking-wide"
              style={{ fontFamily: "'Onest', sans-serif" }}
            >
              Межкомнатные двери с зеркалом
            </h1>
            <p className="mt-4 text-sm md:text-base text-storefront-muted leading-relaxed">{MIRROR_INTRO}</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-8">
            {doorsLoading && <p className="col-span-full text-center text-storefront-muted">Загрузка…</p>}
            {doors.map((d) => (
              <Link key={d.slug} to={storeHref(slug, `product/${d.slug}`)} className="group flex flex-col items-center text-center">
                <div className="w-full aspect-[2/3] flex items-end justify-center overflow-hidden">
                  {d.image ? (
                    <img
                      src={d.image}
                      alt={`Межкомнатная дверь с зеркалом Brandoors ${d.name}`}
                      loading="lazy"
                      className="max-h-full w-auto object-contain transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-1/2 h-3/4 border border-storefront-gold/10 rounded-sm" />
                  )}
                </div>
                <h2 className="mt-4 text-sm md:text-base text-storefront-text tracking-[0.18em] uppercase font-light group-hover:text-storefront-gold transition-colors">
                  {d.name}
                </h2>
              </Link>
            ))}
          </div>

          <div className="mt-16 max-w-3xl mx-auto space-y-4 text-sm leading-relaxed text-storefront-muted">
            {MIRROR_BODY.map((t) => <p key={t}>{t}</p>)}
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
