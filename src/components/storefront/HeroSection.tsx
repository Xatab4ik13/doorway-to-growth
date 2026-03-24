import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import heroOverlayRight from "@/assets/hero-overlay-right.png";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
const AUTO_SLIDE_INTERVAL = 5000;

export function HeroSection({ site: _site, banners }: Props) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [direction, setDirection] = useState(1);

  const hasSlides = banners.length > 0;

  const nextSlide = useCallback(() => {
    if (!hasSlides) return;
    setDirection(1);
    setCurrentSlide((prev) => (prev + 1) % banners.length);
  }, [banners.length, hasSlides]);

  const prevSlide = useCallback(() => {
    if (!hasSlides) return;
    setDirection(-1);
    setCurrentSlide((prev) => (prev - 1 + banners.length) % banners.length);
  }, [banners.length, hasSlides]);

  useEffect(() => {
    if (!hasSlides || banners.length <= 1) return;
    const timer = setInterval(nextSlide, AUTO_SLIDE_INTERVAL);
    return () => clearInterval(timer);
  }, [nextSlide, hasSlides, banners.length]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (dir: number) => ({ x: dir > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <section className="relative h-screen min-h-[700px] overflow-hidden select-none bg-[#111111]">
      {/* Layer 1: Banner slider — fills entire section, visible through the left cutout */}
      <div className="absolute inset-0">
        {hasSlides ? (
          <AnimatePresence custom={direction} mode="wait">
            <motion.img
              key={banners[currentSlide].id}
              src={banners[currentSlide].image_url}
              alt={banners[currentSlide].title || ""}
              className="absolute inset-0 w-full h-full object-cover"
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.6, ease: EASE }}
            />
          </AnimatePresence>
        ) : (
          <div className="absolute inset-0 bg-[#1a1a1a]" />
        )}

        {/* Banner text overlay — positioned in the left (visible) area */}
        {hasSlides && banners[currentSlide].title && (
          <div className="absolute bottom-24 left-12 z-10 max-w-[35%]">
            <motion.h2
              key={`title-${currentSlide}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="text-4xl md:text-5xl font-bold text-white mb-4"
              style={{ textShadow: "0 2px 20px rgba(0,0,0,0.7)" }}
            >
              {banners[currentSlide].title}
            </motion.h2>
            {banners[currentSlide].subtitle && (
              <motion.p
                key={`sub-${currentSlide}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45, duration: 0.5 }}
                className="text-lg text-white/80"
                style={{ textShadow: "0 1px 10px rgba(0,0,0,0.5)" }}
              >
                {banners[currentSlide].subtitle}
              </motion.p>
            )}
          </div>
        )}
      </div>

      {/* Layer 2: Right decorative overlay — gold ribbons, cut along diagonal */}
      <motion.div
        className="absolute inset-0 pointer-events-none z-10"
        initial={{ opacity: 0, x: 30 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: EASE, delay: 0.2 }}
      >
        <img
          src={heroOverlayRight}
          alt=""
          className="absolute inset-0 w-full h-full object-cover"
        />
      </motion.div>

      {/* Slider navigation — in the left visible area */}
      {hasSlides && banners.length > 1 && (
        <div className="absolute bottom-8 left-12 z-20 flex gap-3">
          <button
            onClick={prevSlide}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
          <button
            onClick={nextSlide}
            className="w-10 h-10 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 ml-3">
            {banners.map((_, i) => (
              <button
                key={i}
                onClick={() => { setDirection(i > currentSlide ? 1 : -1); setCurrentSlide(i); }}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === currentSlide ? "w-8 bg-[#c5a572]" : "w-3 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
