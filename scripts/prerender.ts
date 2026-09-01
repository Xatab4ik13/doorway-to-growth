/**
 * Статический пререндер storefront для поисковых роботов.
 *
 * Проблема: приложение — SPA. YandexBot получает одинаковый пустой index.html
 * на все URL, из-за чего страницы попадают в SOFT_404 и «дубли».
 *
 * Решение: после сборки для каждого из пяти доменов и каждого статического
 * маршрута кладём готовый HTML с уникальными <title>, description, canonical,
 * OG, JSON-LD и текстовым содержимым внутри #root. React при загрузке
 * перерисовывает #root, поэтому на поведение приложения это не влияет.
 *
 * Результат: dist/_pre/<домен>/<путь>/index.html
 * nginx отдаёт его роботу и пользователю: try_files $uri /_pre/<домен>$uri/index.html /index.html;
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import {
  CATEGORY_SEO,
  COLLECTION_SEO,
  COLLECTIONS_PARENT_SLUG,
  ENTRANCE_PARENT_SLUG,
  ENTRANCE_SUBCATEGORIES,
  cityIn,
  buildHomeMeta,
  buildCatalogMeta,
  buildProductMeta,
  collectionSlugByName,
  siteShortName,
  siteLocality,
  type SiteMetaSource,
} from "../src/lib/catalogRoutes";
import { NEWS_BY_SITE } from "../src/content/news";
import type { Article } from "../src/content/news";
import PRODUCT_SNAPSHOT from "../src/content/products-snapshot.json";
import { BRAND_ID, BRAND_NAME, BRAND_URL, BRAND_HOST, BRAND_SAME_AS } from "../src/lib/brand";

/** Снимок каталога: карточки товаров пререндерятся без обращения к БД. */
interface SnapshotProduct {
  slug: string;
  name: string;
  description: string | null;
  rrp: number | null;
  categoryName: string | null;
  categorySlug: string | null;
  parentName: string | null;
  parentSlug: string | null;
  rootSlug: string | null;
  rootName: string | null;
}

/** Фурнитуру не пререндерим: 700+ мелких SKU дали бы тонкие однотипные страницы. */
const PRERENDER_ROOTS = new Set(["mezhkomnatnye-dveri", "entrance-doors", "pogonazh"]);

const PRODUCTS = (PRODUCT_SNAPSHOT as SnapshotProduct[]).filter((p) =>
  PRERENDER_ROOTS.has(p.rootSlug || p.categorySlug || "")
);


const DIST = resolve(process.cwd(), "dist");
const OUT_ROOT = resolve(DIST, "_pre");

interface SiteInfo extends SiteMetaSource {
  slug: string;
  domain: string;
  name: string;
  city: string;
  district: string;
  address: string;
  phone: string;
}

/** Данные салонов дублируются статикой: пререндер не должен зависеть от доступности БД. */
const SITES: SiteInfo[] = [
  {
    slug: "scherbinka",
    domain: "brandoors.moscow",
    name: "BRANDOORS Щербинка",
    city: "Москва",
    district: "Щербинка",
    address: "г. Щербинка, Квартал 120, д. 6, Павильон, 3 этаж",
    phone: "+7 (964) 514-14-44",
  },
  {
    slug: "kashirsky",
    domain: "brandoors.online",
    name: "BRANDOORS Каширский двор",
    city: "Москва",
    district: "Южный",
    address: "Каширское шоссе, д. 19, к. 1, 4 этаж, пав. 4-А40, ТК «Каширский двор»",
    phone: "+7 (999) 707-88-08",
  },
  {
    slug: "roomer",
    domain: "brandoors.store",
    name: "BRANDOORS Roomer",
    city: "Москва",
    district: "ТЦ ROOMER",
    address: "Ленинская слобода, д. 26, Галерея А, подиум 116, павильон А116",
    phone: "+7 (965) 232-57-77",
  },
  {
    slug: "dekorator",
    domain: "brandoors.pro",
    name: "BRANDOORS Декоратор",
    city: "Москва",
    district: "Юго-Восточный",
    address: "Рязанский проспект, д. 2, к. 3, павильон 231, ТЦ «Декоратор»",
    phone: "+7 (925) 486-82-24",
  },
  {
    slug: "m2",
    domain: "brandoors.su",
    name: "BRANDOORS Метр Квадратный",
    city: "Москва",
    district: "Южнопортовый",
    address: "Волгоградский проспект, д. 32, к. 25, ТЦ «Метр Квадратный», павильон 157, 1 этаж",
    phone: "+7 (906) 771-00-66",
  },
];

