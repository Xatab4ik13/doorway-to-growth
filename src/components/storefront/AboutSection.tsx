import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { StorefrontSite } from "@/hooks/useSiteBySlug";
import { MapPin, Phone, Mail, Clock, ChevronLeft, ChevronRight, Play } from "lucide-react";
import { ReviewsCarousel } from "./ReviewsCarousel";
import { YandexMap } from "./YandexMap";

import showroom1 from "@/assets/showroom/showroom-1.jpg";
import showroom2 from "@/assets/showroom/showroom-2.jpg";
import showroom3 from "@/assets/showroom/showroom-3.jpg";
import showroom4 from "@/assets/showroom/showroom-4.jpg";
import showroom5 from "@/assets/showroom/showroom-5.jpg";
import showroom6 from "@/assets/showroom/showroom-6.jpg";
import staffPhoto from "@/assets/showroom/staff.jpg";

const GALLERY = [
  { src: showroom1, alt: "Шоурум BRANDOORS — входные двери" },
  { src: showroom2, alt: "Зона консультации" },
  { src: showroom3, alt: "Экспозиция дверей BRANDOORS" },
  { src: showroom4, alt: "Коридор входных дверей" },
  { src: showroom5, alt: "Межкомнатные двери в шоуруме" },
  { src: showroom6, alt: "Основной зал шоурума" },
];

interface Props {
  site: StorefrontSite;
  staff: Array<{ id: string; name: string; position: string | null; photo_url: string | null }>;
}

function ShowroomGallery() {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(0);

  const go = (dir: number) => {
    setDirection(dir);
    setCurrent((c) => ((c + dir) % GALLERY.length + GALLERY.length) % GALLERY.length);
  };

  const variants = {
    enter: (d: number) => ({ x: d > 0 ? "100%" : "-100%", opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d: number) => ({ x: d > 0 ? "-100%" : "100%", opacity: 0 }),
  };

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "16/10" }}>
      {/* Main image */}
      <AnimatePresence initial={false} custom={direction} mode="popLayout">
        <motion.img
          key={current}
          src={GALLERY[current].src}
          alt={GALLERY[current].alt}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.6, ease: [0.76, 0, 0.24, 1] }}
          className="absolute inset-0 w-full h-full object-cover"
        />
      </AnimatePresence>

      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20 pointer-events-none" />

      {/* Navigation arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all duration-300"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-10 w-12 h-12 rounded-full bg-black/40 backdrop-blur-sm border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-black/60 transition-all duration-300"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
        {GALLERY.map((_, i) => (
          <button
            key={i}
            onClick={() => { setDirection(i > current ? 1 : -1); setCurrent(i); }}
            className="transition-all duration-300"
            style={{
              width: i === current ? 28 : 8,
              height: 8,
              borderRadius: 4,
              background: i === current
                ? "linear-gradient(90deg, #cfbb96, #a89060)"
                : "rgba(255,255,255,0.25)",
            }}
          />
        ))}
      </div>

      {/* Counter */}
      <div className="absolute top-4 right-4 z-10 px-3 py-1.5 rounded-full bg-black/40 backdrop-blur-sm border border-white/10">
        <span className="text-xs tracking-[0.15em] text-white/70" style={{ fontFamily: "'Raleway', sans-serif" }}>
          {String(current + 1).padStart(2, "0")} / {String(GALLERY.length).padStart(2, "0")}
        </span>
      </div>
    </div>
  );
}

function VideoBlock() {
  const [playing, setPlaying] = useState(false);

  return (
    <div className="relative w-full overflow-hidden rounded-2xl" style={{ aspectRatio: "9/16", maxHeight: "480px" }}>
      {!playing ? (
        <button
          onClick={() => setPlaying(true)}
          className="group w-full h-full relative"
        >
          <img
            src={showroom3}
            alt="Видеотур по салону"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/40 group-hover:bg-black/30 transition-colors duration-300" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              className="w-16 h-16 rounded-full border-2 flex items-center justify-center"
              style={{ borderColor: "#cfbb96" }}
              whileHover={{ scale: 1.15 }}
              transition={{ duration: 0.3 }}
            >
              <Play className="w-6 h-6 ml-0.5" style={{ color: "#cfbb96" }} />
            </motion.div>
          </div>
          <span
            className="absolute bottom-4 left-1/2 -translate-x-1/2 text-xs uppercase tracking-[0.3em]"
            style={{ color: "rgba(245,245,240,0.6)", fontFamily: "'Raleway', sans-serif" }}
          >
            Видеотур
          </span>
        </button>
      ) : (
        <video
          src="/showroom-video.mp4"
          autoPlay
          controls
          playsInline
          className="w-full h-full object-cover"
        />
      )}
    </div>
  );
}

