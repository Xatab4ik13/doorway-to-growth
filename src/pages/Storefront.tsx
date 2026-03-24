import { useParams } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import {
  useStorefrontProducts,
  useStorefrontBanners,
  useStorefrontStaff,
  useStorefrontCategories,
} from "@/hooks/useStorefrontData";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { HeroSection } from "@/components/storefront/HeroSection";
import { CatalogSection } from "@/components/storefront/CatalogSection";
import { AboutSection } from "@/components/storefront/AboutSection";
import { ContactSection } from "@/components/storefront/ContactSection";
import { PatternSection } from "@/components/storefront/PatternSection";

export default function Storefront() {
  const { slug } = useParams<{ slug: string }>();
  const { data: site, isLoading, error } = useSiteBySlug(slug);

  const { data: products = [] } = useStorefrontProducts(site?.id);
  const { data: banners = [] } = useStorefrontBanners(site?.id);
  const { data: staff = [] } = useStorefrontStaff(site?.id);
  const { data: categories = [] } = useStorefrontCategories();

  if (isLoading) {
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
      <PatternSection />
      <CatalogSection products={products as any} categories={categories} />
      <AboutSection site={site} staff={staff} />
      <ContactSection site={site} />
    </StorefrontLayout>
  );
}
