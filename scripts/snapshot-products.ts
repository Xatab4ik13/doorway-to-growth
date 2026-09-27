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
      .select("slug,name,description,rrp,category_id,specifications")
      .eq("is_active", true)
      .order("name")
      .range(from, from + 999);
    if (error) throw error;
    all.push(...(data ?? []));
    if (!data || data.length < 1000) break;
  }

  // Краткая выжимка реальных характеристик из JSONB — для уникального текста карточек.
  const specsOf = (s: any) => {
    if (!s || typeof s !== "object") return null;
    const uniq = (a: unknown) =>
      Array.isArray(a) ? [...new Set(a.map((x) => String(x).replace(/\s+/g, " ").trim()).filter(Boolean))] : [];
    const nums = (a: unknown) => (Array.isArray(a) ? a.map(Number).filter((n) => n > 0) : []);
    const range = (a: number[]) => (a.length ? [Math.min(...a), Math.max(...a)] : null);
    const ch = s.characteristics && typeof s.characteristics === "object" ? s.characteristics : {};
    const out = {
      type: ch.type ?? null,
      material: ch.material ?? null,
      finishing: ch.finishing ?? null,
      thickness: ch.thickness ?? (s.size?.thickness ? `${s.size.thickness} мм` : null),
      colors: uniq(s.axes?.color?.values?.length ? s.axes.color.values : s.colors).slice(0, 12),
      edges: uniq(s.axes?.edge?.values),
      glass: uniq(s.axes?.glass?.values),
      widths: range(nums(s.widths)),
      heights: range(nums(s.heights)),
      size: s.size?.width && s.size?.height ? [Number(s.size.width), Number(s.size.height)] : null,
      skuColors: uniq((s.skus ?? []).map((k: any) => k?.color)).slice(0, 12),
    };
    return out;
  };

  const out = all
    .filter((p) => p.slug)
    .map((p) => {
      const c = byId[p.category_id];
      const parent = c?.parent_id ? byId[c.parent_id] : null;
      const root = parent?.parent_id ? byId[parent.parent_id] : parent;
      const rootSlug = root?.slug ?? null;
      const isDoor = ["mezhkomnatnye-dveri", "entrance-doors"].includes(rootSlug || c?.slug || "");
      return {
        slug: p.slug,
        name: p.name,
        description: p.description || null,
        rrp: p.rrp ?? null,
        categoryName: c?.name ?? null,
        categorySlug: c?.slug ?? null,
        parentName: parent?.name ?? null,
        parentSlug: parent?.slug ?? null,
        rootSlug,
        rootName: root?.name ?? null,
        ...(isDoor ? { specs: specsOf(p.specifications) } : {}),
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
