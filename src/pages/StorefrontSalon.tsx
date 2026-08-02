import { Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion } from "framer-motion";
import { ArrowRight, Clock, Mail, MapPin, Phone } from "lucide-react";
import { storeHref } from "@/lib/storeHref";
import {
  SALON_HOURS,
  buildBreadcrumbSchema,
  buildLocalBusinessSchema,
} from "@/lib/seo";
import { CATEGORY_SEO, categoryHref } from "@/lib/catalogRoutes";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

const GOLD = "#cfbb96";
const FONT = "'Onest', sans-serif";

/** Телефон в формате tel: — убираем всё, кроме цифр и ведущего плюса. */
function telHref(phone?: string | null) {
  if (!phone) return null;
  const digits = phone.replace(/[^\d+]/g, "");
  return `tel:${digits}`;
}

export default function StorefrontSalon() {
  const slug = useSiteSlug();
  const { data: site, isLoading, error } = useSiteBySlug(slug);

  const locality = site?.district || site?.city || "Москва";
  const title = site
    ? `Салон дверей Brandoors — ${locality}, ${site.city}: адрес и телефон`
    : "Салон дверей Brandoors";
  const description = site
    ? `Салон Brandoors: ${site.address || locality}. Телефон ${site.phone || ""}. Живая экспозиция межкомнатных и входных дверей, замер, доставка и установка в ${site.city}.`
    : "Салон дверей Brandoors: адрес, телефон, режим работы.";

  useDocumentMeta({
    title,
    description,
    canonical: "/salon",
    jsonLd: site
      ? [
          buildLocalBusinessSchema(site),
          buildBreadcrumbSchema([
            { name: "Главная", path: "/" },
            { name: `Салон ${locality}` },
          ]),
        ]
      : undefined,
  });

  if (isLoading || (!site && !slug && !error)) {
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

  const tel = telHref(site.phone);
  const mapSrc =
    site.latitude != null && site.longitude != null
      ? `https://yandex.ru/map-widget/v1/?ll=${site.longitude},${site.latitude}&z=17&pt=${site.longitude},${site.latitude},pm2rdm`
      : `https://yandex.ru/map-widget/v1/?text=${encodeURIComponent(
          `${site.city}, ${site.address || locality}`
        )}&z=16`;

  return (
    <StorefrontLayout site={site}>
      <section
        className="relative overflow-hidden"
        style={{ backgroundColor: "#07090D" }}
      >
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(60% 50% at 20% 0%, rgba(207,187,150,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[1400px] mx-auto px-6 py-24 md:py-32 w-full">
          {/* Хлебные крошки */}
          <nav
            className="flex items-center gap-2 mb-10 text-[11px] uppercase tracking-[0.2em]"
            style={{ fontFamily: FONT }}
          >
            <Link
              to={storeHref(site.slug)}
              className="transition-colors"
              style={{ color: "rgba(245,245,240,0.45)" }}
            >
              Главная
            </Link>
            <span style={{ color: "rgba(245,245,240,0.25)" }}>/</span>
            <span style={{ color: "#F5F5F0" }}>Салон {locality}</span>
          </nav>

          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p
              className="text-[11px] md:text-xs uppercase tracking-[0.4em] mb-6"
              style={{ color: "rgba(207,187,150,0.6)", fontFamily: FONT }}
            >
              {site.city} · {locality}
            </p>
            <h1
              className="text-3xl md:text-5xl font-extralight tracking-[0.1em] uppercase mb-8"
              style={{ fontFamily: FONT, color: "#F5F5F0" }}
            >
              Салон дверей <span style={{ color: GOLD }}>{locality}</span>
            </h1>
            <p
              className="max-w-2xl text-base md:text-lg leading-relaxed"
              style={{ color: "rgba(245,245,240,0.55)", fontFamily: FONT }}
            >
              {site.description ||
                `Фирменный салон Brandoors по адресу ${site.address}. В экспозиции — межкомнатные и входные двери, скрытые системы, погонаж и фурнитура. Консультация дизайнера, точный замер, доставка и установка в ${site.city}.`}
            </p>
          </motion.div>

          {/* Контактный блок (NAP) + карта */}
          <div className="mt-14 grid gap-8 lg:grid-cols-[1fr_1.15fr]">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
              className="rounded-2xl border p-8 md:p-10"
              style={{
                borderColor: "rgba(207,187,150,0.16)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              }}
            >
              <h2
                className="text-lg md:text-xl font-extralight tracking-[0.14em] uppercase mb-8"
                style={{ fontFamily: FONT, color: "#F5F5F0" }}
              >
                Контакты салона
              </h2>

              <ul className="space-y-7" style={{ fontFamily: FONT }}>
                <li className="flex gap-4">
                  <MapPin
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: GOLD }}
                  />
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-[0.2em] mb-1.5"
                      style={{ color: "rgba(245,245,240,0.4)" }}
                    >
                      Адрес
                    </p>
                    <address
                      className="not-italic text-sm md:text-base leading-relaxed"
                      style={{ color: "#F5F5F0" }}
                    >
                      {site.city}, {site.address}
                    </address>
                  </div>
                </li>

                {site.phone && (
                  <li className="flex gap-4">
                    <Phone
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: GOLD }}
                    />
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-[0.2em] mb-1.5"
                        style={{ color: "rgba(245,245,240,0.4)" }}
                      >
                        Телефон
                      </p>
                      <a
                        href={tel ?? undefined}
                        className="text-base md:text-lg transition-colors"
                        style={{ color: "#F5F5F0" }}
                      >
                        {site.phone}
                      </a>
                    </div>
                  </li>
                )}

                {site.email && (
                  <li className="flex gap-4">
                    <Mail
                      className="w-5 h-5 shrink-0 mt-0.5"
                      style={{ color: GOLD }}
                    />
                    <div>
                      <p
                        className="text-[11px] uppercase tracking-[0.2em] mb-1.5"
                        style={{ color: "rgba(245,245,240,0.4)" }}
                      >
                        E-mail
                      </p>
                      <a
                        href={`mailto:${site.email}`}
                        className="text-sm md:text-base break-all"
                        style={{ color: "#F5F5F0" }}
                      >
                        {site.email}
                      </a>
                    </div>
                  </li>
                )}

                <li className="flex gap-4">
                  <Clock
                    className="w-5 h-5 shrink-0 mt-0.5"
                    style={{ color: GOLD }}
                  />
                  <div>
                    <p
                      className="text-[11px] uppercase tracking-[0.2em] mb-1.5"
                      style={{ color: "rgba(245,245,240,0.4)" }}
                    >
                      Режим работы
                    </p>
                    {SALON_HOURS.map((h) => (
                      <p
                        key={h.days}
                        className="text-sm md:text-base"
                        style={{ color: "#F5F5F0" }}
                      >
                        {h.days}: {h.time}
                      </p>
                    ))}
                  </div>
                </li>
              </ul>

              {tel && (
                <a
                  href={tel}
                  className="mt-10 inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold uppercase tracking-[0.2em] text-[13px] transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #cfbb96 0%, #b5a07a 50%, #a08a60 100%)",
                    color: "#0a0a0a",
                    fontFamily: FONT,
                  }}
                >
                  Позвонить в салон
                </a>
              )}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2, ease: EASE }}
              className="rounded-2xl overflow-hidden border min-h-[360px]"
              style={{ borderColor: "rgba(207,187,150,0.16)" }}
            >
              <iframe
                src={mapSrc}
                title={`Салон Brandoors на карте — ${site.city}, ${site.address}`}
                loading="lazy"
                className="w-full h-full min-h-[360px]"
                style={{ border: 0 }}
              />
            </motion.div>
          </div>

          {/* Перелинковка на разделы каталога — только внутри своего домена */}
          <div className="mt-16">
            <h2
              className="text-lg md:text-xl font-extralight tracking-[0.14em] uppercase mb-8"
              style={{ fontFamily: FONT, color: "#F5F5F0" }}
            >
              Что можно посмотреть в салоне
            </h2>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {Object.values(CATEGORY_SEO).map((cat) => (
                <Link
                  key={cat.slug}
                  to={categoryHref(site.slug, cat.slug)}
                  className="group rounded-2xl border px-6 py-7 transition-colors"
                  style={{
                    borderColor: "rgba(207,187,150,0.16)",
                    background: "rgba(255,255,255,0.02)",
                    fontFamily: FONT,
                  }}
                >
                  <span
                    className="block text-sm uppercase tracking-[0.16em] mb-2"
                    style={{ color: "#F5F5F0" }}
                  >
                    {cat.name}
                  </span>
                  <span
                    className="inline-flex items-center gap-2 text-[12px]"
                    style={{ color: GOLD }}
                  >
                    Смотреть
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      </section>
    </StorefrontLayout>
  );
}
