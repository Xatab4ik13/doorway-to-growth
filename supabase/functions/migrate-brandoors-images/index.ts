// Migrates all product_images rows whose URL points to core.brandoors.ru
// into our own Supabase Storage bucket `product-images`, then rewrites the
// DB row to use the new public URL. Idempotent: rows already migrated are skipped.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const BUCKET = "product-images";
  const PREFIX = "entrance-doors";
  const SOURCE_HOST = "core.brandoors.ru";

  const url = new URL(req.url);
  const limit = Number(url.searchParams.get("limit") ?? "60");
  const skipSpecs = url.searchParams.get("skipSpecs") === "1";

  // Pull a batch of rows that still point to brandoors CDN.
  const { data: rows, error: selErr } = await supabase
    .from("product_images")
    .select("id, url, product_id")
    .ilike("url", `%${SOURCE_HOST}%`)
    .limit(limit);

  if (selErr) {
    return new Response(JSON.stringify({ error: selErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  let migrated = 0;
  let skipped = 0;
  let failed: { id: string; url: string; reason: string }[] = [];

  for (const row of rows ?? []) {
    try {
      const src = row.url as string;
      // Derive a stable storage path from the source URL.
      // e.g. https://core.brandoors.ru/uploads/image/838/artdeco.webp
      //   -> entrance-doors/838-artdeco.webp
      const u = new URL(src);
      const parts = u.pathname.split("/").filter(Boolean);
      const filename = parts.slice(-2).join("-"); // "838-artdeco.webp"
      const storagePath = `${PREFIX}/${filename}`;

      // Download original.
      const res = await fetch(src);
      if (!res.ok) {
        failed.push({ id: row.id, url: src, reason: `fetch ${res.status}` });
        continue;
      }
      const buf = new Uint8Array(await res.arrayBuffer());
      const contentType = res.headers.get("content-type") || "image/webp";

      // Upload (upsert so reruns are safe).
      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buf, { contentType, upsert: true });
      if (upErr) {
        failed.push({ id: row.id, url: src, reason: `upload: ${upErr.message}` });
        continue;
      }

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      const newUrl = pub.publicUrl;

      const { error: updErr } = await supabase
        .from("product_images")
        .update({ url: newUrl })
        .eq("id", row.id);
      if (updErr) {
        failed.push({ id: row.id, url: src, reason: `db: ${updErr.message}` });
        continue;
      }

      migrated++;
    } catch (e) {
      failed.push({ id: row.id, url: row.url, reason: String(e) });
    }
  }

  // Also rewrite specifications.skus[].image inside products so configurator stops pointing to brandoors.
  const { data: prods } = skipSpecs
    ? { data: [] as any[] }
    : await supabase
        .from("products")
        .select("id, specifications")
        .eq("specifications->>type", "entrance");

  let specsUpdated = 0;
  for (const p of prods ?? []) {
    const s: any = p.specifications;
    if (!Array.isArray(s?.skus)) continue;
    let changed = false;
    for (const sku of s.skus) {
      if (typeof sku.image === "string" && sku.image.includes(SOURCE_HOST)) {
        try {
          const u = new URL(sku.image);
          const parts = u.pathname.split("/").filter(Boolean);
          const filename = parts.slice(-2).join("-");
          const storagePath = `${PREFIX}/${filename}`;
          // Ensure uploaded (idempotent)
          const head = await fetch(sku.image);
          if (head.ok) {
            const buf = new Uint8Array(await head.arrayBuffer());
            await supabase.storage.from("product-images").upload(storagePath, buf, {
              contentType: head.headers.get("content-type") || "image/webp",
              upsert: true,
            });
          }
          const { data: pub } = supabase.storage.from("product-images").getPublicUrl(storagePath);
          sku.image = pub.publicUrl;
          changed = true;
        } catch (_) {/* ignore */}
      }
    }
    if (changed) {
      await supabase.from("products").update({ specifications: s }).eq("id", p.id);
      specsUpdated++;
    }
  }

  return new Response(
    JSON.stringify({
      total: rows?.length ?? 0,
      migrated,
      skipped,
      failed_count: failed.length,
      failed: failed.slice(0, 10),
      specs_updated: specsUpdated,
    }),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
