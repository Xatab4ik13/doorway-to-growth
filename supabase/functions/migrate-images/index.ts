// One-shot migration: загружает картинки с внешних URL в bucket product-images.
// Без auth (одноразовая операция от админа через psql после миграции function можно удалить).

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const { images } = await req.json();
    if (!Array.isArray(images) || images.length === 0)
      return json({ error: "no images" }, 400);
    if (images.length > 50) return json({ error: "max 50 per batch" }, 400);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const results: { source: string; public_url?: string; error?: string }[] = [];

    for (const job of images) {
      try {
        const resp = await fetch(job.url);
        if (!resp.ok) { results.push({ source: job.url, error: `fetch ${resp.status}` }); continue; }
        const buf = new Uint8Array(await resp.arrayBuffer());
        const contentType = resp.headers.get("content-type") ?? "image/webp";

        const { error: upErr } = await admin.storage
          .from("product-images")
          .upload(job.path, buf, { contentType, upsert: true });
        if (upErr) { results.push({ source: job.url, error: upErr.message }); continue; }

        const { data: pub } = admin.storage.from("product-images").getPublicUrl(job.path);
        results.push({ source: job.url, public_url: pub.publicUrl });
      } catch (e) {
        results.push({ source: job.url, error: String(e) });
      }
    }
    return json({ results });
  } catch (e) {
    return json({ error: String(e) }, 500);
  }
});

function json(obj: unknown, status = 200) {
  return new Response(JSON.stringify(obj), {
    status,
    headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
}
