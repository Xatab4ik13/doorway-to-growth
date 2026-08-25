#!/usr/bin/env node
/**
 * Отправка URL на переобход в Яндекс.Вебмастер (лимит ~20 URL/сутки на хост).
 * Требует переменную окружения YANDEX_OAUTH_TOKEN.
 *
 *   node scripts/yandex-recrawl.mjs             # приоритетные страницы (категории/салоны/новости)
 *   node scripts/yandex-recrawl.mjs --quota     # только показать остаток квоты
 */
import { readFileSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const TOKEN = process.env.YANDEX_OAUTH_TOKEN;
if (!TOKEN) {
  console.error("Нет YANDEX_OAUTH_TOKEN");
  process.exit(1);
}
const API = "https://api.webmaster.yandex.net/v4";
const H = { Authorization: `OAuth ${TOKEN}`, "Content-Type": "application/json" };
const QUOTA_ONLY = process.argv.includes("--quota");

const DOMAINS = [
  "brandoors.moscow",
  "brandoors.online",
  "brandoors.pro",
  "brandoors.store",
  "brandoors.su",
];

// приоритет: главная -> категории -> салоны -> новости -> товары
const priority = (u) => {
  const p = new URL(u).pathname;
  if (p === "/") return 0;
  if (p.startsWith("/catalog")) return 1;
  if (p.startsWith("/salon")) return 2;
  if (p.startsWith("/news")) return 3;
  if (p.startsWith("/product/")) return 5;
  return 4;
};

const api = async (path, init) => {
  const res = await fetch(`${API}${path}`, { headers: H, ...init });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { raw: text };
  }
  return { ok: res.ok, status: res.status, json };
};

const me = await api("/user/");
const userId = me.json.user_id;
if (!userId) {
  console.error("Не удалось получить user_id:", me.status, me.json);
  process.exit(1);
}

const hostsRes = await api(`/user/${userId}/hosts/`);
const hosts = hostsRes.json.hosts || [];

for (const domain of DOMAINS) {
  const host =
    hosts.find((h) => h.ascii_host_url === `https://${domain}/` && !h.main_mirror) ||
    hosts.find((h) => h.ascii_host_url === `https://${domain}/`);
  if (!host) {
    console.log(`${domain}: хост не найден в Вебмастере`);
    continue;
  }
  const q = await api(`/user/${userId}/hosts/${host.host_id}/recrawl/quota/`);
  const remaining = q.json.quota_remainder ?? 0;
  console.log(`${domain}: квота ${remaining}/${q.json.daily_quota ?? "?"}`);
  if (QUOTA_ONLY || remaining <= 0) continue;

  const file = resolve(ROOT, `public/sitemap-${domain.replace(/\./g, "-")}.xml`);
  let urls;
  try {
    urls = [...readFileSync(file, "utf8").matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1]);
  } catch {
    console.log(`  нет карты сайта ${file}`);
    continue;
  }
  urls.sort((a, b) => priority(a) - priority(b) || a.length - b.length);

  let sent = 0;
  for (const url of urls.slice(0, remaining)) {
    const r = await api(`/user/${userId}/hosts/${host.host_id}/recrawl/queue/`, {
      method: "POST",
      body: JSON.stringify({ url }),
    });
    if (r.ok) sent++;
    else {
      console.log(`  ${url} -> ${r.status} ${JSON.stringify(r.json)}`);
      if (r.status === 429 || r.json?.error_code === "QUOTA_EXCEEDED") break;
    }
  }
  console.log(`  отправлено на переобход: ${sent}`);
}
