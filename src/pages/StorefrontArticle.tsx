import { Link, useParams } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, Clock } from "lucide-react";
import { storeHref } from "@/lib/storeHref";
import { getPageUrl, buildBreadcrumbSchema } from "@/lib/seo";
import { getArticle, getArticles } from "@/content/news";
import { newsImage } from "@/content/news/media";


const EASE: [number, number, number, number] = [0.22, 1, 0.36, 1];
const FONT = "'Onest', sans-serif";

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

export default function StorefrontArticle() {
  const { slug: urlSlug, articleSlug } = useParams<{ slug?: string; articleSlug: string }>();
  const slug = useSiteSlug(urlSlug);
  const { data: site, isLoading, error } = useSiteBySlug(slug);

  const article = getArticle(site?.slug, articleSlug);
  const others = getArticles(site?.slug)
    .filter((a) => a.slug !== articleSlug)
    .slice(0, 3);

  useDocumentMeta({
    title: article?.seoTitle || "Статья — Brandoors",
    description: article?.description,
    noIndex: !article,
    jsonLd: article
      ? [
          {
            "@context": "https://schema.org",
            "@type": "Article",
            headline: article.title,
            description: article.description,
            datePublished: article.date,
            dateModified: article.date,
            inLanguage: "ru-RU",
            ...(newsImage(article.cover)
              ? { image: [getPageUrl(newsImage(article.cover) as string)] }
              : {}),

            url: getPageUrl(),
            mainEntityOfPage: getPageUrl(),
            keywords: article.tags.join(", "),
            author: { "@type": "Organization", name: "Brandoors" },
            publisher: {
              "@type": "Organization",
              name: "Brandoors",
              logo: {
                "@type": "ImageObject",
                url: `${getPageUrl("/favicon.png")}`,
              },
            },
          },
          buildBreadcrumbSchema([
            { name: "Главная", path: storeHref(site?.slug, "") },
            { name: "Новости", path: storeHref(site?.slug, "news") },
            { name: article.title },
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

  if (!article) {
    return (
      <StorefrontLayout site={site}>
        <section
          className="min-h-[70vh] flex flex-col items-center justify-center text-center px-6"
          style={{ backgroundColor: "#07090D" }}
        >
          <h1
            className="text-3xl md:text-4xl font-extralight tracking-[0.12em] uppercase mb-6"
            style={{ fontFamily: FONT, color: "#F5F5F0" }}
          >
            Статья не найдена
          </h1>
          <Link
            to={storeHref(site.slug, "news")}
            className="inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.2em] font-semibold"
            style={{ color: "#cfbb96", fontFamily: FONT }}
          >
            <ArrowLeft className="w-4 h-4" />
            Все новости
          </Link>
        </section>
      </StorefrontLayout>
    );
  }

  return (
    <StorefrontLayout site={site}>
      <section className="relative overflow-hidden" style={{ backgroundColor: "#07090D" }}>
        <div
          className="absolute inset-0 opacity-[0.35]"
          style={{
            background:
              "radial-gradient(60% 45% at 15% 0%, rgba(207,187,150,0.10) 0%, transparent 70%)",
          }}
        />

        <div className="relative z-10 max-w-[820px] mx-auto px-6 py-24 md:py-32">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: EASE }}
          >
            <nav
              className="flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.2em] mb-10"
              style={{ color: "rgba(245,245,240,0.35)", fontFamily: FONT }}
              aria-label="Хлебные крошки"
            >
              <Link to={storeHref(site.slug, "")} className="hover:text-[#cfbb96] transition-colors">
                Главная
              </Link>
              <span>/</span>
              <Link
                to={storeHref(site.slug, "news")}
                className="hover:text-[#cfbb96] transition-colors"
              >
                Новости
              </Link>
            </nav>

            <div
              className="flex items-center gap-4 text-[11px] uppercase tracking-[0.2em] mb-6"
              style={{ color: "rgba(207,187,150,0.6)", fontFamily: FONT }}
            >
              <time dateTime={article.date}>{formatDate(article.date)}</time>
              <span className="inline-flex items-center gap-1.5">
                <Clock className="w-3 h-3" />
                {article.readingMinutes} мин
              </span>
            </div>

            <h1
              className="text-3xl md:text-5xl font-extralight leading-tight mb-10"
              style={{ fontFamily: FONT, color: "#F5F5F0" }}
            >
              {article.title}
            </h1>

            {newsImage(article.cover) && (
              <img
                src={newsImage(article.cover)}
                alt={article.title}
                className="w-full rounded-2xl object-cover mb-10"
                style={{ maxHeight: 460, backgroundColor: "#0c0e14" }}
                decoding="async"
              />
            )}

            <p
              className="text-base md:text-lg leading-relaxed pb-10 mb-10 border-b"
              style={{
                color: "rgba(245,245,240,0.6)",
                fontFamily: FONT,
                borderColor: "rgba(207,187,150,0.14)",
              }}
            >
              {article.excerpt}
            </p>

          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: EASE }}
            className="space-y-6"
          >
            {article.blocks.map((block, i) => {
              if (block.type === "h2") {
                return (
                  <h2
                    key={i}
                    className="text-xl md:text-2xl font-extralight tracking-[0.06em] pt-6"
                    style={{ fontFamily: FONT, color: "#F5F5F0" }}
                  >
                    {block.text}
                  </h2>
                );
              }
              if (block.type === "ul") {
                return (
                  <ul key={i} className="space-y-3 pl-1">
                    {block.items.map((item, j) => (
                      <li
                        key={j}
                        className="flex gap-3 text-[15px] md:text-base leading-relaxed"
                        style={{ color: "rgba(245,245,240,0.62)", fontFamily: FONT }}
                      >
                        <span
                          className="mt-[10px] h-[3px] w-[3px] rounded-full shrink-0"
                          style={{ backgroundColor: "#cfbb96" }}
                        />
                        {item}
                      </li>
                    ))}
                  </ul>
                );
              }
              if (block.type === "quote") {
                return (
                  <blockquote
                    key={i}
                    className="my-8 pl-6 border-l text-lg md:text-xl font-extralight leading-relaxed"
                    style={{
                      borderColor: "rgba(207,187,150,0.5)",
                      color: "#cfbb96",
                      fontFamily: FONT,
                    }}
                  >
                    {block.text}
                  </blockquote>
                );
              }
              if (block.type === "img") {
                const src = newsImage(block.src);
                if (!src) return null;
                return (
                  <figure key={i} className="my-10">
                    <img
                      src={src}
                      alt={block.alt}
                      loading="lazy"
                      decoding="async"
                      className="w-full rounded-2xl object-cover"
                      style={{ maxHeight: 520, backgroundColor: "#0c0e14" }}
                    />
                    {block.caption && (
                      <figcaption
                        className="mt-3 text-[12px] tracking-[0.06em]"
                        style={{ color: "rgba(245,245,240,0.4)", fontFamily: FONT }}
                      >
                        {block.caption}
                      </figcaption>
                    )}
                  </figure>
                );
              }
              if (block.type === "links") {
                return (
                  <div
                    key={i}
                    className="my-10 rounded-2xl border p-6"
                    style={{
                      borderColor: "rgba(207,187,150,0.18)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                    }}
                  >
                    <p
                      className="text-[11px] uppercase tracking-[0.24em] mb-4"
                      style={{ color: "rgba(207,187,150,0.6)", fontFamily: FONT }}
                    >
                      {block.title || "Смотрите также"}
                    </p>
                    <ul className="space-y-3">
                      {block.items.map((item) => (
                        <li key={item.to + item.label}>
                          <Link
                            to={storeHref(site.slug, item.to)}
                            className="inline-flex items-center gap-2 text-[15px] leading-snug transition-colors hover:text-[#cfbb96]"
                            style={{ color: "rgba(245,245,240,0.78)", fontFamily: FONT }}
                          >
                            <ArrowRight className="w-3.5 h-3.5 shrink-0 text-[#cfbb96]" />
                            {item.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                );
              }
              return (
                <p
                  key={i}
                  className="text-[15px] md:text-base leading-[1.85]"
                  style={{ color: "rgba(245,245,240,0.62)", fontFamily: FONT }}
                >
                  {block.text}
                </p>
              );

            })}
          </motion.div>

          {article.tags.length > 0 && (
            <div className="mt-14 flex flex-wrap gap-3">
              {article.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-4 py-2 rounded-full text-[11px] uppercase tracking-[0.18em] border"
                  style={{
                    borderColor: "rgba(207,187,150,0.2)",
                    color: "rgba(207,187,150,0.7)",
                    fontFamily: FONT,
                  }}
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div
            className="mt-14 pt-10 border-t flex flex-wrap items-center gap-4"
            style={{ borderColor: "rgba(207,187,150,0.14)" }}
          >
            <Link
              to={storeHref(site.slug, "catalog")}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-semibold uppercase tracking-[0.2em] text-[13px] transition-all duration-300 hover:scale-105"
              style={{
                background: "linear-gradient(135deg, #cfbb96 0%, #b5a07a 50%, #a08a60 100%)",
                color: "#0a0a0a",
                fontFamily: FONT,
              }}
            >
              Смотреть каталог
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to={storeHref(site.slug, "salon")}
              className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-semibold uppercase tracking-[0.2em] text-[13px] transition-all duration-300 hover:scale-105 border"
              style={{
                borderColor: "rgba(207,187,150,0.4)",
                color: "#cfbb96",
                fontFamily: FONT,
              }}
            >
              Салон {site.district || site.city}
            </Link>
          </div>

          {others.length > 0 && (
            <div className="mt-20">
              <h2
                className="text-[11px] uppercase tracking-[0.3em] mb-8"
                style={{ color: "rgba(207,187,150,0.6)", fontFamily: FONT }}
              >
                Читайте также
              </h2>
              <div className="grid gap-4 md:grid-cols-3">
                {others.map((a) => (
                  <Link
                    key={a.slug}
                    to={storeHref(site.slug, `news/${a.slug}`)}
                    className="rounded-2xl border p-6 transition-colors duration-300 hover:border-[rgba(207,187,150,0.4)]"
                    style={{
                      borderColor: "rgba(207,187,150,0.16)",
                      background:
                        "linear-gradient(180deg, rgba(255,255,255,0.03) 0%, rgba(255,255,255,0.01) 100%)",
                    }}
                  >
                    <p
                      className="text-[11px] uppercase tracking-[0.2em] mb-3"
                      style={{ color: "rgba(207,187,150,0.55)", fontFamily: FONT }}
                    >
                      {formatDate(a.date)}
                    </p>
                    <p
                      className="text-[15px] font-extralight leading-snug"
                      style={{ color: "#F5F5F0", fontFamily: FONT }}
                    >
                      {a.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>
    </StorefrontLayout>
  );
}