/* ------------------------------------------------------------------ */
/*  Утилиты                                                            */
/* ------------------------------------------------------------------ */

function esc(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

interface PageSpec {
  path: string;
  title: string;
  description: string;
  h1: string;
  /** Абзацы и подзаголовки основного текста. */
  body: string[];
  /** Внутренние ссылки для обхода роботом. */
  links: Array<{ href: string; label: string }>;
  jsonLd?: Record<string, unknown>[];
}

/** Единая Organization бренда: все домены сходятся на brandoors.online. */
function organization() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": BRAND_ID,
    name: BRAND_NAME,
    url: BRAND_URL,
    logo: `${BRAND_URL}/favicon.png`,
    sameAs: BRAND_SAME_AS,
    description: "Производитель межкомнатных и входных дверей премиум-класса",
  };
}

function localBusiness(site: SiteInfo) {
  const origin = `https://${site.domain}`;
  return {
    "@context": "https://schema.org",
    "@type": "FurnitureStore",
    "@id": `${origin}/#store`,
    name: site.name,
    url: origin,
    telephone: site.phone,
    image: `${origin}/og-image.png`,
    address: {
      "@type": "PostalAddress",
      streetAddress: site.address,
      addressLocality: site.city,
      addressCountry: "RU",
    },
    areaServed: site.city,
    brand: { "@id": BRAND_ID },
    parentOrganization: {
      "@id": BRAND_ID,
      "@type": "Organization",
      name: BRAND_NAME,
      url: BRAND_URL,
    },
  };
}

function breadcrumbs(origin: string, trail: Array<{ name: string; path: string }>) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: trail.map((t, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: t.name,
      item: `${origin}${t.path}`,
    })),
  };
}

/** Текст статьи в плоские абзацы (без картинок и служебных блоков). */
function articleBody(article: Article): string[] {
  const out: string[] = [];
  for (const b of article.blocks) {
    if (b.type === "p" || b.type === "quote") out.push(b.text);
    else if (b.type === "h2") out.push(`## ${b.text}`);
    else if (b.type === "ul") out.push(...b.items.map((i) => `— ${i}`));
  }
  return out;
}

/* ------------------------------------------------------------------ */
/*  Список страниц для одного салона                                   */
/* ------------------------------------------------------------------ */

