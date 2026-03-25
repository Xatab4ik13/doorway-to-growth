import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion } from "framer-motion";
import brandoorsLogo from "@/assets/logo.png";
import { ArrowRight, Phone } from "lucide-react";

/* ─── Images from presentation ─── */
import doorsEmale from "@/assets/brand/doors-1.jpg";       // Estetica Emale — гладкая эмаль
import doorsStucco from "@/assets/brand/doors-2.jpg";      // Ghost — штукатурка
import doorsWallpaper from "@/assets/brand/doors-3.jpg";   // Ghost Wallpaper — обои
import doorsReflect from "@/assets/brand/doors-4.jpg";     // Estetica Reflect — зеркало
import doorsPanels from "@/assets/brand/ghost-doors.jpg";   // Ghost Panels — стеновые панели
import frameDetail from "@/assets/brand/doors-5.jpg";      // Короб INVISIBLE
import doorsCrossSection from "@/assets/brand/doors-6.jpg"; // Разрез двери — LVL-брус
import lvlDetail from "@/assets/brand/lvl-detail.jpg";     // LVL деталь крупно
import magneticLock from "@/assets/brand/magnetic-lock.jpg"; // Угол конструкции

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

/* ─── Коллекции скрытых дверей ─── */
const COLLECTIONS = [
  {
    name: "ESTETICA EMALE",
    desc: "Декорирование эмалью по RAL & NCS — безупречная гладкая поверхность",
    image: doorsEmale,
  },
  {
    name: "ESTETICA REFLECT",
    desc: "С зеркалом — визуальное расширение пространства и стиль",
    image: doorsReflect,
  },
  {
    name: "GHOST",
    desc: "Декорирование штукатуркой — дверь полностью сливается со стеной",
    image: doorsStucco,
  },
  {
    name: "GHOST WALLPAPER",
    desc: "Декорирование обоями — бесшовная интеграция в интерьер",
    image: doorsWallpaper,
  },
  {
    name: "GHOST PANELS",
    desc: "Со стеновыми панелями — единое пространство без видимых дверей",
    image: doorsPanels,
  },
];

/* ─── Технологии ─── */
const TECHNOLOGIES = [
  {
    title: "Каркас из LVL-бруса",
    desc: "Прочность на растяжение и изгиб вдоль волокон в два раза превышает показатели других пиломатериалов. Не боится влажности, биоустойчив, не даёт усадки и не деформируется.",
    points: [
      "Прочность в 2× выше стандартных материалов",
      "Не поддерживает горение",
      "Влагостойкость и биоустойчивость",
      "Точные геометрические размеры",
      "Отличная теплоизоляция",
    ],
    image: doorsCrossSection,
    imageDetail: lvlDetail,
  },
  {
    title: "Короб INVISIBLE",
    desc: "Скрытый алюминиевый короб — дверь становится невидимой. Безупречное мастерство в каждой детали конструкции и великолепное комплексное решение для помещения.",
    points: [
      "Алюминиевый короб скрытого монтажа",
      "Дверь идеально сливается со стеной",
      "Под покраску, штукатурку или обои",
      "Итальянский магнитный замок — 500 000 циклов",
    ],
    image: frameDetail,
    imageDetail: magneticLock,
  },
];

