// Migrate product_images rows whose `url` still points at core.brandoors.ru
// into our own Supabase Storage bucket, then rewrite the row's url.
//
// Idempotent: only processes rows where url LIKE '%core.brandoors.ru%'.
// Batched: ?batch=100 (default 50), call repeatedly until migrated=0.
//
// Usage:
//   POST /migrate-external-images
//   POST /migrate-external-images?batch=200
//   POST /migrate-external-images?dryRun=1

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const BUCKET = "product-images";
const PREFIX = "migrated";
const SOURCE_HOST = "core.brandoors.ru";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
  );

  const url = new URL(req.url);
  const batch = Math.min(Number(url.searchParams.get("batch") ?? "50"), 500);
  const dryRun = url.searchParams.get("dryRun") === "1";

  const { data: rows, error: selErr } = await supabase
    .from("product_images")
    .select("id, product_id, url")
    .ilike("url", `%${SOURCE_HOST}%`)
    .limit(batch);

  if (selErr) {
    return new Response(JSON.stringify({ error: selErr.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  const { count: remainingBefore } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .ilike("url", `%${SOURCE_HOST}%`);

  let migrated = 0;
  let failed = 0;
  const errors: Array<{ id: string; error: string }> = [];

  for (const row of rows ?? []) {
    try {
      const src = String(row.url);
      const u = new URL(src);
      // Path like /uploads/image/230/file.webp -> keep tail.
      const parts = u.pathname.split("/").filter(Boolean);
      const filename = parts.slice(-2).join("-") || parts.slice(-1)[0] || `${row.id}.bin`;
      const storagePath = `${PREFIX}/${row.product_id}/${row.id}-${filename}`;

      if (dryRun) {
        migrated++;
        continue;
      }

      const res = await fetch(src);
      if (!res.ok) throw new Error(`fetch ${res.status}`);
      const buf = new Uint8Array(await res.arrayBuffer());
      const ct = res.headers.get("content-type") || "image/webp";

      const { error: upErr } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, buf, { contentType: ct, upsert: true });
      if (upErr) throw upErr;

      const { data: pub } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);

      const { error: updErr } = await supabase
        .from("product_images")
        .update({ url: pub.publicUrl })
        .eq("id", row.id);
      if (updErr) throw updErr;

      migrated++;
    } catch (e) {
      failed++;
      errors.push({ id: String(row.id), error: e instanceof Error ? e.message : String(e) });
    }
  }

  const { count: remainingAfter } = await supabase
    .from("product_images")
    .select("id", { count: "exact", head: true })
    .ilike("url", `%${SOURCE_HOST}%`);

  return new Response(
    JSON.stringify({
      dryRun,
      batch,
      processed: rows?.length ?? 0,
      migrated,
      failed,
      remaining_before: remainingBefore,
      remaining_after: remainingAfter,
      errors: errors.slice(0, 20),
    }, null, 2),
    { headers: { ...corsHeaders, "Content-Type": "application/json" } },
  );
});
