// Pulls full SKU set for each product from brandoors.ru GraphQL,
// downloads variant images into our Storage and inserts missing rows
// into product_images so the storefront configurator can switch the picture
// for every color × edge × glazing × molding combination.
//
// Idempotent: skips SKUs whose source image is already present in product_images
// (by exact source URL match) or whose (product_id, axes) tuple already exists.
//
// Usage:
//   POST /sync-brandoors-skus            -> processes ALL products
//   POST /sync-brandoors-skus?name=HEAVY -> only products whose name starts with HEAVY
//   POST /sync-brandoors-skus?limit=5    -> stop after N products (debug)
//   POST /sync-brandoors-skus?dryRun=1   -> compute but don't upload/insert

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRAPHQL = "https://core.brandoors.ru/graphql";
const SOURCE_HOST = "core.brandoors.ru";
const BUCKET = "product-images";
const PREFIX = "doors-skus";

// Maps brandoors property.slug → our product_images axis column.
const SLUG_TO_AXIS: Record<string, "variant_key" | "edge_key" | "glazing_key" | "molding_key"> = {
  color: "variant_key",
  edge: "edge_key",
  glass: "glazing_key",
  panelouter: "glazing_key",
  casing: "molding_key",
  panel: "molding_key",
};

type Sku = {
  id: number;
  name: string;
  image: { path: string } | null;
  propertyValues: Array<{ id: number; name: string; property: { slug: string; name: string } }>;
};

async function fetchAllSkus(productName: string): Promise<Sku[]> {
  const all: Sku[] = [];
  const LIMIT = 100;
  for (let offset = 0; ; offset += LIMIT) {
    const body = {
      query: `query($limit:Int!,$offset:Int!,$name:String!){
        productSKUS(
          paging:{limit:$limit,offset:$offset},
          filter:{product:{name:{eq:$name}}},
          sorting:[]
        ){ nodes { id name image{ path } propertyValues{ id name property{ slug name } } } }
      }`,
      variables: { limit: LIMIT, offset, name: productName },
    };
    const r = await fetch(GRAPHQL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    if (!r.ok) throw new Error(`graphql ${r.status} for ${productName}`);
    const j = await r.json();
    if (j.errors) throw new Error(`graphql err: ${JSON.stringify(j.errors)}`);
    const nodes = j.data?.productSKUS?.nodes ?? [];
    all.push(...nodes);
    if (nodes.length < LIMIT) break;
  }
  return all;
}

function skuToAxes(sku: Sku): Record<string, string | null> {
  const axes: Record<string, string | null> = {
    variant_key: null,
    edge_key: null,
    glazing_key: null,
    molding_key: null,
  };
  for (const pv of sku.propertyValues ?? []) {
    const col = SLUG_TO_AXIS[pv.property?.slug];
    if (col && pv.name) axes[col] = pv.name;
  }
  return axes;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const namePrefix = url.searchParams.get("name") ?? "";
  const productLimit = Number(url.searchParams.get("limit") ?? "1000");
  const dryRun = url.searchParams.get("dryRun") === "1";

  // Pull our products (only door collections).
  let q = supabase
    .from("products")
    .select("id, name")
    .or(
      "name.ilike.ESTETICA%,name.ilike.HEAVY%,name.ilike.PRIME%,name.ilike.GHOST%,name.ilike.MAZE%,name.ilike.REFLECT%",
    )
    .order("name");
  if (namePrefix) q = q.ilike("name", `${namePrefix}%`);
  const { data: products, error: prodErr } = await q.limit(productLimit);
  if (prodErr) {
    return new Response(JSON.stringify({ error: prodErr.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const report: Array<{
    product: string;
    skus: number;
    inserted: number;
    skipped_existing: number;
    skipped_no_image: number;
    failed: number;
  }> = [];

  for (const p of products ?? []) {
    const row = {
      product: p.name as string,
      skus: 0,
      inserted: 0,
      skipped_existing: 0,
      skipped_no_image: 0,
      failed: 0,
    };
    try {
      const skus = await fetchAllSkus(p.name as string);
      row.skus = skus.length;

      // Existing rows for this product: build dedup keys.
      const { data: existing } = await supabase
        .from("product_images")
        .select("url, variant_key, edge_key, glazing_key, molding_key")
        .eq("product_id", p.id);
      const existingUrls = new Set((existing ?? []).map((e: any) => String(e.url)));
      const existingTuples = new Set(
        (existing ?? []).map((e: any) =>
          [e.variant_key, e.edge_key, e.glazing_key, e.molding_key].map((v) => v ?? "").join("|"),
        ),
      );

      // Find current max sort_order so new rows append cleanly.
      let nextSort = (existing ?? []).reduce((m: number, e: any) => Math.max(m, e.sort_order ?? 0), 0) + 1;

      for (const sku of skus) {
        if (!sku.image?.path) { row.skipped_no_image++; continue; }
        const axes = skuToAxes(sku);
        const tupleKey = [axes.variant_key, axes.edge_key, axes.glazing_key, axes.molding_key]
          .map((v) => v ?? "").join("|");
        const sourceUrl = `https://${SOURCE_HOST}/${sku.image.path.replace(/^\/+/, "")}`;

        if (existingUrls.has(sourceUrl) || existingTuples.has(tupleKey)) {
          row.skipped_existing++;
          continue;
        }

        if (dryRun) {
          row.inserted++;
          existingTuples.add(tupleKey);
          continue;
        }

        // Download.
        const res = await fetch(sourceUrl);
        if (!res.ok) { row.failed++; continue; }
        const buf = new Uint8Array(await res.arrayBuffer());
        const ct = res.headers.get("content-type") || "image/webp";

        // Upload to Storage (path keeps original filename for traceability).
        const parts = sku.image.path.split("/").filter(Boolean);
        const filename = parts.slice(-2).join("-");
        const storagePath = `${PREFIX}/${p.id}/${sku.id}-${filename}`;
        const { error: upErr } = await supabase.storage
          .from(BUCKET)
          .upload(storagePath, buf, { contentType: ct, upsert: true });
        if (upErr) { row.failed++; continue; }
        const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

        const { error: insErr } = await supabase.from("product_images").insert({
          product_id: p.id,
          url: pub.publicUrl,
          is_primary: false,
          sort_order: nextSort++,
          alt: sku.name,
          variant_key: axes.variant_key,
          edge_key: axes.edge_key,
          glazing_key: axes.glazing_key,
          molding_key: axes.molding_key,
        });
        if (insErr) { row.failed++; continue; }
        existingTuples.add(tupleKey);
        existingUrls.add(sourceUrl);
        row.inserted++;
      }
    } catch (e) {
      row.failed++;
      console.error(`product ${p.name}: ${e instanceof Error ? e.message : e}`);
    }
    report.push(row);
  }

  return new Response(
    JSON.stringify({
      dryRun,
      products: report.length,
      totals: {
        inserted: report.reduce((s, r) => s + r.inserted, 0),
        skipped_existing: report.reduce((s, r) => s + r.skipped_existing, 0),
        skipped_no_image: report.reduce((s, r) => s + r.skipped_no_image, 0),
        failed: report.reduce((s, r) => s + r.failed, 0),
      },
      report,
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