export function AboutSection({ site, staff }: Props) {
  return (
    <section id="about" className="relative w-full overflow-hidden py-20 lg:py-28" style={{ backgroundColor: "#07090D" }}>
      <div className="relative z-10 max-w-[1400px] mx-auto px-6">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="mb-14"
        >
          <h2
            className="text-3xl md:text-4xl lg:text-5xl font-extralight tracking-[0.2em] uppercase mb-4"
            style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
          >
            Наш <span style={{ color: "#cfbb96" }}>салон</span>
          </h2>
          <p
            className="max-w-2xl text-sm md:text-base leading-relaxed"
            style={{ color: "rgba(245,245,240,0.5)", fontFamily: "'Raleway', sans-serif" }}
          >
            Официальный салон BRANDOORS в Москве — более 50 моделей входных и межкомнатных дверей
            в живой экспозиции. Приходите, чтобы увидеть и потрогать двери вживую.
          </p>
        </motion.div>

        {/* Gallery + Video row */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
        >
          <ShowroomGallery />
          <div className="hidden lg:block">
            <VideoBlock />
          </div>
        </motion.div>

        {/* Info cards */}
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          {[
            {
              icon: MapPin,
              label: "Адрес",
              value: "г. Москва, г. Щербинка,\nКвартал 120, д. 6",
              sub: "Павильон, 3 этаж",
            },
            {
              icon: Phone,
              label: "Телефон",
              value: "+7 (964) 514-14-44",
              href: "tel:+79645141444",
            },
            {
              icon: Mail,
              label: "Почта",
              value: "svetlana.kis@brandoors.ru",
              href: "mailto:svetlana.kis@brandoors.ru",
            },
            {
              icon: Clock,
              label: "Часы работы",
              value: "Ежедневно\n10:00 — 20:00",
            },
          ].map(({ icon: Icon, label, value, sub, href }, i) => (
            <motion.div
              key={label}
              className="group relative overflow-hidden rounded-2xl p-6 backdrop-blur-md border border-white/[0.06] cursor-default"
              style={{
                background: "linear-gradient(135deg, rgba(207,187,150,0.06) 0%, rgba(30,30,30,0.4) 100%)",
              }}
              whileHover={{ scale: 1.03, y: -3 }}
              transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            >
              {/* Glow */}
              <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#cfbb96]/0 group-hover:bg-[#cfbb96]/10 blur-2xl transition-all duration-500" />

              <div className="relative z-10">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(207,187,150,0.10)" }}
                >
                  <Icon className="w-4.5 h-4.5" style={{ color: "#cfbb96" }} />
                </div>
                <span
                  className="text-[11px] uppercase tracking-[0.25em] mb-2 block"
                  style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Raleway', sans-serif" }}
                >
                  {label}
                </span>
                {href ? (
                  <a
                    href={href}
                    className="text-sm font-medium whitespace-pre-line hover:opacity-80 transition-opacity"
                    style={{ color: "#F5F5F0" }}
                  >
                    {value}
                  </a>
                ) : (
                  <p className="text-sm font-medium whitespace-pre-line" style={{ color: "#F5F5F0" }}>
                    {value}
                  </p>
                )}
                {sub && (
                  <p className="text-xs mt-1" style={{ color: "rgba(245,245,240,0.4)" }}>{sub}</p>
                )}
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Reviews + Map row */}
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
        >
          <ReviewsCarousel />
          <YandexMap />
        </motion.div>

        {/* Staff — manager card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <h3
            className="text-xl font-light tracking-[0.15em] uppercase mb-6"
            style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
          >
            Ваш менеджер
          </h3>

          <div className="flex flex-col sm:flex-row gap-6 items-start">
            <motion.div
              className="relative overflow-hidden rounded-2xl w-full sm:w-64 shrink-0"
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.4 }}
            >
              <img
                src={staffPhoto}
                alt="Менеджер салона"
                className="w-full aspect-[3/4] object-cover grayscale hover:grayscale-0 transition-all duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-sm font-medium" style={{ color: "#F5F5F0" }}>Светлана</p>
                <p className="text-xs" style={{ color: "rgba(207,187,150,0.7)" }}>Менеджер салона</p>
              </div>
            </motion.div>

            <div className="flex flex-col gap-3 py-2">
              <p className="text-sm leading-relaxed max-w-md" style={{ color: "rgba(245,245,240,0.5)" }}>
                Проведёт экскурсию по салону, поможет подобрать дверь по стилю и бюджету,
                рассчитает стоимость с установкой и оформит заказ.
              </p>
              <a
                href="tel:+79645141444"
                className="inline-flex items-center gap-2 text-sm font-medium mt-2 hover:opacity-80 transition-opacity"
                style={{ color: "#cfbb96" }}
              >
                <Phone className="w-4 h-4" />
                +7 (964) 514-14-44
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
