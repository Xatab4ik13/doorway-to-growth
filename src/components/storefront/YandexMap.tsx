import { motion } from "framer-motion";

const MAP_LAT = 55.495558;
const MAP_LNG = 37.576089;

export function YandexMap() {
  const iframeSrc = `https://yandex.ru/map-widget/v1/?ll=${MAP_LNG}%2C${MAP_LAT}&z=16&pt=${MAP_LNG}%2C${MAP_LAT}%2Cpm2rdl&scroll=false`;

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
        title="Карта — салон BRANDOORS в Щербинке"
      />
    </motion.div>
  );
}
