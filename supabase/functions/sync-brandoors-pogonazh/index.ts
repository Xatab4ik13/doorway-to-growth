// Imports all "погонаж" products (наличники, плинтус, короб, добор,
// притворная планка) from brandoors.ru GraphQL into our products /
// product_images tables. Each variant SKU contributes a per-color image
// (variant_key = color slug) and feeds the product specifications JSONB.
//
// Idempotent: products are upserted on source_id; images are de-duplicated by
// source URL and (variant_key) tuple.
//
// Usage:
//   POST /sync-brandoors-pogonazh                  -> all 5 subcategories
//   POST /sync-brandoors-pogonazh?subcat=nalichniki
//   POST /sync-brandoors-pogonazh?limit=10          -> debug: cap products
//   POST /sync-brandoors-pogonazh?dryRun=1

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRAPHQL = "https://core.brandoors.ru/graphql";
const SOURCE_HOST = "core.brandoors.ru";
const BUCKET = "product-images";
const PREFIX = "pogonazh";

// Our local "Погонаж" category UUID (parent).
const POGONAZH_CATEGORY_ID = "a0000001-0000-0000-0000-000000000003";

// brandoors source category id -> our subcategory slug
const SUBCATS: Record<number, { slug: string; name: string }> = {
  1: { slug: "korob", name: "Короб" },
  2: { slug: "nalichniki", name: "Наличники" },
  3: { slug: "dobor", name: "Добор" },
  4: { slug: "plintus", name: "Плинтус" },
  5: { slug: "pritvornaya-planka", name: "Притворная планка" },
};

type SrcProduct = {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  categoryId: number;
  image: { path: string } | null;
};

type SrcSku = {
  id: number;
  name: string;
  price: number;
  basePrice: number;
  image: { path: string } | null;
  propertyValues: Array<{ name: string; property: { slug: string; name: string } }>;
};

async function gql<T>(query: string, variables: Record<string, unknown>): Promise<T> {
  const r = await fetch(GRAPHQL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ query, variables }),
  });
  if (!r.ok) throw new Error(`graphql http ${r.status}`);
  const j = await r.json();
  if (j.errors) throw new Error(`graphql err: ${JSON.stringify(j.errors)}`);
  return j.data as T;
}

async function fetchProducts(categoryIds: number[]): Promise<SrcProduct[]> {
  const out: SrcProduct[] = [];
  const LIMIT = 50;
  for (let offset = 0; ; offset += LIMIT) {
    const data = await gql<{ products: { nodes: SrcProduct[] } }>(
      `query($limit:Int!,$offset:Int!,$ids:[Int!]!){
         products(paging:{limit:$limit,offset:$offset},
                  filter:{categoryId:{in:$ids}}, sorting:[]) {
           nodes { id name slug description categoryId image { path } }
         }
       }`,
      { limit: LIMIT, offset, ids: categoryIds },
    );
    const nodes = data.products.nodes;
    out.push(...nodes);
    if (nodes.length < LIMIT) break;
  }
  return out;
}

async function fetchSkus(productId: number): Promise<SrcSku[]> {
  const data = await gql<{ productSKUS: { nodes: SrcSku[] } }>(
    `query($pid:Int!){
       productSKUS(paging:{limit:50},
                   filter:{productId:{eq:$pid}, unpublished:{is:false}},
                   sorting:[]) {
         nodes { id name price basePrice image { path }
                 propertyValues { name property { slug name } } }
       }
     }`,
    { pid: productId },
  );
  return data.productSKUS.nodes;
}

function slugifyColor(s: string): string {
  return s.trim().toLowerCase().replace(/\s+/g, "-").replace(/[^\p{L}\p{N}-]/gu, "");
}

