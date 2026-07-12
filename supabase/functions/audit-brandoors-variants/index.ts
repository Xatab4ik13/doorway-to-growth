// Reads the full SKU catalogue from brandoors.ru GraphQL for a given
// collection prefix (e.g. HEAVY) and writes one row per SKU into
// public.product_variants_staging. Does NOT touch product_images or storage.
//
// Usage:
//   POST /audit-brandoors-variants?name=HEAVY          (required)
//   POST /audit-brandoors-variants?name=HEAVY&reset=1  (clear prior staging rows for these products)

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const GRAPHQL = "https://core.brandoors.ru/graphql";
const SOURCE_HOST = "core.brandoors.ru";

const SLUG_TO_AXIS: Record<string, "color_name" | "edge_name" | "glazing_name" | "molding_name"> = {
  color: "color_name",
  edge: "edge_name",
  glass: "glazing_name",
  panelouter: "glazing_name",
  casing: "molding_name",
  panel: "molding_name",
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

function skuToAxes(sku: Sku) {
  const axes = { color_name: null, edge_name: null, glazing_name: null, molding_name: null } as
    Record<string, string | null>;
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
  const reset = url.searchParams.get("reset") === "1";

  if (!namePrefix) {
    return new Response(
      JSON.stringify({ error: "?name= is required (e.g. HEAVY)" }),
      { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }

  const { data: products, error: prodErr } = await supabase
    .from("products")
    .select("id, name")
    .ilike("name", `${namePrefix}%`)
    .order("name");
  if (prodErr) {
    return new Response(JSON.stringify({ error: prodErr.message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  if (reset && products?.length) {
    await supabase
      .from("product_variants_staging")
      .delete()
      .in("product_id", products.map((p: any) => p.id))
      .in("status", ["new", "matched"]);
  }

  const report: Array<{
    product: string;
    skus: number;
    inserted_new: number;
    inserted_matched: number;
    already_staged: number;
    skipped_no_image: number;
    failed: number;
  }> = [];

  for (const p of products ?? []) {
    const row = {
      product: p.name as string,
      skus: 0,
      inserted_new: 0,
      inserted_matched: 0,
      already_staged: 0,
      skipped_no_image: 0,
      failed: 0,
    };
    try {
      const skus = await fetchAllSkus(p.name as string);
      row.skus = skus.length;

      // Existing product_images for this product → for source URL match.
      const { data: existingImgs } = await supabase
        .from("product_images")
        .select("id, url")
        .eq("product_id", p.id);
      const urlToImgId = new Map<string, string>();
      for (const img of existingImgs ?? []) urlToImgId.set(String(img.url), img.id as string);

      // Existing staging rows to dedup by sku_source_id.
      const { data: existingStg } = await supabase
        .from("product_variants_staging")
        .select("sku_source_id")
        .eq("product_id", p.id);
      const existingSkuIds = new Set(
        (existingStg ?? []).map((r: any) => Number(r.sku_source_id)).filter((n) => !Number.isNaN(n)),
      );

      const inserts: any[] = [];
      for (const sku of skus) {
        if (existingSkuIds.has(sku.id)) { row.already_staged++; continue; }
        if (!sku.image?.path) { row.skipped_no_image++; continue; }
        const axes = skuToAxes(sku);
        const sourceUrl = `https://${SOURCE_HOST}/${sku.image.path.replace(/^\/+/, "")}`;
        const matched = urlToImgId.get(sourceUrl);
        inserts.push({
          product_id: p.id,
          product_name: p.name,
          sku_source_id: sku.id,
          sku_source_name: sku.name,
          image_source_url: sourceUrl,
          image_source_path: sku.image.path,
          color_name: axes.color_name,
          edge_name: axes.edge_name,
          glazing_name: axes.glazing_name,
          molding_name: axes.molding_name,
          status: matched ? "matched" : "new",
          matched_image_id: matched ?? null,
        });
        if (matched) row.inserted_matched++;
        else row.inserted_new++;
      }
      if (inserts.length) {
        const { error: insErr } = await supabase
          .from("product_variants_staging")
          .insert(inserts);
        if (insErr) { row.failed = inserts.length; row.inserted_new = 0; row.inserted_matched = 0; }
      }
    } catch (e) {
      row.failed = 1;
      console.error(`product ${p.name}:`, e instanceof Error ? e.message : e);
    }
    report.push(row);
  }

  return new Response(
    JSON.stringify({
      products: report.length,
      totals: {
        skus: report.reduce((s, r) => s + r.skus, 0),
        inserted_new: report.reduce((s, r) => s + r.inserted_new, 0),
        inserted_matched: report.reduce((s, r) => s + r.inserted_matched, 0),
        already_staged: report.reduce((s, r) => s + r.already_staged, 0),
        skipped_no_image: report.reduce((s, r) => s + r.skipped_no_image, 0),
        failed: report.reduce((s, r) => s + r.failed, 0),
      },
      report,
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
