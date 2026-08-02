import { writeFileSync, existsSync, mkdirSync } from "fs";
import { resolve } from "path";
import { createClient } from "@supabase/supabase-js";

// 5 торговых доменов Brandoors
const DOMAINS = [
  "brandoors.moscow",
  "brandoors.online",
  "brandoors.store",
  "brandoors.pro",
  "brandoors.su",
];

// Статические маршруты storefront (внутренние и админ-роуты исключены)
const STATIC_ROUTES = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/catalog", changefreq: "weekly", priority: "0.9" },
  // Статические SEO-маршруты категорий
  { path: "/catalog/mezhkomnatnye-dveri", changefreq: "weekly", priority: "0.9" },
  { path: "/catalog/entrance-doors", changefreq: "weekly", priority: "0.9" },
  { path: "/catalog/pogonazh", changefreq: "weekly", priority: "0.7" },
  { path: "/catalog/furnitura", changefreq: "weekly", priority: "0.7" },
  // Коллекции межкомнатных дверей
  { path: "/catalog/mezhkomnatnye-dveri/estetica", changefreq: "weekly", priority: "0.8" },
  { path: "/catalog/mezhkomnatnye-dveri/ghost", changefreq: "weekly", priority: "0.8" },
  { path: "/catalog/mezhkomnatnye-dveri/heavy", changefreq: "weekly", priority: "0.8" },
  { path: "/catalog/mezhkomnatnye-dveri/prime", changefreq: "weekly", priority: "0.8" },
  { path: "/catalog/mezhkomnatnye-dveri/reflect", changefreq: "weekly", priority: "0.8" },
  { path: "/catalog/mezhkomnatnye-dveri/maze", changefreq: "weekly", priority: "0.8" },

  { path: "/brand", changefreq: "monthly", priority: "0.8" },
  { path: "/news", changefreq: "weekly", priority: "0.7" },
];

interface SitemapEntry {
  loc: string;
  changefreq?: string;
  priority?: string;
  lastmod?: string;
}

function today() {
  return new Date().toISOString().split("T")[0];
}

function escapeXml(s: string) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

function buildUrlset(entries: SitemapEntry[]) {
  const urls = entries
    .map(
      (e) =>
        [
          `  <url>`,
          `    <loc>${escapeXml(e.loc)}</loc>`,
          e.lastmod ? `    <lastmod>${e.lastmod}</lastmod>` : null,
          e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
          e.priority ? `    <priority>${e.priority}</priority>` : null,
          `  </url>`,
        ]
          .filter(Boolean)
          .join("\n")
    )
    .join("\n");

  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    urls,
    `</urlset>`,
  ].join("\n");
}

async function fetchProducts() {
  const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
  const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

  if (!url || !key) {
    console.warn("Supabase credentials not found. Generating sitemap with static routes only.");
    return [];
  }

  const supabase = createClient(url, key);
  const PAGE = 1000;
  const all: { slug: string }[] = [];

  for (let from = 0; ; from += PAGE) {
    const { data, error } = await supabase
      .from("products")
      .select("slug")
      .eq("is_active", true)
      .order("sort_order", { ascending: true })
      .order("id", { ascending: true })
      .range(from, from + PAGE - 1);

    if (error) {
      console.warn("Failed to fetch products:", error.message);
      break;
    }
    if (!data || data.length === 0) break;
    all.push(...data);
    if (data.length < PAGE) break;
  }

  return all;
}

async function main() {
  const publicDir = resolve("public");
  if (!existsSync(publicDir)) mkdirSync(publicDir, { recursive: true });

  const products = await fetchProducts();
  const date = today();
  const indexEntries: string[] = [];

  for (const domain of DOMAINS) {
    const entries: SitemapEntry[] = STATIC_ROUTES.map((r) => ({
      loc: `https://${domain}${r.path}`,
      changefreq: r.changefreq,
      priority: r.priority,
      lastmod: date,
    }));

    for (const product of products) {
      if (!product.slug) continue;
      entries.push({
        loc: `https://${domain}/product/${product.slug}`,
        changefreq: "weekly",
        priority: "0.7",
        lastmod: date,
      });
    }

    const sitemapName = `sitemap-${domain.replace(/\./g, "-")}.xml`;
    const sitemapPath = resolve(publicDir, sitemapName);
    writeFileSync(sitemapPath, buildUrlset(entries));
    indexEntries.push(`https://${domain}/${sitemapName}`);
    console.log(`Wrote ${sitemapName} (${entries.length} entries)`);
  }

  // Sitemap index
  const index = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    indexEntries
      .map(
        (loc) =>
          `  <sitemap>\n    <loc>${escapeXml(loc)}</loc>\n    <lastmod>${date}</lastmod>\n  </sitemap>`
      )
      .join("\n"),
    `</sitemapindex>`,
  ].join("\n");

  writeFileSync(resolve(publicDir, "sitemap.xml"), index);
  console.log(`Wrote sitemap.xml (index of ${indexEntries.length} domain sitemaps)`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
