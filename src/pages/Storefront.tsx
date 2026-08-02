import { useParams } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { buildOrganizationSchema, buildLocalBusinessSchema } from "@/lib/seo";
import {
  useStorefrontBanners,
  useStorefrontStaff,
} from "@/hooks/useStorefrontData";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { HeroSection } from "@/components/storefront/HeroSection";
import { AboutSection } from "@/components/storefront/AboutSection";
import { ContactSection } from "@/components/storefront/ContactSection";
import { PatternSection } from "@/components/storefront/PatternSection";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { buildHomeMeta } from "@/lib/catalogRoutes";

export default function Storefront() {
  const { slug: urlSlug } = useParams<{ slug: string }>();
  const resolvedSlug = useSiteSlug(urlSlug);
  const { data: site, isLoading, error } = useSiteBySlug(resolvedSlug);

  const { data: banners = [] } = useStorefrontBanners(site?.id);
  const { data: staff = [] } = useStorefrontStaff(site?.id);

  const homeMeta = buildHomeMeta(
    site ? { slug: site.slug, name: site.name, city: site.city, district: site.district } : null
  );

  useDocumentMeta({
    title: site ? homeMeta.title : "Brandoors — Двери премиум-класса",
    description: site
      ? homeMeta.description
      : "Межкомнатные и входные двери премиум-класса от Brandoors",
    jsonLd: site
      ? [buildOrganizationSchema(), buildLocalBusinessSchema(site)]
      : buildOrganizationSchema(),
  });

  // Show loader while: query is loading, OR slug hasn't resolved yet (custom domain lookup),
  // OR the query is disabled because slug is still undefined. Only show "not found" on real errors.
  if (isLoading || (!site && !error)) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-[#c5a572]/20 border-t-[#c5a572] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !site) {
    return (
      <div className="min-h-screen bg-[#111111] flex items-center justify-center text-[#f5f5f0]">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-4">Сайт не найден</h1>
          <p className="text-[#8a8a7a]">Запрашиваемый магазин не существует или неактивен</p>
        </div>
      </div>
    );
  }

  return (
    <StorefrontLayout site={site}>
      <HeroSection site={site} banners={banners} />

      {/* SEO-вступление: уникальный текст и H1 для каждого домена */}
      <section className="bg-[#07090d] px-6 py-14 md:px-12 lg:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h1 className="font-raleway text-2xl font-extralight uppercase tracking-[0.18em] text-[#f5f5f0] md:text-3xl">
            {homeMeta.h1}
          </h1>
          <p className="mt-4 text-sm uppercase tracking-[0.22em] text-[#c5a572]">
            {homeMeta.offer}
          </p>
          <p className="mt-6 text-sm leading-relaxed text-[#8a8a7a] md:text-base">
            {homeMeta.intro}
          </p>
        </div>
      </section>

      <PatternSection />
      <AboutSection site={site} staff={[]} />
      <ContactSection site={site} />
    </StorefrontLayout>
  );
}
