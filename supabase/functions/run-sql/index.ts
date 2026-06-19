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
    let count = 0;
    try {
      const tx = client.createTransaction("admin_run_sql");
      await tx.begin();
      // Split on lines that are exactly ");" or end with ";" and aren't inside a string.
      // The generator separates statements with "\n" and each statement ends with ";".
      // We split on ";\n" while keeping statements intact (no semicolons inside string literals contain newlines after them in our generated SQL).
      const stmts = sql.split(/;\s*\n/).map((s: string) => s.trim()).filter((s: string) => s.length > 0);
      for (const s of stmts) {
        try {
          await tx.queryArray(s);
        } catch (err) {
          throw new Error(`stmt #${count}: ${String(err)}\n--SQL--\n${s.slice(0, 400)}`);
        }
        count++;
      }
      await tx.commit();
    } finally {
      await client.end();
    }
    return new Response(JSON.stringify({ ok: true, statements: count }), { headers: { ...corsHeaders, "Content-Type": "application/json" } });
  } catch (e) {
    return new Response(JSON.stringify({ error: String(e) }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
});