function pagesForSite(site: SiteInfo): PageSpec[] {
  const origin = `https://${site.domain}`;
  const salon = siteShortName(site);
  const locality = siteLocality(site);
  const pages: PageSpec[] = [];

  const catalogLinks = [
    { href: "/catalog/mezhkomnatnye-dveri", label: "Межкомнатные двери" },
    { href: "/catalog/entrance-doors", label: "Входные двери" },
    { href: "/catalog/pogonazh", label: "Погонаж" },
    { href: "/catalog/furnitura", label: "Фурнитура" },
  ];

  // Главная
  const home = buildHomeMeta(site);
  pages.push({
    path: "/",
    title: home.title,
    description: home.description,
    h1: home.h1,
    body: [
      home.offer,
      home.intro,
      `Салон ${salon}: ${site.address}. Телефон ${site.phone}. Замер, доставка и установка по Москве и области.`,
    ],
    links: [
      ...catalogLinks,
      { href: "/salon", label: `Салон ${salon}` },
      { href: "/brand", label: "О бренде Brandoors" },
      { href: "/news", label: "Статьи и новости" },
    ],
    jsonLd: [organization(), localBusiness(site)],
  });

  // Корень каталога
  const catalogMeta = buildCatalogMeta(site, null, null);
  pages.push({
    path: "/catalog",
    title: catalogMeta.title,
    description: catalogMeta.description,
    h1: `${catalogMeta.h1} — салон ${salon}`,
    body: [
      `Каталог Brandoors в салоне ${salon}, ${locality}: межкомнатные и входные двери, погонаж и фурнитура собственного производства.`,
      "Выберите категорию, чтобы посмотреть модели, покрытия и размерные сетки. Комплект под конкретный проём рассчитает менеджер салона после замера.",
    ],
    links: catalogLinks,
    jsonLd: [
      breadcrumbs(origin, [
        { name: "Главная", path: "/" },
        { name: "Каталог", path: "/catalog" },
      ]),
    ],
  });

  // Категории
  for (const category of Object.values(CATEGORY_SEO)) {
    const meta = buildCatalogMeta(site, category, null);
    const path = `/catalog/${category.slug}`;
    pages.push({
      path,
      title: meta.title,
      description: meta.description,
      h1: `${meta.h1} — салон ${salon}, ${locality}`,
      body: [category.intro, ...(category.body ?? [])],
      links:
        category.slug === COLLECTIONS_PARENT_SLUG
          ? Object.values(COLLECTION_SEO).map((c) => ({
              href: `/catalog/${COLLECTIONS_PARENT_SLUG}/${c.slug}`,
              label: c.keyphrase,
            }))
          : catalogLinks.filter((l) => l.href !== path),
      jsonLd: [
        breadcrumbs(origin, [
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/catalog" },
          { name: category.name, path },
        ]),
      ],
    });
  }

  // Подкатегории входных дверей (стальные и Термо)
  for (const sub of ENTRANCE_SUBCATEGORIES) {
    const path = `/catalog/${ENTRANCE_PARENT_SLUG}/${sub.slug}`;
    const title = sub.dbName
      ? `Входные двери Термо Brandoors — купить в ${cityIn(site.city)}, ${salon}`
      : `Входные двери Brandoors — купить в ${cityIn(site.city)}, салон ${salon}`;
    const description = sub.dbName
      ? `Входные двери Термо Brandoors с терморазрывом: не промерзают и не собирают конденсат. Салон ${salon}, ${locality}: цены, экспозиция, замер и установка.`
      : `Стальные входные двери Brandoors: два контура уплотнения, два замка, отделка под интерьер. Салон ${salon}, ${locality}: цены, экспозиция, замер и установка.`;
    pages.push({
      path,
      title,
      description,
      h1: `${sub.name} Brandoors — салон ${salon}, ${locality}`,
      body: [
        sub.intro,
        sub.dbName
          ? `Серия Термо рассчитана на вход с улицы: терморазрыв в полотне и коробке, морозостойкое покрытие, комплект уплотнителей по контуру. В салоне ${salon} можно посмотреть срез полотна и сравнить отделки.`
          : `Стальные входные двери подходят для квартиры и тамбура: жёсткий каркас, скрытые петли, отделка полотна в одной палитре с межкомнатными дверями Brandoors. Замер и подбор — в салоне ${salon}.`,
        `Адрес салона: ${site.address}. Телефон ${site.phone}. Замер, доставка и установка по Москве и области.`,
      ],
      links: [
        { href: `/catalog/${ENTRANCE_PARENT_SLUG}`, label: "Все входные двери" },
        ...ENTRANCE_SUBCATEGORIES.filter((s) => s.slug !== sub.slug).map((s) => ({
          href: `/catalog/${ENTRANCE_PARENT_SLUG}/${s.slug}`,
          label: s.name,
        })),
        { href: "/salon", label: `Салон ${salon}` },
      ],
      jsonLd: [
        breadcrumbs(origin, [
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/catalog" },
          { name: "Входные двери", path: `/catalog/${ENTRANCE_PARENT_SLUG}` },
          { name: sub.name, path },
        ]),
      ],
    });
  }

  // Коллекции межкомнатных дверей
  for (const collection of Object.values(COLLECTION_SEO)) {
    const meta = buildCatalogMeta(site, CATEGORY_SEO[COLLECTIONS_PARENT_SLUG], collection);
    const path = `/catalog/${COLLECTIONS_PARENT_SLUG}/${collection.slug}`;
    pages.push({
      path,
      title: meta.title,
      description: meta.description,
      h1: `${meta.h1} — салон ${salon}`,
      body: [collection.intro, ...(collection.body ?? [])],
      links: Object.values(COLLECTION_SEO)
        .filter((c) => c.slug !== collection.slug)
        .map((c) => ({
          href: `/catalog/${COLLECTIONS_PARENT_SLUG}/${c.slug}`,
          label: c.keyphrase,
        })),
      jsonLd: [
        breadcrumbs(origin, [
          { name: "Главная", path: "/" },
          { name: "Каталог", path: "/catalog" },
          { name: "Межкомнатные двери", path: `/catalog/${COLLECTIONS_PARENT_SLUG}` },
          { name: collection.name, path },
        ]),
      ],
    });
  }

  // Салон
  pages.push({
    path: "/salon",
    title: `Салон дверей ${salon} — ${locality}, Москва — Brandoors`,
    description: `Салон Brandoors ${salon}: ${site.address}. Экспозиция межкомнатных и входных дверей, замер, доставка и установка. Телефон ${site.phone}.`,
    h1: `Салон Brandoors ${salon}`,
    body: [
      `Адрес: ${site.address}. Телефон: ${site.phone}.`,
      `В экспозиции салона представлены полотна, короба, погонаж и фурнитура Brandoors. Покрытия и оттенки удобнее выбирать вживую: эмаль и шпон по-разному читаются при разном освещении.`,
      "Менеджер помогает собрать комплект на всю квартиру в одном оттенке, рассчитывает стоимость с погонажем и фурнитурой, организует замер, доставку и установку.",
    ],
    links: [...catalogLinks, { href: "/news", label: "Статьи салона" }],
    jsonLd: [localBusiness(site)],
  });

  // О бренде
  pages.push({
    path: "/brand",
    title: `О бренде Brandoors — производство дверей — салон ${salon}`,
    description: `Brandoors — российское производство межкомнатных и входных дверей премиум-класса: скрытый монтаж, эмаль, шпон, стекло. Салон ${salon}, ${locality}.`,
    h1: "О бренде Brandoors",
    body: [
      "Brandoors — российский производитель межкомнатных и входных дверей премиум-класса. Собственное производство позволяет выпускать полотна нестандартной высоты, собирать скрытые короба и подбирать покрытия под конкретный интерьер.",
      "Линейка включает шесть коллекций межкомнатных дверей — ESTETICA, GHOST, HEAVY, PRIME, REFLECT и MAZE, а также входные двери с терморазрывом, погонаж и фурнитуру в единой палитре.",
      `Посмотреть продукцию вживую можно в салоне ${salon}: ${site.address}.`,
    ],
    links: [...catalogLinks, { href: "/salon", label: `Салон ${salon}` }],
    jsonLd: [organization()],
  });

  // Лента статей
  const articles = [...(NEWS_BY_SITE[site.slug] ?? [])].sort((a, b) => (a.date < b.date ? 1 : -1));
  pages.push({
    path: "/news",
    title: `Статьи о дверях — салон ${salon}, ${locality}`,
    description: `Статьи салона Brandoors ${salon}: подбор межкомнатных и входных дверей, покрытия, замер, монтаж и разборы коллекций.`,
    h1: `Статьи и новости — салон ${salon}`,
    body: articles.map((a) => `${a.title}. ${a.excerpt}`),
    links: articles.map((a) => ({ href: `/news/${a.slug}`, label: a.title })),
  });

  // Статьи
  for (const article of articles) {
    pages.push({
      path: `/news/${article.slug}`,
      title: article.seoTitle,
      description: article.description,
      h1: article.title,
      body: articleBody(article),
      links: [
        { href: "/news", label: "Все статьи салона" },
        ...catalogLinks.slice(0, 2),
      ],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Article",
          headline: article.title,
          description: article.description,
          datePublished: article.date,
          dateModified: article.date,
          inLanguage: "ru-RU",
          mainEntityOfPage: `${origin}/news/${article.slug}`,
          author: { "@id": BRAND_ID, "@type": "Organization", name: BRAND_NAME, url: BRAND_URL },
          publisher: {
            "@id": BRAND_ID,
            "@type": "Organization",
            name: BRAND_NAME,
            url: BRAND_URL,
            logo: { "@type": "ImageObject", url: `${BRAND_URL}/favicon.png` },
          },
        },
        breadcrumbs(origin, [
          { name: "Главная", path: "/" },
          { name: "Статьи", path: "/news" },
          { name: article.title, path: `/news/${article.slug}` },
        ]),
      ],
    });
  }

  // Карточки товаров
  for (const product of PRODUCTS) {
    const collectionSlug = collectionSlugByName(product.categoryName);
    const collection = collectionSlug ? COLLECTION_SEO[collectionSlug] : null;
    const rootSlug = product.rootSlug || product.categorySlug || "";
    const category = CATEGORY_SEO[rootSlug] ?? null;
    const meta = buildProductMeta(site, product, category, collection);
    const path = `/product/${product.slug}`;
    const price = product.rrp && Number(product.rrp) > 0 ? Number(product.rrp) : null;
    const groupName = collection?.name || category?.name || product.categoryName || "Двери Brandoors";

    const categoryPath = category ? `/catalog/${category.slug}` : "/catalog";
    const collectionPath = collection
      ? `/catalog/${COLLECTIONS_PARENT_SLUG}/${collection.slug}`
      : null;

    const trail = [
      { name: "Главная", path: "/" },
      { name: "Каталог", path: "/catalog" },
      ...(category ? [{ name: category.name, path: categoryPath }] : []),
      ...(collection && collectionPath ? [{ name: collection.name, path: collectionPath }] : []),
      { name: product.name, path },
    ];

    pages.push({
      path,
      title: meta.title,
      description: meta.description,
      h1: `${product.name} — ${groupName}`,
      body: [
        product.description?.trim() ||
          `${product.name} — ${groupName.toLowerCase()} Brandoors. Полотно изготавливается под размер проёма, покрытие и фурнитура подбираются в салоне.`,
        price
          ? `Рекомендованная цена от ${Math.round(price).toLocaleString("ru-RU")} ₽. Итоговая стоимость зависит от размера, покрытия, остекления и комплекта фурнитуры.`
          : "Цена рассчитывается индивидуально: она зависит от размера проёма, покрытия, остекления и комплекта фурнитуры.",
        `Посмотреть модель вживую можно в салоне ${salon}: ${site.address}. Телефон ${site.phone}. Замер, доставка и установка по Москве и области.`,
      ],
      links: [
        ...(collectionPath ? [{ href: collectionPath, label: `Коллекция ${collection!.name}` }] : []),
        { href: categoryPath, label: category?.name || "Каталог" },
        { href: "/salon", label: `Салон ${salon}` },
      ],
      jsonLd: [
        {
          "@context": "https://schema.org",
          "@type": "Product",
          name: product.name,
          description: meta.description,
          category: groupName,
          brand: { "@type": "Brand", name: BRAND_NAME, url: BRAND_URL },
          manufacturer: { "@id": BRAND_ID, "@type": "Organization", name: BRAND_NAME, url: BRAND_URL },
          url: `${origin}${path}`,
          offers: {
            "@type": "Offer",
            url: `${origin}${path}`,
            priceCurrency: "RUB",
            ...(price ? { price: String(Math.round(price)) } : {}),
            availability: "https://schema.org/InStock",
            seller: { "@type": "Organization", name: site.name },
          },
        },
        breadcrumbs(origin, trail),
      ],
    });
  }

  return pages;

}

