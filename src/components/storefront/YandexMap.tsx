import { motion } from "framer-motion";

const COORDS_BY_SLUG: Record<string, { lat: number; lng: number; title: string }> = {
  scherbinka: { lat: 55.495558, lng: 37.576089, title: "Карта — салон BRANDOORS в Щербинке" },
  roomer: { lat: 55.709874, lng: 37.653736, title: "Карта — салон BRANDOORS в ТЦ ROOMER" },
  kashirsky: { lat: 55.665163, lng: 37.629858, title: "Карта — салон BRANDOORS в ТК Каширский двор" },
  dekorator: { lat: 55.729397, lng: 37.734524, title: "Карта — салон BRANDOORS в ТЦ Декоратор" },
};

const DEFAULT_COORDS = COORDS_BY_SLUG.scherbinka;

export function YandexMap({ siteSlug }: { siteSlug?: string | null }) {
  const { lat, lng, title } = (siteSlug && COORDS_BY_SLUG[siteSlug]) || DEFAULT_COORDS;
  const iframeSrc = `https://yandex.ru/map-widget/v1/?ll=${lng}%2C${lat}&z=16&pt=${lng}%2C${lat}%2Cpm2rdl&scroll=false`;

  return (
    <motion.div
      className="relative w-full overflow-hidden rounded-2xl border border-white/[0.06]"
      style={{ aspectRatio: "16/9" }}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.8, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
    >
      <iframe
        src={iframeSrc}
        width="100%"
        height="100%"
        className="absolute inset-0"
        style={{ border: 0 }}
        allowFullScreen
        loading="lazy"
        title={title}
      />
    </motion.div>
  );
}
