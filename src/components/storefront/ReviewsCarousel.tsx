import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Star, ChevronLeft, ChevronRight, ExternalLink, Quote } from "lucide-react";
import { YANDEX_REVIEWS } from "@/data/yandexReviews";
import { YANDEX_REVIEWS_KASHIRSKY } from "@/data/yandexReviewsKashirsky";

const REVIEWS_BY_SLUG: Record<string, { reviews: typeof YANDEX_REVIEWS; url: string }> = {
  kashirsky: {
    reviews: YANDEX_REVIEWS_KASHIRSKY,
    url: "https://yandex.ru/maps/org/brandoors/59741360576/reviews/",
  },
};

const DEFAULT_SET = {
  reviews: YANDEX_REVIEWS,
  url: "https://yandex.ru/maps/org/brandoors/79431648490/reviews/",
};

export function ReviewsCarousel({ siteSlug }: { siteSlug?: string | null }) {
  const { reviews: REVIEWS, url: YANDEX_ORG_URL } =
    (siteSlug && REVIEWS_BY_SLUG[siteSlug]) || DEFAULT_SET;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);
  const len = REVIEWS.length;


  const go = useCallback((dir: number) => {
    setDirection(dir);
    setCurrent((c) => ((c + dir) % len + len) % len);
  }, [len]);

  // Auto-advance every 6s
  useEffect(() => {
    const timer = setInterval(() => go(1), 6000);
    return () => clearInterval(timer);
  }, [go]);

  const avgRating = (REVIEWS.reduce((s, r) => s + r.rating, 0) / len).toFixed(1);

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? -80 : 80, opacity: 0 }),
  };

  return (
    <div>
      {/* Header with Yandex rating */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <h3
            className="text-xl font-light tracking-[0.15em] uppercase"
            style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
          >
            Отзывы
          </h3>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/[0.08]" style={{ background: "rgba(207,187,150,0.06)" }}>
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-3.5 h-3.5"
                  style={{
                    color: s <= Math.round(Number(avgRating)) ? "#cfbb96" : "rgba(255,255,255,0.15)",
                    fill: s <= Math.round(Number(avgRating)) ? "#cfbb96" : "transparent",
                  }}
                />
              ))}
            </div>
            <span className="text-sm font-medium" style={{ color: "#cfbb96" }}>{avgRating}</span>
            <span className="text-xs" style={{ color: "rgba(245,245,240,0.35)" }}>на Яндекс Картах</span>
          </div>
        </div>
        <a
          href={YANDEX_ORG_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden sm:inline-flex items-center gap-1.5 text-xs uppercase tracking-[0.2em] hover:opacity-80 transition-opacity"
          style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Raleway', sans-serif" }}
        >
          Все отзывы
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>

      {/* Review card */}
      <div className="relative min-h-[180px]">
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={current}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="rounded-2xl p-6 md:p-8 border border-white/[0.06] relative overflow-hidden"
            style={{ background: "linear-gradient(135deg, rgba(207,187,150,0.06) 0%, rgba(30,30,30,0.4) 100%)" }}
          >
            {/* Quote icon */}
            <Quote className="absolute top-4 right-4 w-8 h-8" style={{ color: "rgba(207,187,150,0.08)" }} />

            <div className="flex gap-0.5 mb-4">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className="w-4 h-4"
                  style={{
                    color: s <= REVIEWS[current].rating ? "#cfbb96" : "rgba(255,255,255,0.15)",
                    fill: s <= REVIEWS[current].rating ? "#cfbb96" : "transparent",
                  }}
                />
              ))}
            </div>

            <p className="text-sm md:text-base leading-relaxed mb-6 max-w-2xl" style={{ color: "rgba(245,245,240,0.75)" }}>
              «{REVIEWS[current].text}»
            </p>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium" style={{ color: "#F5F5F0" }}>{REVIEWS[current].author}</p>
                <p className="text-xs mt-0.5" style={{ color: "rgba(245,245,240,0.35)" }}>{REVIEWS[current].date}</p>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Nav buttons */}
        {len > 1 && (
          <div className="flex gap-2 mt-4">
            <button
              onClick={() => go(-1)}
              className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
            >
              <ChevronLeft className="w-4 h-4" style={{ color: "rgba(245,245,240,0.5)" }} />
            </button>
            <button
              onClick={() => go(1)}
              className="w-10 h-10 rounded-full bg-white/[0.04] border border-white/[0.08] flex items-center justify-center hover:bg-white/[0.08] transition-colors"
            >
              <ChevronRight className="w-4 h-4" style={{ color: "rgba(245,245,240,0.5)" }} />
            </button>
            <div className="flex gap-2 ml-auto items-center">
              <span className="text-xs tabular-nums" style={{ color: "rgba(245,245,240,0.4)", fontFamily: "'Raleway', sans-serif" }}>
                {String(current + 1).padStart(2, "0")} / {String(len).padStart(2, "0")}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