/* ------------------------------------------------------------------ */
/*  Генерация HTML                                                     */
/* ------------------------------------------------------------------ */

function renderBody(page: PageSpec, site: SiteInfo): string {
  const blocks = page.body
    .map((line) =>
      line.startsWith("## ")
        ? `<h2>${esc(line.slice(3))}</h2>`
        : `<p>${esc(line)}</p>`
    )
    .join("\n      ");

  // Дилерские домены ссылаются на головной сайт бренда.
  const allLinks =
    site.domain === BRAND_HOST
      ? page.links
      : [
          ...page.links,
          { href: BRAND_URL, label: `Официальный сайт бренда Brandoors — ${BRAND_HOST}` },
        ];

  const links = allLinks
    .map((l) => `<li><a href="${esc(l.href)}">${esc(l.label)}</a></li>`)
    .join("\n        ");

  return [
    `<div id="prerender-seo">`,
    `      <h1>${esc(page.h1)}</h1>`,
    `      ${blocks}`,
    links ? `      <nav><ul>\n        ${links}\n      </ul></nav>` : "",
    `    </div>`,
  ]
    .filter(Boolean)
    .join("\n    ");
}

function renderPage(template: string, site: SiteInfo, page: PageSpec): string {
  const origin = `https://${site.domain}`;
  const url = `${origin}${page.path === "/" ? "/" : page.path}`;
  const title = esc(page.title);
  const description = esc(page.description);

  let html = template;

  html = html.replace(/<title>[\s\S]*?<\/title>/, `<title>${title}</title>`);
  html = html.replace(
    /<meta name="description"[^>]*>/,
    `<meta name="description" content="${description}" />`
  );
  html = html.replace(
    /<link rel="canonical"[^>]*>/,
    `<link rel="canonical" href="${url}" />`
  );
  html = html.replace(
    /<meta property="og:title"[^>]*>/,
    `<meta property="og:title" content="${title}" />`
  );
  html = html.replace(
    /<meta property="og:description"[^>]*>/,
    `<meta property="og:description" content="${description}" />`
  );
  html = html.replace(
    /<meta property="og:url"[^>]*>/,
    `<meta property="og:url" content="${url}" />`
  );
  html = html.replace(
    /<meta name="twitter:title"[^>]*>/,
    `<meta name="twitter:title" content="${title}" />`
  );
  html = html.replace(
    /<meta name="twitter:description"[^>]*>/,
    `<meta name="twitter:description" content="${description}" />`
  );

  if (page.jsonLd?.length) {
    const scripts = page.jsonLd
      .map(
        (data) =>
          `<script type="application/ld+json">${JSON.stringify(data).replace(/</g, "\\u003c")}</script>`
      )
      .join("\n    ");
    html = html.replace("</head>", `  ${scripts}\n  </head>`);
  }

  html = html.replace(
    /<div id="root"><\/div>/,
    `<div id="root">${renderBody(page, site)}</div>`
  );

  return html;
}

