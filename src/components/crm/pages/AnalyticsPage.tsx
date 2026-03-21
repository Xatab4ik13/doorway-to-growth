import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from "recharts";

const leadsPerDay = [
  { day: "Пн", leads: 12 },
  { day: "Вт", leads: 19 },
  { day: "Ср", leads: 8 },
  { day: "Чт", leads: 24 },
  { day: "Пт", leads: 31 },
  { day: "Сб", leads: 15 },
  { day: "Вс", leads: 7 },
];

const conversionTrend = [
  { month: "Окт", value: 8.2 },
  { month: "Ноя", value: 9.1 },
  { month: "Дек", value: 10.4 },
  { month: "Янв", value: 9.8 },
  { month: "Фев", value: 11.6 },
  { month: "Мар", value: 12.4 },
];

const partnerLeads = [
  { name: "Марьино", value: 24 },
  { name: "Митино", value: 31 },
  { name: "Тёплый Стан", value: 18 },
  { name: "Люблино", value: 12 },
  { name: "Сокольники", value: 9 },
];

const topProducts = [
  { name: "Milano Premium", leads: 18, conversion: 22 },
  { name: "Forte Shield", leads: 14, conversion: 18 },
  { name: "Classic Oak", leads: 12, conversion: 15 },
  { name: "Slide Pro", leads: 9, conversion: 11 },
  { name: "Elegance White", leads: 7, conversion: 9 },
];

const PIE_COLORS = [
  "hsl(28, 55%, 38%)",
  "hsl(158, 50%, 40%)",
  "hsl(38, 88%, 50%)",
  "hsl(340, 55%, 48%)",
  "hsl(24, 40%, 55%)",
];

const BAR_COLORS = [
  "hsl(28, 55%, 38%)",
  "hsl(28, 50%, 45%)",
  "hsl(28, 45%, 52%)",
  "hsl(28, 55%, 38%)",
  "hsl(28, 60%, 34%)",
  "hsl(28, 50%, 45%)",
  "hsl(28, 45%, 52%)",
];

const PRODUCT_COLORS = [
  "hsl(28, 55%, 38%)",
  "hsl(158, 50%, 40%)",
  "hsl(38, 88%, 50%)",
  "hsl(340, 55%, 48%)",
  "hsl(24, 40%, 55%)",
];

export function AnalyticsPage() {
  const [period, setPeriod] = useState<"week" | "month" | "quarter">("week");

  return (
    <div className="px-8 py-6">
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
      </div>

      {/* Charts grid */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* Leads per day */}
        <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
          <h3 className="text-sm font-semibold text-foreground mb-5">Заявки по дням</h3>
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
                  <Cell key={i} fill={BAR_COLORS[i]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Conversion trend */}
        <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-semibold text-foreground">Конверсия</h3>
            <span className="text-2xl font-semibold tabular-nums text-success">12.4%</span>
          </div>
          <ResponsiveContainer width="100%" height={240}>
            <LineChart data={conversionTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(0 0% 92%)" vertical={false} />
              <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} />
              <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} width={30} unit="%" />
              <Tooltip
                contentStyle={{
                  borderRadius: 12,
                  border: "1px solid hsl(0 0% 92%)",
                  boxShadow: "0 4px 16px hsl(0 0% 0% / 0.06)",
                  fontSize: 12,
                }}
              />
              <Line
                type="monotone"
                dataKey="value"
                stroke="hsl(152, 60%, 42%)"
                strokeWidth={2.5}
                dot={{ r: 5, fill: "hsl(0 0% 100%)", stroke: "hsl(152, 60%, 42%)", strokeWidth: 2.5 }}
                activeDot={{ r: 7, fill: "hsl(152, 60%, 42%)", stroke: "hsl(0 0% 100%)", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Partner distribution */}
        <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "240ms" }}>
          <h3 className="text-sm font-semibold text-foreground mb-5">Заявки по партнёрам</h3>
          <div className="flex items-center gap-8">
            <ResponsiveContainer width={180} height={180}>
              <PieChart>
                <Pie data={partnerLeads} dataKey="value" cx="50%" cy="50%" innerRadius={50} outerRadius={80} strokeWidth={3} stroke="hsl(0 0% 100%)">
                  {partnerLeads.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="flex flex-col gap-3">
              {partnerLeads.map((p, i) => (
                <div key={p.name} className="flex items-center gap-3">
                  <span className="h-3 w-3 rounded-full shrink-0" style={{ backgroundColor: PIE_COLORS[i] }} />
                  <span className="text-sm text-foreground min-w-[100px]">{p.name}</span>
                  <span className="text-sm font-semibold tabular-nums text-foreground">{p.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Top products */}
        <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "320ms" }}>
          <h3 className="text-sm font-semibold text-foreground mb-5">Популярные товары</h3>
          <div className="space-y-4">
            {topProducts.map((p, i) => (
              <div key={p.name} className="flex items-center gap-3">
                <span className="text-xs font-semibold tabular-nums w-4" style={{ color: PRODUCT_COLORS[i] }}>{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{p.name}</p>
                  <div className="mt-1.5 h-2 w-full rounded-full bg-muted overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-500"
                      style={{
                        width: `${(p.leads / topProducts[0].leads) * 100}%`,
                        backgroundColor: PRODUCT_COLORS[i],
                      }}
                    />
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-xs font-semibold tabular-nums text-foreground">{p.leads} заявок</p>
                  <p className="text-[10px] tabular-nums" style={{ color: PRODUCT_COLORS[i] }}>{p.conversion}% конв.</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
