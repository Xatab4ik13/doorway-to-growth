import { useMemo, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { Loader2, RefreshCw, ImageOff, CheckCircle2, AlertCircle } from "lucide-react";
import { resolveStorageUrl } from "@/lib/storageUrl";

const COLLECTIONS = ["HEAVY", "ESTETICA", "GHOST", "PRIME", "REFLECT", "MAZE"];

type StagingRow = {
  id: string;
  product_id: string | null;
  product_name: string;
  sku_source_id: number | null;
  sku_source_name: string | null;
  image_source_url: string | null;
  color_name: string | null;
  edge_name: string | null;
  glazing_name: string | null;
  molding_name: string | null;
  status: string;
  matched_image_id: string | null;
};

type OrphanRow = {
  id: string;
  product_id: string;
  product_name: string;
  url: string;
  variant_key: string | null;
  edge_key: string | null;
  glazing_key: string | null;
  molding_key: string | null;
  is_stale: boolean;
};

export function VariantAuditPage() {
  const qc = useQueryClient();
  const [collection, setCollection] = useState("HEAVY");
  const [running, setRunning] = useState(false);

  const { data: staging = [], isLoading } = useQuery({
    queryKey: ["variant-staging", collection],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_variants_staging")
        .select("*")
        .ilike("product_name", `${collection}%`)
        .order("product_name")
        .order("sku_source_id");
      if (error) throw error;
      return (data ?? []) as StagingRow[];
    },
  });

  const { data: orphans = [] } = useQuery({
    queryKey: ["variant-orphans", collection],
    queryFn: async () => {
      const { data: products } = await supabase
        .from("products")
        .select("id, name")
        .ilike("name", `${collection}%`);
      const ids = (products ?? []).map((p: any) => p.id);
      if (!ids.length) return [] as OrphanRow[];
      const { data: imgs, error } = await supabase
        .from("product_images")
        .select("id, product_id, url, variant_key, edge_key, glazing_key, molding_key, is_stale")
        .in("product_id", ids)
        .order("product_id");
      if (error) throw error;
      const stagingUrls = new Set(
        (staging ?? []).map((s) => s.image_source_url).filter(Boolean) as string[],
      );
      const byId = new Map(products?.map((p: any) => [p.id, p.name]));
      return (imgs ?? [])
        .filter((i: any) => !stagingUrls.has(i.url))
        .map((i: any) => ({ ...i, product_name: byId.get(i.product_id) ?? "" })) as OrphanRow[];
    },
    enabled: staging.length >= 0,
  });

  const runAudit = async (reset: boolean) => {
    setRunning(true);
    try {
      const { data, error } = await supabase.functions.invoke("audit-brandoors-variants", {
        method: "POST",
        body: null,
        headers: {},
      } as any);
      // Fallback: use direct fetch with query params since invoke doesn't do query strings well
      const url = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/audit-brandoors-variants?name=${encodeURIComponent(collection)}${reset ? "&reset=1" : ""}`;
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch(url, {
        method: "POST",
        headers: {
          apikey: import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY,
          Authorization: `Bearer ${session?.access_token ?? import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY}`,
        },
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "audit failed");
      toast({
        title: "Аудит завершён",
        description: `SKU: ${json.totals?.skus ?? 0}, новых: ${json.totals?.inserted_new ?? 0}, совпало: ${json.totals?.inserted_matched ?? 0}`,
      });
      qc.invalidateQueries({ queryKey: ["variant-staging"] });
      qc.invalidateQueries({ queryKey: ["variant-orphans"] });
    } catch (e: any) {
      toast({ title: "Ошибка аудита", description: e.message, variant: "destructive" });
    } finally {
      setRunning(false);
    }
  };

  const markStaleMut = useMutation({
    mutationFn: async (ids: string[]) => {
      const { error } = await supabase
        .from("product_images")
        .update({ is_stale: true })
        .in("id", ids);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["variant-orphans"] });
      toast({ title: "Помечено как устаревшее" });
    },
    onError: (e: any) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  const grouped = useMemo(() => {
    const map = new Map<string, StagingRow[]>();
    for (const r of staging) {
      if (!map.has(r.product_name)) map.set(r.product_name, []);
      map.get(r.product_name)!.push(r);
    }
    return Array.from(map.entries()).sort(([a], [b]) => a.localeCompare(b));
  }, [staging]);

  const summary = useMemo(() => {
    return {
      total: staging.length,
      newCount: staging.filter((s) => s.status === "new").length,
      matched: staging.filter((s) => s.status === "matched").length,
      imported: staging.filter((s) => s.status === "imported").length,
      orphans: orphans.length,
    };
  }, [staging, orphans]);

  return (
    <div className="mx-auto max-w-[1400px] p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Аудит вариантов</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Сверка SKU каталога с эталоном brandoors.ru
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select
            value={collection}
            onChange={(e) => setCollection(e.target.value)}
            className="h-9 rounded-lg border border-border bg-background px-3 text-sm"
          >
            {COLLECTIONS.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
          <Button variant="outline" onClick={() => runAudit(false)} disabled={running}>
            {running ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <RefreshCw className="h-4 w-4 mr-2" />}
            Запустить аудит
          </Button>
          <Button variant="destructive" onClick={() => runAudit(true)} disabled={running}>
            С reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <StatCell label="Всего SKU" value={summary.total} />
        <StatCell label="Новых" value={summary.newCount} accent="new" />
        <StatCell label="Совпало" value={summary.matched} accent="matched" />
        <StatCell label="Импортировано" value={summary.imported} accent="imported" />
        <StatCell label="Orphan-фото" value={summary.orphans} accent="orphan" />
      </div>

      {isLoading && <div className="text-muted-foreground text-sm">Загрузка…</div>}

      {grouped.map(([productName, rows]) => (
        <div key={productName} className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <h3 className="font-medium">{productName}</h3>
            <div className="text-xs text-muted-foreground">
              SKU: {rows.length} · новых: {rows.filter((r) => r.status === "new").length} · совпало:{" "}
              {rows.filter((r) => r.status === "matched").length}
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-muted/40">
                <tr className="text-left text-xs text-muted-foreground">
                  <th className="px-3 py-2 w-16">Фото</th>
                  <th className="px-3 py-2">Цвет</th>
                  <th className="px-3 py-2">Кромка</th>
                  <th className="px-3 py-2">Стекло</th>
                  <th className="px-3 py-2">Молдинг</th>
                  <th className="px-3 py-2">Статус</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-border">
                    <td className="px-3 py-2">
                      {r.image_source_url ? (
                        <img
                          src={r.image_source_url}
                          alt=""
                          className="h-12 w-12 object-contain rounded bg-muted"
                          loading="lazy"
                        />
                      ) : (
                        <div className="h-12 w-12 rounded bg-muted flex items-center justify-center">
                          <ImageOff className="h-4 w-4 text-muted-foreground" />
                        </div>
                      )}
                    </td>
                    <td className="px-3 py-2">{r.color_name ?? "—"}</td>
                    <td className="px-3 py-2">{r.edge_name ?? "—"}</td>
                    <td className="px-3 py-2">{r.glazing_name ?? "—"}</td>
                    <td className="px-3 py-2">{r.molding_name ?? "—"}</td>
                    <td className="px-3 py-2">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      {orphans.length > 0 && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b border-border">
            <div>
              <h3 className="font-medium flex items-center gap-2">
                <AlertCircle className="h-4 w-4 text-amber-500" />
                Orphan-фото ({orphans.length})
              </h3>
              <p className="text-xs text-muted-foreground mt-0.5">
                Фото в нашей БД, у которых нет соответствующего SKU на эталоне
              </p>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => markStaleMut.mutate(orphans.filter((o) => !o.is_stale).map((o) => o.id))}
              disabled={markStaleMut.isPending || orphans.every((o) => o.is_stale)}
            >
              Пометить все как устаревшие
            </Button>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3 p-4">
            {orphans.map((o) => (
              <div key={o.id} className={`rounded-lg border ${o.is_stale ? "border-amber-500/40 bg-amber-500/5" : "border-border"} p-2 text-xs`}>
                <img
                  src={resolveStorageUrl(o.url) ?? undefined}
                  alt=""
                  className="h-24 w-full object-contain rounded bg-muted mb-2"
                  loading="lazy"
                />
                <div className="font-medium truncate">{o.product_name}</div>
                <div className="text-muted-foreground truncate">
                  {[o.variant_key, o.edge_key, o.glazing_key, o.molding_key].filter(Boolean).join(" · ") || "—"}
                </div>
                {o.is_stale && <div className="mt-1 text-amber-600">Устаревшее</div>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function StatCell({ label, value, accent }: { label: string; value: number; accent?: string }) {
  const color =
    accent === "new" ? "text-blue-600" :
    accent === "matched" ? "text-emerald-600" :
    accent === "imported" ? "text-violet-600" :
    accent === "orphan" ? "text-amber-600" : "text-foreground";
  return (
    <div className="rounded-2xl border border-border bg-card px-4 py-3">
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className={`text-2xl font-semibold mt-1 ${color}`}>{value}</div>
    </div>
  );
}

function StatusBadge({ status }: { status: string }) {
  if (status === "matched") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 text-emerald-700 px-2 py-0.5 text-xs">
        <CheckCircle2 className="h-3 w-3" /> Совпало
      </span>
    );
  }
  if (status === "imported") {
    return <span className="rounded-full bg-violet-500/10 text-violet-700 px-2 py-0.5 text-xs">Импортировано</span>;
  }
  if (status === "new") {
    return <span className="rounded-full bg-blue-500/10 text-blue-700 px-2 py-0.5 text-xs">Новое</span>;
  }
  return <span className="rounded-full bg-muted px-2 py-0.5 text-xs">{status}</span>;
}
