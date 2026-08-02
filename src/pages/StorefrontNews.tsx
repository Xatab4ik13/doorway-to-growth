import { Link, useParams } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion } from "framer-motion";
import { ArrowRight, Newspaper, Clock } from "lucide-react";
import { storeHref } from "@/lib/storeHref";
import { getPageUrl } from "@/lib/seo";
import { getArticles } from "@/content/news";

const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];

function formatDate(iso: string) {
  try {
    return new Date(iso).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  } catch {
    return iso;
  }
}

export default function StorefrontNews() {
  const { slug: urlSlug } = useParams<{ slug?: string }>();
  const slug = useSiteSlug(urlSlug);
  const { data: site, isLoading, error } = useSiteBySlug(slug);

  const articles = getArticles(site?.slug);

  useDocumentMeta({
    title: site ? `Новости и статьи — Brandoors ${site.city}` : "Новости — Brandoors",
    description: site
      ? `Статьи салона Brandoors в ${site.district || site.city}: подбор межкомнатных и входных дверей, замер, монтаж, коллекции и практические разборы.`
      : "Новости Brandoors: новые коллекции дверей, акции, события и полезные материалы.",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "CollectionPage",
      name: site ? `Новости и статьи — Brandoors ${site.city}` : "Новости — Brandoors",
      url: getPageUrl(),
      description:
        "Статьи и практические материалы Brandoors о выборе, замере и установке дверей.",
      ...(articles.length
        ? {
            mainEntity: {
              "@type": "ItemList",
              itemListElement: articles.map((a, i) => ({
                "@type": "ListItem",
                position: i + 1,
                name: a.title,
                url: getPageUrl(storeHref(site?.slug, `news/${a.slug}`)),
              })),
            },
          }
        : {}),
    },
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

  return (
    <StorefrontLayout site={site}>
      <section
        className="relative min-h-screen overflow-hidden"
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
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: EASE }}
          >
            <p
              className="text-[11px] md:text-xs uppercase tracking-[0.4em] mb-6"
              style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Onest', sans-serif" }}
            >
              Brandoors Journal
            </p>
            <h1
              className="text-4xl md:text-6xl font-extralight tracking-[0.1em] uppercase mb-8"
              style={{ fontFamily: "'Onest', sans-serif", color: "#F5F5F0" }}
            >
              Новости <span style={{ color: "#cfbb96" }}>салона</span>
            </h1>
            <p
              className="max-w-2xl text-base md:text-lg leading-relaxed"
              style={{ color: "rgba(245,245,240,0.55)", fontFamily: "'Onest', sans-serif" }}
            >
              Практические материалы салона {site.district || site.city}: как выбирать
              двери, когда делать замер, чем отличаются коллекции и что учесть при
              монтаже.
            </p>
          </motion.div>

          {articles.length > 0 ? (
            <div className="mt-14 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
              {articles.map((article, i) => (
                <motion.article
                  key={article.slug}
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.7, delay: 0.05 * i, ease: EASE }}
                  className="group rounded-2xl border overflow-hidden flex flex-col transition-colors duration-300"
                  style={{
                    borderColor: "rgba(207,187,150,0.16)",
                    background:
                      "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                  }}
                >
                  {newsImage(article.cover) && (
                    <img
                      src={newsImage(article.cover)}
                      alt={article.title}
                      loading="lazy"
                      decoding="async"
                      className="w-full h-[180px] object-cover"
                      style={{ backgroundColor: "#0c0e14" }}
                    />
                  )}

                  <div className="p-7 flex flex-col flex-1">
                  <div
                    className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] mb-5"
                    style={{ color: "rgba(207,187,150,0.6)", fontFamily: "'Onest', sans-serif" }}
                  >
                    <time dateTime={article.date}>{formatDate(article.date)}</time>
                    <span className="inline-flex items-center gap-1.5">
                      <Clock className="w-3 h-3" />
                      {article.readingMinutes} мин
                    </span>
                  </div>


                  <h2
                    className="text-lg md:text-xl font-extralight leading-snug mb-4"
                    style={{ fontFamily: "'Onest', sans-serif", color: "#F5F5F0" }}
                  >
                    {article.title}
                  </h2>

                  <p
                    className="text-sm leading-relaxed mb-8 flex-1"
                    style={{
                      color: "rgba(245,245,240,0.45)",
                      fontFamily: "'Onest', sans-serif",
                    }}
                  >
                    {article.excerpt}
                  </p>

                  <Link
                    to={storeHref(site.slug, `news/${article.slug}`)}
                    className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] font-semibold transition-all duration-300 group-hover:gap-3"
                    style={{ color: "#cfbb96", fontFamily: "'Onest', sans-serif" }}
                  >
                    Читать
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </motion.article>
              ))}
            </div>
          ) : (
            <motion.div
              initial={{ opacity: 0, y: 32 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.15, ease: EASE }}
              className="mt-14 rounded-2xl border px-8 py-14 md:py-20 text-center"
              style={{
                borderColor: "rgba(207,187,150,0.16)",
                background:
                  "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
              }}
            >
              <Newspaper
                className="w-8 h-8 mx-auto mb-6"
                style={{ color: "rgba(207,187,150,0.55)" }}
              />
              <h2
                className="text-xl md:text-2xl font-extralight tracking-[0.14em] uppercase mb-4"
                style={{ fontFamily: "'Onest', sans-serif", color: "#F5F5F0" }}
              >
                Скоро здесь появятся публикации
              </h2>
              <div className="flex flex-wrap items-center justify-center gap-4 mt-8">
                <Link
                  to={storeHref(site.slug, "catalog")}
                  className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold uppercase tracking-[0.2em] text-[13px] transition-all duration-300 hover:scale-105"
                  style={{
                    background:
                      "linear-gradient(135deg, #cfbb96 0%, #b5a07a 50%, #a08a60 100%)",
                    color: "#0a0a0a",
                    fontFamily: "'Onest', sans-serif",
                  }}
                >
                  Смотреть каталог
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </motion.div>
          )}
        </div>
      </section>
    </StorefrontLayout>
  );
}