/* ------------------------------------------------------------------ */

function main() {
  const templatePath = resolve(DIST, "index.html");
  if (!existsSync(templatePath)) {
    console.warn("[prerender] dist/index.html не найден — пропускаю пререндер.");
    return;
  }
  const template = readFileSync(templatePath, "utf-8");

  let count = 0;
  for (const site of SITES) {
    for (const page of pagesForSite(site)) {
      const dir =
        page.path === "/"
          ? resolve(OUT_ROOT, site.domain)
          : resolve(OUT_ROOT, site.domain, page.path.replace(/^\//, ""));
      mkdirSync(dir, { recursive: true });
      writeFileSync(resolve(dir, "index.html"), renderPage(template, site, page), "utf-8");
      count++;
    }
  }

  writeDomainSitemaps();

  console.log(`[prerender] Сгенерировано ${count} HTML-страниц для ${SITES.length} доменов → dist/_pre/`);
}

/**
 * Каждому домену — собственные /sitemap.xml и /robots.txt.
 * Раньше со всех пяти доменов отдавался один общий sitemap-индекс со ссылками
 * на чужие домены — поисковики такие карты игнорируют.
 */
function writeDomainSitemaps() {
  for (const site of SITES) {
    const origin = `https://${site.domain}`;
    const src = resolve(DIST, `sitemap-${site.domain.replace(/\./g, "-")}.xml`);
    if (!existsSync(src)) {
      console.warn(`[prerender] нет карты сайта для ${site.domain} — пропускаю`);
      continue;
    }
    const dir = resolve(OUT_ROOT, site.domain);
    mkdirSync(dir, { recursive: true });
    writeFileSync(resolve(dir, "sitemap.xml"), readFileSync(src, "utf-8"), "utf-8");

    const robotsSrc = resolve(DIST, "robots.txt");
    const robots = existsSync(robotsSrc) ? readFileSync(robotsSrc, "utf-8") : "User-agent: *\nAllow: /\n";
    writeFileSync(
      resolve(dir, "robots.txt"),
      `${robots.trimEnd()}\n\nSitemap: ${origin}/sitemap.xml\n`,
      "utf-8"
    );
  }
  console.log(`[prerender] sitemap.xml и robots.txt записаны для ${SITES.length} доменов`);
}

main();
