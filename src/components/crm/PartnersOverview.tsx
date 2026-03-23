import { MapPin, ArrowUpRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function PartnersOverview() {
  const { data: partners = [] } = useQuery({
    queryKey: ["partners-overview"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("id, name, district, is_active, leads(count)")
        .order("created_at", { ascending: false })
        .limit(6);
      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        name: p.name,
        zone: p.district || "—",
        leads: p.leads?.[0]?.count ?? 0,
        active: p.is_active ?? true,
      }));
    },
  });

  if (partners.length === 0) {
    return (
      <div className="rounded-2xl border border-border bg-card opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
        <div className="flex items-center justify-between border-b border-border px-5 py-4">
          <h3 className="text-sm font-semibold text-foreground">Партнёры</h3>
        </div>
        <div className="px-5 py-8 text-center text-sm text-muted-foreground">Партнёры пока не добавлены</div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-border bg-card opacity-0 animate-fade-up" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Партнёры</h3>
        <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          Все
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
      <div className="divide-y divide-border">
        {partners.map((p, i) => (
          <div key={i} className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-muted/40">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-muted">
              <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
              <p className="text-xs text-muted-foreground">{p.zone}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-foreground">{p.leads}</p>
              <p className="text-[11px] text-muted-foreground">заявок</p>
            </div>
            <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${p.active ? "bg-success" : "bg-muted-foreground/30"}`} />
          </div>
        ))}
      </div>
    </div>
  );
}
