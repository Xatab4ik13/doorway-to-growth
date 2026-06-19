// Temporary admin SQL runner for batch data migration.
// Will be deleted after collection imports complete.
import { Client } from "https://deno.land/x/postgres@v0.19.3/mod.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

const ADMIN_TOKEN = "brand_admin_2026_heavy_collection_import_qX9pLm3K";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  try {
    const { sql, token } = await req.json();
    if (token !== ADMIN_TOKEN) {
      return new Response(JSON.stringify({ error: "forbidden" }), { status: 403, headers: corsHeaders });
    }
    const dbUrl = Deno.env.get("SUPABASE_DB_URL")!;
    const client = new Client(dbUrl);
    await client.connect();
    try {
      await client.queryArray(sql);
    } finally {
      await client.end();
    }
    return new Response(JSON.stringify({ ok: true }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
