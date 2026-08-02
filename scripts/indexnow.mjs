#!/usr/bin/env node
/**
 * IndexNow ping для Яндекса по всем 5 доменам.
 * Читает public/sitemap-<domain>.xml и отправляет URL в https://yandex.com/indexnow
 *
 * Запуск (после деплоя, когда ключ уже доступен на проде):
 *   node scripts/indexnow.mjs            # только не-товарные страницы (быстро)
 *   node scripts/indexnow.mjs --all      # все URL из карт сайта
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const KEY = readFileSync(resolve(ROOT, "public/indexnow-key.txt"), "utf8").trim();
const ALL = process.argv.includes("--all");

const DOMAINS = [
  "brandoors.moscow",
  "brandoors.online",
  "brandoors.pro",
  "brandoors.store",
  "brandoors.su",
];

const chunk = (arr, n) =>
  Array.from({ length: Math.ceil(arr.length / n) }, (_, i) => arr.slice(i * n, i * n + n));

for (const host of DOMAINS) {
  const file = resolve(ROOT, `public/sitemap-${host.replace(/\./g, "-")}.xml`);
  let xml;
  try {
    xml = readFileSync(file, "utf8");
  } catch {
    console.error(`skip ${host}: нет ${file}`);
    continue;
  }

  let urls = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  if (!ALL) urls = urls.filter((u) => !u.includes("/product/"));
  if (!urls.length) continue;

  for (const batch of chunk(urls, 10000)) {
    const res = await fetch("https://yandex.com/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify({
        host,
        key: KEY,
        keyLocation: `https://${host}/${KEY}.txt`,
        urlList: batch,
      }),
    });
    console.log(`${host}: ${batch.length} URL -> HTTP ${res.status}`);
  }
}