/* ─── Преимущества ─── */
const ADVANTAGES = [
  { title: "Все виды покрытий", desc: "PET, PVC, PP, HPL, CPL от ведущих производителей" },
  { title: "Фрезеровка по эскизу", desc: "Декоративные рисунки любой сложности" },
  { title: "Эмаль топовых брендов", desc: "Покрытие от мировых производителей" },
  { title: "Алюминиевые кромки", desc: "Молдинги в цвете по RAL и NCS" },
  { title: "Стекло Lacobel", desc: "2000+ оттенков по RAL и NCS" },
  { title: "Оперативные сроки", desc: "Быстрое изготовление и доставка" },
  { title: "Складская матрица", desc: "150 000+ единиц товаров в наличии" },
  { title: "Сервис от А до Я", desc: "От замера до монтажа под ключ" },
];

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
        <h1 className="text-4xl font-bold">Страница не найдена</h1>
      </div>
    );
  }

  return (
    <StorefrontLayout site={site}>
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative pt-14 min-h-[60vh] md:min-h-[80vh] flex items-center overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <div className="absolute inset-0 z-0">
          <img src={doorsPanels} alt="" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0" style={{ background: "linear-gradient(135deg, rgba(7,9,13,0.92) 0%, rgba(7,9,13,0.7) 50%, rgba(7,9,13,0.85) 100%)" }} />
        </div>

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-20 md:py-32 w-full">
          <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1, ease: EASE }}>
            <p className="text-[11px] md:text-xs uppercase tracking-[0.4em] mb-6" style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Raleway', sans-serif" }}>
              Custom Colored Doors
            </p>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extralight tracking-[0.1em] uppercase mb-8" style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}>
              <span style={{ color: "#cfbb96" }}>Brandoors</span>
            </h1>
            <p className="max-w-2xl text-base md:text-lg leading-relaxed mb-10" style={{ color: "rgba(245,245,240,0.6)", fontFamily: "'Raleway', sans-serif" }}>
              Революция в мире дверей — инновационные технологии, безупречный дизайн и премиальное качество по доступной цене
            </p>
            <Link
              to={`/store/${site.slug}/catalog`}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold uppercase tracking-[0.2em] text-[13px] transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #cfbb96 0%, #b5a07a 50%, #a08a60 100%)",
                color: "#0a0a0a",
                fontFamily: "'Raleway', sans-serif",
              }}
            >
              Смотреть каталог
              <ArrowRight className="w-4 h-4" />
            </Link>
          </motion.div>
        </div>
      </section>

      {/* ═══════════ О КОМПАНИИ ═══════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <SectionDivider />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, ease: EASE }}>
              <SectionTitle>О <span style={{ color: "#cfbb96" }}>компании</span></SectionTitle>
              <div className="space-y-5" style={{ color: "rgba(245,245,240,0.6)", fontFamily: "'Raleway', sans-serif", fontSize: "15px", lineHeight: "1.8" }}>
                <p>
                  <Gold>BRANDOORS</Gold> — это ультрадинамичная команда творческих людей, объединившихся, чтобы бросить вызов стереотипам.
                </p>
                <p>
                  Это не просто молодой бренд дверей — это революция в подходе к ценообразованию. Наши технологии работают на вашу выгоду, а производственные возможности и характеристики продукта не имеют границ.
                </p>
                <p>
                  Более <Gold>500 партнёров</Gold> в активной базе оптовых продаж. Склад площадью более <Gold>1500 м²</Gold> в Москве и товарный запас свыше <Gold>150 000 единиц</Gold>.
                </p>
                <p>
                  Мы предлагаем продукт и надёжность премиум-сегмента в доступном формате — без переплат.
                </p>
              </div>
            </motion.div>

            <motion.div className="relative" initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-80px" }} transition={{ duration: 0.8, delay: 0.2, ease: EASE }}>
              <div className="relative rounded-2xl overflow-hidden aspect-[4/5]">
                <img src={doorsReflect} alt="Скрытые двери ESTETICA REFLECT с зеркалом" loading="lazy" className="w-full h-full object-cover" />
                <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,9,13,0.7) 0%, transparent 50%)" }} />
                <div className="absolute bottom-6 left-6 right-6">
                  <p className="text-[11px] uppercase tracking-[0.3em] mb-1" style={{ color: "rgba(207,187,150,0.7)", fontFamily: "'Raleway', sans-serif" }}>
                    Флагманская линейка
                  </p>
                  <p className="text-lg font-light tracking-wider" style={{ color: "#F5F5F0", fontFamily: "'Raleway', sans-serif" }}>
                    Скрытые двери с коробом INVISIBLE
                  </p>
                  <p className="text-xs mt-2 leading-relaxed" style={{ color: "rgba(245,245,240,0.5)", fontFamily: "'Raleway', sans-serif" }}>
                    Безупречное мастерство в каждой детали конструкции и великолепное комплексное решение для помещения
                  </p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ═══════════ КОЛЛЕКЦИИ ═══════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <SectionDivider />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} className="text-center mb-4">
            <SectionTitle className="text-center">
              Варианты отделки <span style={{ color: "#cfbb96" }}>скрытых дверей</span>
            </SectionTitle>
            <p className="max-w-2xl mx-auto text-sm md:text-base" style={{ color: "rgba(245,245,240,0.45)", fontFamily: "'Raleway', sans-serif" }}>
              Каждая дверь — это холст для вашего интерьера. Выберите отделку, которая идеально впишется в ваше пространство
            </p>
          </motion.div>

          {/* Top row: 2 large cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-14">
            {COLLECTIONS.slice(0, 2).map((col, i) => (
              <CollectionCard key={col.name} col={col} index={i} aspect="aspect-[4/3]" />
            ))}
          </div>

          {/* Bottom row: 3 cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-5">
            {COLLECTIONS.slice(2).map((col, i) => (
              <CollectionCard key={col.name} col={col} index={i + 2} aspect="aspect-[3/4]" />
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ТЕХНОЛОГИИ ═══════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <SectionDivider />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }} className="mb-14">
            <SectionTitle>
              Технические <span style={{ color: "#cfbb96" }}>характеристики</span>
            </SectionTitle>
          </motion.div>

          <div className="space-y-20">
            {TECHNOLOGIES.map((tech, i) => (
              <motion.div
                key={tech.title}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16 items-center ${i % 2 === 1 ? "lg:[direction:rtl]" : ""}`}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.8, ease: EASE }}
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[4/3] lg:[direction:ltr]">
                  <img src={tech.image} alt={tech.title} loading="lazy" className="w-full h-full object-cover" />
                  {tech.imageDetail && (
                    <div className="absolute bottom-4 right-4 w-28 h-28 md:w-36 md:h-36 rounded-full overflow-hidden border-2" style={{ borderColor: "rgba(207,187,150,0.3)" }}>
                      <img src={tech.imageDetail} alt="Детали конструкции" loading="lazy" className="w-full h-full object-cover" />
                    </div>
                  )}
                </div>

                <div className="lg:[direction:ltr]">
                  <h3 className="text-2xl md:text-3xl font-extralight tracking-[0.1em] uppercase mb-6" style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}>
                    {tech.title}
                  </h3>
                  <p className="text-sm leading-relaxed mb-6" style={{ color: "rgba(245,245,240,0.55)", fontFamily: "'Raleway', sans-serif" }}>
                    {tech.desc}
                  </p>
                  <ul className="space-y-3">
                    {tech.points.map((point) => (
                      <li key={point} className="flex items-start gap-3">
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full shrink-0" style={{ background: "#cfbb96" }} />
                        <span className="text-sm" style={{ color: "rgba(245,245,240,0.65)", fontFamily: "'Raleway', sans-serif" }}>
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ ПРЕИМУЩЕСТВА ═══════════ */}
      <section className="relative py-20 lg:py-28 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <SectionDivider />
        <div className="relative z-10 max-w-[1400px] mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}>
            <SectionTitle className="text-center">
              Наши <span style={{ color: "#cfbb96" }}>преимущества</span>
            </SectionTitle>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-14">
            {ADVANTAGES.map((adv, i) => (
              <motion.div
                key={adv.title}
                className="group relative rounded-2xl p-5 md:p-6 border border-white/[0.06] overflow-hidden hover:-translate-y-1 transition-transform duration-300"
                style={{ background: "linear-gradient(135deg, rgba(207,187,150,0.06) 0%, rgba(30,30,30,0.4) 100%)" }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05, ease: EASE }}
              >
                <div className="absolute -top-8 -right-8 w-20 h-20 rounded-full bg-[#cfbb96]/0 group-hover:bg-[#cfbb96]/10 blur-2xl transition-all duration-500" />
                <span className="text-[32px] font-extralight leading-none mb-3 block" style={{ color: "rgba(207,187,150,0.15)", fontFamily: "'Raleway', sans-serif" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h4 className="text-[13px] font-semibold mb-1.5 tracking-wide" style={{ color: "#F5F5F0", fontFamily: "'Raleway', sans-serif" }}>
                  {adv.title}
                </h4>
                <p className="text-[11px] leading-relaxed" style={{ color: "rgba(245,245,240,0.4)", fontFamily: "'Raleway', sans-serif" }}>
                  {adv.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════ CTA ═══════════ */}
      <section className="relative py-24 overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <SectionDivider />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.8, ease: EASE }}>
            <img src={brandoorsLogo} alt="Brandoors" className="h-12 mx-auto mb-8" style={{ filter: "brightness(0) invert(1)", opacity: 0.5 }} />
            <h2 className="text-2xl md:text-3xl font-extralight tracking-[0.12em] uppercase mb-4" style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}>
              Приходите в наш <span style={{ color: "#cfbb96" }}>шоурум</span>
            </h2>
            <p className="text-sm mb-3" style={{ color: "rgba(245,245,240,0.5)", fontFamily: "'Raleway', sans-serif" }}>
              {site.address ? `${site.city}, ${site.address}` : site.city}
            </p>
            <p className="text-xs mb-8" style={{ color: "rgba(245,245,240,0.35)", fontFamily: "'Raleway', sans-serif" }}>
              Ежедневно 10:00 — 20:00
            </p>
            {site.phone && (
              <a
                href={`tel:${site.phone}`}
                className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold uppercase tracking-[0.2em] text-[13px] transition-all duration-300 hover:scale-105"
                style={{
                  background: "linear-gradient(135deg, #cfbb96 0%, #b5a07a 50%, #a08a60 100%)",
                  color: "#0a0a0a",
                  fontFamily: "'Raleway', sans-serif",
                }}
              >
                <Phone className="w-4 h-4" />
                {site.phone}
              </a>
            )}
          </motion.div>
        </div>
      </section>
    </StorefrontLayout>
  );
}

/* ─── Компоненты ─── */

function CollectionCard({ col, index, aspect }: { col: { name: string; desc: string; image: string }; index: number; aspect: string }) {
  return (
    <motion.div
      className={`group relative rounded-2xl overflow-hidden ${aspect} cursor-pointer hover:-translate-y-1 transition-transform duration-300`}
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.08, ease: EASE }}
    >
      <img src={col.image} alt={col.name} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0" style={{ background: "linear-gradient(to top, rgba(7,9,13,0.85) 0%, rgba(7,9,13,0.2) 40%, transparent 70%)" }} />
      <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500" style={{ background: "linear-gradient(to top, rgba(207,187,150,0.08) 0%, transparent 40%)" }} />
      <div className="absolute bottom-0 left-0 right-0 p-6">
        <p className="text-[11px] uppercase tracking-[0.3em] mb-2" style={{ color: "rgba(207,187,150,0.8)", fontFamily: "'Raleway', sans-serif" }}>
          {col.name}
        </p>
        <p className="text-sm font-light leading-relaxed" style={{ color: "rgba(245,245,240,0.7)", fontFamily: "'Raleway', sans-serif" }}>
          {col.desc}
        </p>
      </div>
    </motion.div>
  );
}

function SectionDivider() {
  return (
    <div
      className="absolute top-0 left-0 right-0 h-px"
      style={{ background: "linear-gradient(90deg, transparent 5%, rgba(207,187,150,0.15) 50%, transparent 95%)" }}
    />
  );
}

function SectionTitle({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <h2
      className={`text-3xl md:text-4xl font-extralight tracking-[0.15em] uppercase mb-8 ${className}`}
      style={{ fontFamily: "'Raleway', sans-serif", color: "#F5F5F0" }}
    >
      {children}
    </h2>
  );
}

function Gold({ children }: { children: React.ReactNode }) {
  return <strong style={{ color: "#cfbb96" }}>{children}</strong>;
}
