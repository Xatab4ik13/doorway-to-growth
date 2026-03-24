import { motion } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import heroBg from "@/assets/hero-bg-clean.jpg";

interface Props {
  site: StorefrontSite;
  banners: Array<{
    id: string;
    title: string | null;
    subtitle: string | null;
    image_url: string;
  }>;
}

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

export function HeroSection({ site: _site, banners: _banners }: Props) {
  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg">
      <motion.div
        className="absolute inset-0"
        initial={{ opacity: 0, scale: 1.02 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1.2, ease: EASE }}
      >
        <img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: "center center" }}
        />
      </motion.div>
    </section>
  );
}
