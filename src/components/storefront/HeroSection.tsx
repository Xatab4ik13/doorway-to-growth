import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import ribbonsOverlay from "@/assets/hero-ribbons-overlay.png";
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
const SLIDE_DURATION = 5000;

export function HeroSection({ site, banners }: Props) {
  const slides = banners.length > 0 ? banners : null;
  const [current, setCurrent] = useState(0);

  const next = useCallback(() => {
    if (!slides) return;
    setCurrent((prev) => (prev + 1) % slides.length);
  }, [slides]);

  useEffect(() => {
    if (!slides || slides.length <= 1) return;
    const timer = setInterval(next, SLIDE_DURATION);
    return () => clearInterval(timer);
  }, [next, slides]);

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-storefront-bg">
      {/* Slider layer */}
      {slides ? (
        <AnimatePresence mode="wait">
          <motion.img
            key={slides[current].id}
            src={slides[current].image_url}
            alt={slides[current].title || ""}
            className="absolute inset-0 w-full h-full object-cover"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 1, ease: EASE }}
          />
        </AnimatePresence>
      ) : (
        /* Fallback: original background when no banners */
        <motion.img
          src={heroBg}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.02 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, ease: EASE }}
        />
      )}

      {/* Gold ribbons overlay */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        style={{ mixBlendMode: "multiply" }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.5, delay: 0.3, ease: EASE }}
      >
        <img
          src={ribbonsOverlay}
          alt=""
          className="w-full h-full object-cover"
        />
      </motion.div>

      {/* Banner text overlay */}
      {slides && slides[current].title && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-end pb-32">
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${slides[current].id}`}
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.6, ease: EASE }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-storefront-text drop-shadow-lg mb-3">
                {slides[current].title}
              </h2>
              {slides[current].subtitle && (
                <p className="text-lg md:text-xl text-storefront-text/70 drop-shadow-md">
                  {slides[current].subtitle}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      )}

      {/* Slide indicators */}
      {slides && slides.length > 1 && (
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all duration-500 ${
                i === current
                  ? "w-8 bg-storefront-accent"
                  : "w-3 bg-storefront-text/30 hover:bg-storefront-text/50"
              }`}
            />
          ))}
        </div>
      )}
    </section>
  );
}
