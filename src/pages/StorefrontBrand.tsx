import { useParams } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion } from "framer-motion";
import brandoorsLogo from "@/assets/logo.png";
import ghostDoors from "@/assets/brand/ghost-doors.jpg";
import doors1 from "@/assets/brand/doors-1.jpg";
import doors2 from "@/assets/brand/doors-2.jpg";
import doors3 from "@/assets/brand/doors-3.jpg";
import doors4 from "@/assets/brand/doors-4.jpg";
import doors5 from "@/assets/brand/doors-5.jpg";
import doors6 from "@/assets/brand/doors-6.jpg";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const FEATURES = [
  { icon: "M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z", title: "Все виды покрытий", desc: "PET, PVC, PP, HPL, CPL — от ведущих мировых производителей" },
  { icon: "M12 19l7-7 3 3-7 7-3-3z M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z", title: "Фрезеровка по эскизу", desc: "Декоративные рисунки и фрезеровка любой сложности" },
  { icon: "M4 4h16v16H4V4zm2 2v12h12V6H6z", title: "Эмаль от топовых брендов", desc: "Покрытие эмалью от мировых производителей" },
  { icon: "M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5", title: "Алюминиевые кромки", desc: "Молдинги в цвете по каталогам RAL и NCS" },
  { icon: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z", title: "Стекло Lacobel", desc: "Более 2000 оттенков по RAL и NCS" },
  { icon: "M13 10V3L4 14h7v7l9-11h-7z", title: "Оперативные сроки", desc: "Быстрое изготовление и доставка" },
  { icon: "M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4", title: "Складская матрица", desc: "Более 150 000 единиц товаров в наличии" },
  { icon: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z M15 12a3 3 0 11-6 0 3 3 0 016 0z", title: "Сервис от А до Я", desc: "Комплексное обслуживание от замера до монтажа" },
];

const GALLERY = [doors1, doors2, doors3, doors4, doors5, doors6];

export default function StorefrontBrand() {
  const { slug } = useParams<{ slug: string }>();
  const { data: site, isLoading, error } = useSiteBySlug(slug);

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
          <h1 className="text-4xl font-bold mb-4">Страница не найдена</h1>
        </div>
      </div>
    );
  }

  return (
    <StorefrontLayout site={site}>
      {/* Hero */}
      <section className="relative pt-20 md:pt-0 min-h-[60vh] md:min-h-[70vh] flex items-center overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <div
          className="absolute inset-0 z-0"
          style={{
            background: "radial-gradient(ellipse at 30% 50%, rgba(207,187,150,0.05) 0%, transparent 60%), linear-gradient(135deg, #0a0c10 0%, #07090d 50%, #0d0f14 100%)",
          }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 md:py-32 w-full">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: EASE }}
          >
            <p
              className="text-[11px] md:text-xs uppercase tracking-[0.4em] mb-6"
              style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Raleway', sans-serif" }}
            >
              Custom Colored Doors
            </p>
            <h1
              className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.15em] uppercase mb-6"
              style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
            >
              О бренде <span style={{ color: "#cfbb96" }}>Brandoors</span>
            </h1>
            <p
              className="max-w-2xl text-sm md:text-base leading-relaxed"
              style={{ color: "rgba(245,245,240,0.5)", fontFamily: "'Raleway', sans-serif" }}
            >
              Ультрадинамичная команда творческих людей, объединившихся, чтобы бросить вызов стереотипам в мире дверей
            </p>
          </motion.div>
        </div>
      </section>

      {/* About company */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(207,187,150,0.15) 50%, transparent 95%)" }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            {/* Left — text */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <h2
                className="text-3xl md:text-4xl font-extralight tracking-[0.15em] uppercase mb-8"
                style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
              >
                О <span style={{ color: "#cfbb96" }}>компании</span>
              </h2>

              <div className="space-y-5" style={{ color: "rgba(245,245,240,0.6)", fontFamily: "'Raleway', sans-serif", fontSize: "15px", lineHeight: "1.8" }}>
                <p>
                  <strong style={{ color: "#cfbb96" }}>BRANDOORS</strong> — не просто молодой бренд дверей, это революция в подходе к ценообразованию, это технологии, которые работают на Вашу выгоду. Наши производственные возможности и характеристики продукта не имеют границ.
                </p>
                <p>
                  На сегодняшний день в активной базе оптовых продаж находятся более <strong style={{ color: "#F5F5F0" }}>500 партнёров</strong>. Реселлерами выступают профильные магазины, имеющие в своём выставочном зале образцы продукции BRANDOORS™, в формате брендсекции, а также в формате монобренд.
                </p>
                <p>
                  Для обеспечения быстрых продаж к услугам наших партнёров доступны расположенные на территории Москвы склад площадью более <strong style={{ color: "#F5F5F0" }}>1500 м²</strong>, а также комфортный офис продаж.
                </p>
                <p>
                  Товарный запас продукции составляет более <strong style={{ color: "#F5F5F0" }}>150 000 единиц</strong> товаров: двери входные и межкомнатные, комплектующие и фурнитура к ним.
                </p>
                <p>
                  Мы предлагаем продукт и надёжность премиум-сегмента в доступном формате без переплат и стремимся делать высокие стандарты качества доступными!
                </p>
              </div>
            </motion.div>

            {/* Right — hero image */}
            <motion.div
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
            >
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <img
                  src={ghostDoors}
                  alt="Скрытые двери Ghost / Estetica"
                  className="w-full h-full object-cover"
                />
                <div
                  className="absolute inset-0"
                  style={{ background: "linear-gradient(to top, rgba(7,9,13,0.6) 0%, transparent 50%)" }}
                />
                <div className="absolute bottom-6 left-6 right-6">
                  <p
                    className="text-[11px] uppercase tracking-[0.3em] mb-1"
                    style={{ color: "rgba(207,187,150,0.7)", fontFamily: "'Raleway', sans-serif" }}
                  >
                    Коллекция
                  </p>
                  <p
                    className="text-lg font-light tracking-wider"
                    style={{ color: "#F5F5F0", fontFamily: "'Raleway', sans-serif" }}
                  >
                    Скрытые двери Ghost / Estetica
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features grid */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(207,187,150,0.15) 50%, transparent 95%)" }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-extralight tracking-[0.15em] uppercase mb-14 text-center"
            style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Наши <span style={{ color: "#cfbb96" }}>преимущества</span>
          </motion.h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feat, i) => (
              <motion.div
                key={feat.title}
                className="group relative rounded-2xl p-6 border border-white/[0.06] backdrop-blur-sm overflow-hidden"
                style={{
                  background: "linear-gradient(135deg, rgba(207,187,150,0.06) 0%, rgba(30,30,30,0.4) 100%)",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.06, ease: EASE }}
                whileHover={{ scale: 1.03, y: -4 }}
              >
                <div className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-[#cfbb96]/0 group-hover:bg-[#cfbb96]/10 blur-2xl transition-all duration-500" />
                <div
                  className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                  style={{ background: "rgba(207,187,150,0.10)" }}
                >
                  <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="#cfbb96" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <path d={feat.icon} />
                  </svg>
                </div>
                <h3
                  className="text-sm font-semibold mb-2 tracking-wide"
                  style={{ color: "#F5F5F0", fontFamily: "'Raleway', sans-serif" }}
                >
                  {feat.title}
                </h3>
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "rgba(245,245,240,0.45)", fontFamily: "'Raleway', sans-serif" }}
                >
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(207,187,150,0.15) 50%, transparent 95%)" }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <motion.h2
            className="text-3xl md:text-4xl font-extralight tracking-[0.15em] uppercase mb-14 text-center"
            style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            Продукция <span style={{ color: "#cfbb96" }}>Brandoors</span>
          </motion.h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-5">
            {GALLERY.map((img, i) => (
              <motion.div
                key={i}
                className="relative rounded-xl overflow-hidden aspect-[3/4] group"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.08, ease: EASE }}
              >
                <img
                  src={img}
                  alt={`Двери Brandoors ${i + 1}`}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div
                  className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                  style={{ background: "linear-gradient(to top, rgba(7,9,13,0.5) 0%, transparent 60%)" }}
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation section */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(207,187,150,0.15) 50%, transparent 95%)" }}
        />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
            <motion.div
              className="relative rounded-2xl overflow-hidden aspect-[4/3]"
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: EASE }}
            >
              <img
                src={doors4}
                alt="Инновационные технологии Brandoors"
                className="w-full h-full object-cover"
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.15, ease: EASE }}
            >
              <h2
                className="text-3xl md:text-4xl font-extralight tracking-[0.15em] uppercase mb-8"
                style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
              >
                Инновационные <span style={{ color: "#cfbb96" }}>технологии</span>
              </h2>
              <div className="space-y-5" style={{ color: "rgba(245,245,240,0.6)", fontFamily: "'Raleway', sans-serif", fontSize: "15px", lineHeight: "1.8" }}>
                <p>
                  Откройте мир инновационных технологий с использованием скрытого короба <strong style={{ color: "#cfbb96" }}>INVISIBLE</strong>. Благодаря передовым технологиям, этот короб обеспечивает надёжность, функциональность и эстетику в одном комплексе.
                </p>
                <p>
                  Бесконечные возможности для дизайна — откройте простор для фантазии и креативности с использованием скрытых дверей. Уникальные дизайнерские решения подчёркивают стиль и индивидуальность вашего интерьера.
                </p>
                <p>
                  Удобство и комфорт каждого дня — итальянская фурнитура обеспечивает плавное и бесшумное открывание и закрывание дверей.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative py-20 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent 5%, rgba(207,187,150,0.15) 50%, transparent 95%)" }}
        />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <img
              src={brandoorsLogo}
              alt="Brandoors"
              className="h-12 mx-auto mb-8"
              style={{ filter: "brightness(0) invert(1)", opacity: 0.6 }}
            />
            <h2
              className="text-2xl md:text-3xl font-extralight tracking-[0.15em] uppercase mb-4"
              style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
            >
              Приходите в наш <span style={{ color: "#cfbb96" }}>шоурум</span>
            </h2>
            <p
              className="text-sm mb-8"
              style={{ color: "rgba(245,245,240,0.45)", fontFamily: "'Raleway', sans-serif" }}
            >
              {site.address ? `${site.city}, ${site.address}` : site.city}
            </p>
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold uppercase tracking-[0.2em] text-[13px] transition-all duration-300"
                style={{
                  background: "linear-gradient(135deg, #cfbb96 0%, #b5a07a 50%, #a08a60 100%)",
                  color: "#0a0a0a",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                Позвонить: {site.phone}
              </a>
            )}
          </motion.div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
