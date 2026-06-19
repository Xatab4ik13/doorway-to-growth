#!/usr/bin/env node
/**
 * Зеркалирует все файлы из staging Supabase Storage (Lovable Cloud)
 * в прод Supabase Storage (self-hosted на api.brandoors.su) и
 * переписывает URL в БД на прод-домен.
 *
 * Запуск на проде:
 *   PROD_SUPABASE_URL=https://api.brandoors.su \
 *   PROD_SUPABASE_SERVICE_ROLE_KEY=<service_role с прод-VM> \
 *   node scripts/mirror-storage-to-prod.mjs
 *
 * Опции:
 *   --dry            — только показать что будет сделано
 *   --rewrite-only   — пропустить загрузку, только переписать URL в БД
 *   --table=...      — обработать одну таблицу (product_images по умолчанию все)
 */
import { createClient } from "@supabase/supabase-js";

const STAGING_HOST = "xhhxxmrhrvodybqcdcml.supabase.co";
const STAGING_BASE = `https://${STAGING_HOST}`;

const PROD_URL = process.env.PROD_SUPABASE_URL;
const PROD_KEY = process.env.PROD_SUPABASE_SERVICE_ROLE_KEY;
if (!PROD_URL || !PROD_KEY) {
  console.error("ERR: задайте PROD_SUPABASE_URL и PROD_SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const args = new Set(process.argv.slice(2));
const dry = args.has("--dry");
const rewriteOnly = args.has("--rewrite-only");

const prod = createClient(PROD_URL, PROD_KEY, { auth: { persistSession: false } });

// Таблицы и колонки с URL картинок
const TARGETS = [
  { table: "product_images", col: "url" },
  { table: "partner_banners", col: "image_url" },
  { table: "partner_staff", col: "photo_url" },
  { table: "partners", col: "logo_url" },
  { table: "sites", col: "logo_url" },
  { table: "glazing_options", col: "swatch_url" },
];

function parseUrl(url) {
  // https://<host>/storage/v1/object/public/<bucket>/<path>
  const m = url.match(/\/storage\/v1\/object\/public\/([^/]+)\/(.+)$/);
  if (!m) return null;
  return { bucket: m[1], path: decodeURIComponent(m[2]) };
}

async function ensureUploaded(bucket, path, sourceUrl) {
  // Проверим есть ли уже файл
  const { data: existing } = await prod.storage.from(bucket).list(path.split("/").slice(0, -1).join("/"), {
    search: path.split("/").pop(),
    limit: 1,
  });
  if (existing && existing.length > 0) return "exists";

  if (dry) return "would-upload";

  const res = await fetch(sourceUrl);
  if (!res.ok) throw new Error(`fetch ${sourceUrl} → ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  const contentType = res.headers.get("content-type") || "application/octet-stream";

  const { error } = await prod.storage.from(bucket).upload(path, buf, {
    contentType,
    upsert: true,
  });
  if (error) throw error;
  return "uploaded";
}

async function processTable({ table, col }) {
  console.log(`\n=== ${table}.${col} ===`);
  const { data: rows, error } = await prod
    .from(table)
    .select(`id, ${col}`)
    .like(col, `%${STAGING_HOST}%`);
  if (error) {
    console.error(`  пропуск (${error.message})`);
    return;
  }
  console.log(`  записей со staging-URL: ${rows.length}`);

  let ok = 0, skipped = 0, failed = 0;
  for (const row of rows) {
    const url = row[col];
    const parsed = parseUrl(url);
    if (!parsed) { skipped++; continue; }

    try {
      if (!rewriteOnly) {
        const status = await ensureUploaded(parsed.bucket, parsed.path, url);
        if (status === "uploaded") process.stdout.write(".");
        else if (status === "exists") process.stdout.write("=");
        else process.stdout.write("?");
      }

      const newUrl = url.replace(STAGING_BASE, PROD_URL.replace(/\/$/, ""));
      if (!dry) {
        const { error: upErr } = await prod.from(table).update({ [col]: newUrl }).eq("id", row.id);
        if (upErr) throw upErr;
      }
      ok++;
    } catch (e) {
      failed++;
      console.error(`\n  fail ${row.id}: ${e.message}`);
    }
  }
  console.log(`\n  готово: ok=${ok} skipped=${skipped} failed=${failed}`);
}

for (const t of TARGETS) {
  await processTable(t);
}
console.log("\nDone.");
