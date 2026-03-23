import { FileText, UserPlus, Package } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function ActivityFeed() {
  const { data: activities = [] } = useQuery({
    queryKey: ["activity-feed"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, name, stage, created_at, partners(name), products(name)")
        .order("created_at", { ascending: false })
        .limit(8);
      if (error) throw error;
      return (data ?? []).map((l: any) => ({
        id: l.id,
        text: `${l.stage === "new" ? "Новая заявка" : "Заявка обновлена"}: ${l.name}${l.products?.name ? ` — ${l.products.name}` : ""}`,
        partner: l.partners?.name || "",
        time: formatDistanceToNow(new Date(l.created_at), { addSuffix: true, locale: ru }),
        icon: FileText,
        color: l.stage === "new" ? "text-[hsl(210_80%_52%)]" : "text-foreground",
      }));
    },
    refetchInterval: 30000,
  });

  return (
    <div className="rounded-2xl border border-border bg-card opacity-0 animate-fade-up" style={{ animationDelay: "450ms" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Активность</h3>
      </div>
      <div className="divide-y divide-border max-h-[340px] overflow-y-auto">
        {activities.length === 0 && (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">Нет активности</div>
        )}
        {activities.map((a) => (
          <div key={a.id} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/40 transition-colors">
            <div className={`mt-0.5 ${a.color}`}>
              <a.icon className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-foreground leading-snug">{a.text}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {a.partner && <span className="text-[10px] font-medium text-muted-foreground">{a.partner}</span>}
                <span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
