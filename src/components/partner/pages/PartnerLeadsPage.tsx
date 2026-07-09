import { useState } from "react";
import { PartnerHeader } from "../PartnerHeader";
import { Search, Phone, Mail, Calendar, ChevronRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const stages = [
  { id: "new", label: "Новые", color: "bg-blue-500" },
  { id: "consultation", label: "Консультация", color: "bg-amber-500" },
  { id: "quote", label: "КП", color: "bg-cyan-500" },
  { id: "paid", label: "Оплачено", color: "bg-emerald-500" },
  { id: "completed", label: "Завершена", color: "bg-green-600" },
];

export function PartnerLeadsPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { user } = useAuth();
  const [search, setSearch] = useState("");
  const [activeStage, setActiveStage] = useState("all");

  const { data: partner } = useQuery({
    queryKey: ["my-partner", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("partners")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: leads = [], isLoading } = useQuery({
    queryKey: ["partner-leads", partner?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*, products(id, name)")
        .eq("partner_id", partner!.id)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!partner?.id,
  });

  const filtered = leads.filter((l: any) => {
    const matchesSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      (l.products?.name || "").toLowerCase().includes(search.toLowerCase());
    const matchesStage = activeStage === "all" || l.stage === activeStage;
    return matchesSearch && matchesStage;
  });

  const getStage = (id: string) => stages.find((s) => s.id === id);

  const totalLeads = leads.length;
  const inProgress = leads.filter((l: any) => !["completed", "cancelled", "new"].includes(l.stage)).length;
  const completed = leads.filter((l: any) => l.stage === "completed").length;
  const conversionRate = totalLeads > 0 ? Math.round((completed / totalLeads) * 100) : 0;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <PartnerHeader title="Мои заявки" onNavigate={onNavigate} />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Всего заявок", value: String(totalLeads), sub: "за всё время" },
          { label: "В работе", value: String(inProgress), sub: "активных" },
          { label: "Завершены", value: String(completed), sub: "за всё время" },
          { label: "Конверсия", value: `${conversionRate}%`, sub: "заявка → завершена" },
        ].map((s, i) => (
          <div key={i} className="rounded-2xl border border-border bg-card p-4">
            <p className="text-[11px] text-muted-foreground font-medium">{s.label}</p>
            <p className="text-xl font-bold text-foreground mt-1">{s.value}</p>
            <p className="text-[10px] text-muted-foreground mt-0.5">{s.sub}</p>
          </div>
        ))}
      </div>

      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Поиск по имени или товару..."
            className="w-full h-10 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
          />
        </div>
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          <button
            onClick={() => setActiveStage("all")}
            className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeStage === "all" ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
          >
            Все
          </button>
          {stages.map((s) => (
            <button
              key={s.id}
              onClick={() => setActiveStage(s.id)}
              className={`shrink-0 px-3 py-2 rounded-lg text-xs font-medium transition-colors ${activeStage === s.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"}`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        {isLoading && <div className="text-center py-12 text-muted-foreground text-sm">Загрузка...</div>}
        {!isLoading && filtered.map((lead: any) => {
          const stage = getStage(lead.stage);
          return (
            <div key={lead.id} className="rounded-2xl border border-border bg-card p-4 hover:shadow-sm transition-shadow cursor-pointer group">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 mb-1.5">
                    <h3 className="text-sm font-semibold text-foreground">{lead.name}</h3>
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-medium text-white ${stage?.color || "bg-muted"}`}>
                      {stage?.label || lead.stage}
                    </span>
                  </div>
                  {lead.products?.name && <p className="text-xs text-muted-foreground mb-2">Товар: {lead.products.name}</p>}
                  <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                    {lead.phone && <span className="flex items-center gap-1"><Phone className="h-3 w-3" />{lead.phone}</span>}
                    {lead.email && <span className="flex items-center gap-1"><Mail className="h-3 w-3" />{lead.email}</span>}
                    <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{formatDistanceToNow(new Date(lead.created_at), { addSuffix: true, locale: ru })}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0 mt-1" />
              </div>
            </div>
          );
        })}
        {!isLoading && filtered.length === 0 && (
          <div className="text-center py-12 text-muted-foreground text-sm">Заявки не найдены</div>
        )}
      </div>
    </div>
  );
}