function pickColor(sku: SrcSku): string | null {
  for (const pv of sku.propertyValues ?? []) {
    if (pv.property?.slug === "color") return pv.name;
  }
  return null;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const subcatFilter = url.searchParams.get("subcat");
  const productLimit = Number(url.searchParams.get("limit") ?? "1000");
  const dryRun = url.searchParams.get("dryRun") === "1";

  const wantedSrcIds = Object.entries(SUBCATS)
    .filter(([, v]) => !subcatFilter || v.slug === subcatFilter)
    .map(([k]) => Number(k));

  const products = (await fetchProducts(wantedSrcIds)).slice(0, productLimit);

  const report: Array<{
    src_id: number;
    name: string;
    subcat: string;
    skus: number;
    images_inserted: number;
    images_skipped: number;
    product_action: "inserted" | "updated" | "dry";
    error?: string;
  }> = [];

  for (const p of products) {
    const sub = SUBCATS[p.categoryId];
    const row = {
      src_id: p.id,
      name: p.name,
      subcat: sub?.slug ?? "?",
      skus: 0,
      images_inserted: 0,
      images_skipped: 0,
      product_action: dryRun ? "dry" as const : "updated" as const,
    };
    try {
      const skus = await fetchSkus(p.id);
      row.skus = skus.length;

      // Aggregate colors / prices / sizes.
      const colors: Array<{ name: string; key: string; price: number }> = [];
      const seenColors = new Set<string>();
      let minPrice = Infinity;
      for (const s of skus) {
        if (s.price && s.price < minPrice) minPrice = s.price;
        const c = pickColor(s);
        if (c && !seenColors.has(c)) {
          seenColors.add(c);
          colors.push({ name: c, key: slugifyColor(c), price: s.price });
        }
      }
      if (!isFinite(minPrice)) minPrice = 0;

      const sourceId = `brandoors-pog-${p.id}`;
      const specifications = {
        subcategory: sub?.slug ?? null,
        subcategory_name: sub?.name ?? null,
        colors,
        source: { id: p.id, slug: p.slug, category_id: p.categoryId },
      };

      let productId: string | null = null;
      if (dryRun) {
        productId = null;
      } else {
        // Upsert product by source_id.
        const { data: existing, error: selErr } = await supabase
          .from("products")
          .select("id")
          .eq("source_id", sourceId)
          .maybeSingle();
        if (selErr) throw selErr;

        if (existing?.id) {
          productId = existing.id as string;
          const { error: updErr } = await supabase
            .from("products")
            .update({
              name: p.name,
              description: p.description ?? null,
              category_id: POGONAZH_CATEGORY_ID,
              rrp: minPrice || null,
              specifications,
              is_active: true,
            })
            .eq("id", productId);
          if (updErr) throw updErr;
          row.product_action = "updated";
        } else {
          // Ensure slug uniqueness by suffixing with src id if needed.
          const slug = `pog-${p.slug}`.slice(0, 200);
          const { data: ins, error: insErr } = await supabase
            .from("products")
            .insert({
              source_id: sourceId,
              slug,
              name: p.name,
              description: p.description ?? null,
              category_id: POGONAZH_CATEGORY_ID,
              rrp: minPrice || null,
              specifications,
              is_active: true,
            })
            .select("id")
            .single();
          if (insErr) throw insErr;
          productId = ins.id as string;
          row.product_action = "inserted";
        }
      }

      // ---- Images ----
      // Main product image (variant_key = null, is_primary = true).
      const imagesToUpload: Array<{
        path: string;
        variant_key: string | null;
        is_primary: boolean;
        alt: string;
      }> = [];
      if (p.image?.path) {
        imagesToUpload.push({
          path: p.image.path,
          variant_key: null,
          is_primary: true,
          alt: p.name,
        });
      }
      for (const s of skus) {
        if (!s.image?.path) continue;
        const c = pickColor(s);
        imagesToUpload.push({
          path: s.image.path,
          variant_key: c ? slugifyColor(c) : null,
          is_primary: false,
          alt: s.name,
        });
      }

      if (!productId) {
        row.images_skipped = imagesToUpload.length;
      } else {
        // Existing images for dedup.
        const { data: existingImgs } = await supabase
          .from("product_images")
          .select("url, variant_key, sort_order")
          .eq("product_id", productId);
        const existingUrls = new Set((existingImgs ?? []).map((e: any) => String(e.url)));
        const existingKeys = new Set(
          (existingImgs ?? []).map((e: any) => `${e.variant_key ?? ""}`),
        );
        let nextSort =
          (existingImgs ?? []).reduce((m: number, e: any) => Math.max(m, e.sort_order ?? 0), 0) + 1;

        for (const img of imagesToUpload) {
          const sourceUrl = `https://${SOURCE_HOST}/${img.path.replace(/^\/+/, "")}`;
          const key = `${img.variant_key ?? ""}`;
          if (existingUrls.has(sourceUrl) || existingKeys.has(key)) {
            row.images_skipped++;
            continue;
          }
          if (dryRun) { row.images_inserted++; existingKeys.add(key); continue; }

          const res = await fetch(sourceUrl);
          if (!res.ok) { row.images_skipped++; continue; }
          const buf = new Uint8Array(await res.arrayBuffer());
          const ct = res.headers.get("content-type") || "image/webp";

          const parts = img.path.split("/").filter(Boolean);
          const filename = parts.slice(-2).join("-");
          const storagePath = `${PREFIX}/${productId}/${img.variant_key ?? "main"}-${filename}`;
          const { error: upErr } = await supabase.storage
            .from(BUCKET)
            .upload(storagePath, buf, { contentType: ct, upsert: true });
          if (upErr) { row.images_skipped++; continue; }
          const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

          const { error: imgInsErr } = await supabase.from("product_images").insert({
            product_id: productId,
            url: pub.publicUrl,
            is_primary: img.is_primary,
            sort_order: nextSort++,
            alt: img.alt,
            variant_key: img.variant_key,
          });
          if (imgInsErr) { row.images_skipped++; continue; }
          existingUrls.add(sourceUrl);
          existingKeys.add(key);
          row.images_inserted++;
        }
      }
    } catch (e) {
      row.error = e instanceof Error ? e.message : String(e);
    }
    report.push(row);
  }

  return new Response(
    JSON.stringify({
      dryRun,
      subcat: subcatFilter ?? "all",
      products: report.length,
      totals: {
        inserted: report.filter((r) => r.product_action === "inserted").length,
        updated: report.filter((r) => r.product_action === "updated").length,
        images_inserted: report.reduce((s, r) => s + r.images_inserted, 0),
        images_skipped: report.reduce((s, r) => s + r.images_skipped, 0),
        errors: report.filter((r) => r.error).length,
      },
      report,
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
