import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { subDays, format, startOfDay } from "date-fns";
import { ru } from "date-fns/locale";

const PIE_COLORS = [
  "hsl(220, 65%, 52%)",
  "hsl(158, 50%, 40%)",
  "hsl(38, 88%, 50%)",
  "hsl(340, 55%, 48%)",
  "hsl(280, 45%, 55%)",
];

const BAR_COLORS = [
  "hsl(220, 55%, 48%)",
  "hsl(220, 50%, 55%)",
  "hsl(220, 45%, 62%)",
  "hsl(220, 60%, 44%)",
  "hsl(220, 65%, 40%)",
  "hsl(220, 50%, 55%)",
  "hsl(220, 45%, 62%)",
];

const PRODUCT_COLORS = [
  "hsl(220, 65%, 52%)",
  "hsl(158, 50%, 40%)",
  "hsl(38, 88%, 50%)",
  "hsl(340, 55%, 48%)",
  "hsl(280, 45%, 55%)",
];

const periodDays = { week: 7, month: 30, quarter: 90 };

function useAnalyticsData(period: "week" | "month" | "quarter") {
  const days = periodDays[period];
  const since = subDays(new Date(), days).toISOString();

  const leadsQuery = useQuery({
    queryKey: ["analytics-leads", period],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("id, stage, created_at, partner_id, product_id")
        .gte("created_at", since)
        .order("created_at", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
  });

  const partnersQuery = useQuery({
    queryKey: ["analytics-partners"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partners")
        .select("id, name, district")
        .eq("is_active", true);
      if (error) throw error;
      return data ?? [];
    },
  });

  const productsQuery = useQuery({
    queryKey: ["analytics-products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("id, name")
        .eq("is_active", true);
      if (error) throw error;
      return data ?? [];
    },
  });

  return { leadsQuery, partnersQuery, productsQuery };
}

export function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("week");
  const { leadsQuery, partnersQuery, productsQuery } = useAnalyticsData(period);

  const leads = leadsQuery.data ?? [];
  const partners = partnersQuery.data ?? [];
  const products = productsQuery.data ?? [];
  const isLoading = leadsQuery.isLoading;

  // Leads per day (last 7 days for week, grouped)
  const days = periodDays[period];
  const leadsPerDay = (() => {
    const buckets: Record<string, number> = {};
    const bucketCount = Math.min(days, 7);
    const bucketSize = Math.ceil(days / bucketCount);

    for (let i = 0; i < bucketCount; i++) {
      const d = subDays(new Date(), (bucketCount - 1 - i) * bucketSize);
      const label = format(d, period === "week" ? "EEE" : "dd.MM", { locale: ru });
      buckets[label] = 0;
    }

    leads.forEach((l) => {
      const d = new Date(l.created_at);
      const dayIndex = Math.floor((Date.now() - d.getTime()) / (bucketSize * 86400000));
      const idx = bucketCount - 1 - Math.min(dayIndex, bucketCount - 1);
      const keys = Object.keys(buckets);
      if (keys[idx]) buckets[keys[idx]]++;
    });

    return Object.entries(buckets).map(([day, count]) => ({ day, leads: count }));
  })();

  // Conversion
  const completedLeads = leads.filter((l) => l.stage === "completed" || l.stage === "contract").length;
  const conversionRate = leads.length > 0 ? ((completedLeads / leads.length) * 100).toFixed(1) : "0";

  // Leads by partner
  const partnerLeads = (() => {
    const counts: Record<string, number> = {};
    leads.forEach((l) => {
      if (l.partner_id) counts[l.partner_id] = (counts[l.partner_id] || 0) + 1;
    });
    return partners
      .map((p) => ({ name: p.district || p.name, value: counts[p.id] || 0 }))
      .filter((p) => p.value > 0)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  })();

  // Top products
  const topProducts = (() => {
    const counts: Record<string, { total: number; completed: number }> = {};
    leads.forEach((l) => {
      if (l.product_id) {
        if (!counts[l.product_id]) counts[l.product_id] = { total: 0, completed: 0 };
        counts[l.product_id].total++;
        if (l.stage === "completed" || l.stage === "contract") counts[l.product_id].completed++;
      }
    });
    return Object.entries(counts)
      .map(([id, { total, completed }]) => ({
        name: products.find((p) => p.id === id)?.name ?? "Неизвестный",
        leads: total,
        conversion: total > 0 ? Math.round((completed / total) * 100) : 0,
      }))
      .sort((a, b) => b.leads - a.leads)
      .slice(0, 5);
  })();

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Аналитика" />

      {/* Period selector */}
      <div className="flex items-center gap-2 mb-6 opacity-0 animate-fade-up">
        <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
          {(["week", "month", "quarter"] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`h-9 px-4 text-xs font-medium transition-colors active:scale-95 ${
                period === p ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {p === "week" ? "Неделя" : p === "month" ? "Месяц" : "Квартал"}
            </button>
          ))}
        </div>
        {isLoading && (
          <div className="h-5 w-5 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        )}
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Leads per day */}
        <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground">Заявки по дням</h3>
            <span className="text-2xl font-semibold tabular-nums text-foreground">{leads.length}</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <BarChart data={leadsPerDay} barSize={32}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 92%)" vertical={false} />
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} width={30} />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(0 0% 92%)",
                  boxShadow: "0 4px 16px hsl(0 0% 0% / 0.06)",
                  fontSize: 12,
                }}
              />
              <Bar dataKey="leads" radius={[6, 6, 0, 0]}>
                {leadsPerDay.map((_, i) => (
                  <Cell key={i} fill={BAR_COLORS[i % BAR_COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion */}
        <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground">Конверсия</h3>
            <span className="text-2xl font-semibold tabular-nums text-success">{conversionRate}%</span>
          </div>
          <div className="space-y-3">
            {[
              { label: "Новые", stage: "new" },
              { label: "Консультация", stage: "consultation" },
              { label: "КП", stage: "quote" },
              { label: "Договор", stage: "contract" },
              { label: "Завершена", stage: "completed" },
            ].map((s, i) => {
              const count = leads.filter((l) => l.stage === s.stage).length;
              const pct = leads.length > 0 ? (count / leads.length) * 100 : 0;
              return (
                <div key={s.stage} className="flex items-center gap-3">
                  <span className="text-xs text-muted-foreground w-28">{s.label}</span>
                  <div className="flex-1 h-2 rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{ width: `${pct}%`, backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }}
                    />
                  </div>
                  <span className="text-xs font-semibold tabular-nums text-foreground w-8 text-right">{count}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Partner distribution */}
        <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <h3 className="text-sm font-semibold text-foreground mb-5">Заявки по партнёрам</h3>
          {partnerLeads.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Нет данных за выбранный период</p>
          ) : (
            <div className="flex flex-col sm:flex-row items-center gap-6 sm:gap-8">
              <ResponsiveContainer width={180} height={180} className="shrink-0">
                <PieChart>
                  <Pie data={partnerLeads} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={3} stroke="hsl(0 0% 100%)">
                    {partnerLeads.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="flex flex-col gap-3">
                {partnerLeads.map((p, i) => (
                  <div key={p.name} className="flex items-center gap-3">
                    <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <span className="text-sm text-foreground min-w-[100px]">{p.name}</span>
                    <span className="text-sm font-semibold tabular-nums text-foreground">{p.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "320ms" }}>
          <h3 className="text-sm font-semibold text-foreground mb-5">Популярные товары</h3>
          {topProducts.length === 0 ? (
            <p className="text-sm text-muted-foreground py-8 text-center">Нет данных за выбранный период</p>
          ) : (
            <div className="space-y-4">
              {topProducts.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="text-xs font-semibold tabular-nums w-4" style={{ color: PRODUCT_COLORS[i % PRODUCT_COLORS.length] }}>{i + 1}</span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                    <div className="mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${topProducts[0].leads > 0 ? (p.leads / topProducts[0].leads) * 100 : 0}%`,
                          backgroundColor: PRODUCT_COLORS[i % PRODUCT_COLORS.length],
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-xs font-semibold tabular-nums text-foreground">{p.leads} заявок</p>
                    <p className="text-[10px] tabular-nums" style={{ color: PRODUCT_COLORS[i % PRODUCT_COLORS.length] }}>{p.conversion}% конв.</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
