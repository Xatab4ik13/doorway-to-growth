import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import heroMagazinePage from "@/assets/hero-magazine-page-2.jpg";

interface Props {
  site: StorefrontSite;
  banners: Array<{ id: string; title: string | null; subtitle: string | null; image_url: string }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroSection({ site: _site, banners: _banners }: Props) {
  return (
    <section
      className="relative h-screen min-h-[700px] overflow-hidden bg-storefront-bg"
      aria-label="Hero секция BRANDOORS"
    >
      <div className="absolute inset-0 bg-storefront-bg" />

      <motion.div
        className="absolute inset-0 z-10 flex items-center justify-center"
        initial={{ opacity: 0, scale: 1.015 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.9, ease: EASE }}
      >
        <img
          src={heroMagazinePage}
          alt="BRANDOORS magazine hero"
          className="h-full w-full object-contain"
          style={{ objectPosition: "center center" }}
          loading="eager"
        />
      </motion.div>
    </section>
  );
}
