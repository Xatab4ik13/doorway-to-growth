import { motion } from "framer-motion";

const MAP_LAT = 55.495558;
const MAP_LNG = 37.576089;
const ORG_ID = "244726749264";

export function YandexMap() {
  // Yandex Maps Static API with organization marker
  const iframeSrc = `https://yandex.ru/map-widget/v1/?ll=${MAP_LNG}%2C${MAP_LAT}&z=16&mode=search&oid=biz%3A${ORG_ID}&ol=biz&scroll=false`;

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
        style={{ border: 0, filter: "invert(0.92) hue-rotate(180deg) saturate(0.3) brightness(0.8)" }}
        allowFullScreen
        loading="lazy"
        title="Карта — салон BRANDOORS в Щербинке"
      />
      {/* Gold tint overlay */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ background: "linear-gradient(135deg, rgba(207,187,150,0.05) 0%, transparent 60%)" }}
      />
    </motion.div>
  );
}
