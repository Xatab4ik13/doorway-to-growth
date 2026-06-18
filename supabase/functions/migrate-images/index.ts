// Edge function: загружает картинки с внешних URL в bucket product-images
// и возвращает маппинг { sourceUrl -> publicUrl }.
// Защищено: вызывать может только пользователь с ролью admin.

import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

interface ImageJob {
  url: string;     // source URL on brandoors CDN
  path: string;    // target path in bucket, e.g. "prime/prime-25/alyaska__milk.webp"
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
    const SERVICE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY")!;

    // Auth check — only admin role
    const authHeader = req.headers.get("Authorization") ?? "";
    const userClient = createClient(SUPABASE_URL, ANON_KEY, {
      global: { headers: { Authorization: authHeader } },
    });
    const { data: { user } } = await userClient.auth.getUser();
    if (!user) return json({ error: "unauthorized" }, 401);

    const { data: isAdmin } = await userClient.rpc("has_role", {
      _user_id: user.id, _role: "admin",
    });
    if (!isAdmin) return json({ error: "forbidden" }, 403);

    const body = await req.json();
    const jobs: ImageJob[] = body.images ?? [];
    if (!Array.isArray(jobs) || jobs.length === 0)
      return json({ error: "no images" }, 400);
    if (jobs.length > 50) return json({ error: "max 50 per batch" }, 400);

    const admin = createClient(SUPABASE_URL, SERVICE_KEY);
    const results: { source: string; public_url?: string; error?: string }[] = [];

    for (const job of jobs) {
      try {
        const resp = await fetch(job.url);
        if (!resp.ok) {
          results.push({ source: job.url, error: `fetch ${resp.status}` });
          continue;
        }
        const buf = new Uint8Array(await resp.arrayBuffer());
        const contentType = resp.headers.get("content-type") ?? "image/webp";

        const { error: upErr } = await admin.storage
          .from("product-images")
          .upload(job.path, buf, { contentType, upsert: true });
        if (upErr) {
          results.push({ source: job.url, error: upErr.message });
          continue;
        }
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
