/**
 * Снимок активного каталога → src/content/products-snapshot.json
 *
 * Пререндер и sitemap не должны зависеть от доступности БД во время сборки
 * (на прод-VM переменные VITE_SUPABASE_* при билде часто отсутствуют).
 * Поэтому список товаров фиксируется снимком и коммитится в репозиторий.
 *
 * Запуск после изменений каталога: bunx tsx scripts/snapshot-products.ts
 */

import { createClient } from "@supabase/supabase-js";
import { writeFileSync } from "fs";
import { resolve } from "path";

const url = process.env.VITE_SUPABASE_URL || process.env.SUPABASE_URL;
const key = process.env.VITE_SUPABASE_PUBLISHABLE_KEY || process.env.SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  console.error("Нет VITE_SUPABASE_URL / VITE_SUPABASE_PUBLISHABLE_KEY — снимок не обновлён.");
  process.exit(1);
}

const supabase = createClient(url, key);

async function main() {
  const { data: cats, error: catErr } = await supabase
    .from("categories")
    .select("id,name,slug,parent_id");
  if (catErr) throw catErr;

  const byId = Object.fromEntries((cats ?? []).map((c) => [c.id, c]));

  const all: any[] = [];
  for (let from = 0; ; from += 1000) {
    const { data, error } = await supabase
      .from("products")
      .select("slug,name,description,rrp,category_id")
      .eq("is_active", true)
      .order("name")
      .range(from, from + 999);
    if (error) throw error;
    all.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  const out = all
    .filter((p) => p.slug)
    .map((p) => {
      const c = byId[p.category_id];
      const parent = c?.parent_id ? byId[c.parent_id] : null;
      const root = parent?.parent_id ? byId[parent.parent_id] : parent;
      return {
        slug: p.slug,
        name: p.name,
        description: p.description || null,
        rrp: p.rrp ?? null,
        categoryName: c?.name ?? null,
        categorySlug: c?.slug ?? null,
        parentName: parent?.name ?? null,
        parentSlug: parent?.slug ?? null,
        rootSlug: root?.slug ?? null,
        rootName: root?.name ?? null,
      };
    });

  writeFileSync(
    resolve(process.cwd(), "src/content/products-snapshot.json"),
    JSON.stringify(out)
  );
  console.log(`[snapshot] Сохранено ${out.length} товаров → src/content/products-snapshot.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
