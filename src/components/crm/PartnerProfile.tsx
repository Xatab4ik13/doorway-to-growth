import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import {
  ArrowLeft, MapPin, TrendingUp, FileText, Star, ExternalLink,
  Edit3, Phone, Mail, Calendar, Save, X,
} from "lucide-react";
import { LineChart, Line, ResponsiveContainer, Tooltip, XAxis } from "recharts";

interface PartnerProfileProps {
  onBack: () => void;
}

const partner = {
  name: "Brandoors Марьино",
  city: "Москва",
  zone: "ЮВАО",
  address: "ул. Люблинская, 169",
  contact: "Иван Смирнов",
  phone: "+7 (926) 100-20-30",
  email: "marjino@brandoors.ru",
  active: true,
  joinDate: "15.01.2026",
  leads: { total: 124, new: 8, conversion: 14.2 },
  rating: 4.7,
  monthlyLeads: [
    { month: "Окт", value: 14 },
    { month: "Ноя", value: 19 },
    { month: "Дек", value: 22 },
    { month: "Янв", value: 18 },
    { month: "Фев", value: 26 },
    { month: "Мар", value: 24 },
  ],
  recentLeads: [
    { name: "Алексей Петров", type: "Замер двери", date: "21.03.2026", status: "new" as const },
    { name: "Мария Кузнецова", type: "Покупка двери", date: "20.03.2026", status: "done" as const },
    { name: "Игорь Лебедев", type: "Консультация", date: "20.03.2026", status: "contact" as const },
    { name: "Светлана Орлова", type: "Замер двери", date: "19.03.2026", status: "done" as const },
    { name: "Андрей Новиков", type: "Обратный звонок", date: "19.03.2026", status: "new" as const },
  ],
  promotions: [
    { title: "Скидка 15% на Milano Premium", period: "01.03 — 31.03.2026", active: true },
    { title: "Бесплатный замер", period: "Постоянно", active: true },
  ],
  staff: [
    { name: "Иван Смирнов", role: "Управляющий" },
    { name: "Екатерина Данилова", role: "Менеджер" },
    { name: "Павел Соколов", role: "Замерщик" },
  ],
};

const statusStyles: Record<string, string> = {
  new: "bg-[hsl(210_80%_52%/0.12)] text-[hsl(210_80%_52%)]",
  contact: "bg-[hsl(38_92%_50%/0.12)] text-warning",
  done: "bg-[hsl(152_60%_42%/0.12)] text-success",
};

const statusLabels: Record<string, string> = {
  new: "Новая",
  contact: "Контакт",
  done: "Завершена",
};

export function PartnerProfile({ onBack }: PartnerProfileProps) {
  const [editing, setEditing] = useState(false);
  const [tab, setTab] = useState<"overview" | "leads" | "edit">("overview");

  return (
    <div className="px-8 py-6">
      <CrmHeader
        title={partner.name}
        breadcrumbs={[{ label: "Партнёры", onClick: onBack }]}
      />

      {/* Back + name */}
      <div className="flex items-center gap-4 mb-6 opacity-0 animate-fade-up">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted shrink-0">
            <MapPin className="h-5 w-5 text-muted-foreground" strokeWidth={1.8} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-semibold text-foreground truncate">{partner.name}</h2>
              <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${partner.active ? "bg-success" : "bg-muted-foreground/30"}`} />
            </div>
            <p className="text-sm text-muted-foreground">{partner.address} · {partner.zone}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTab(tab === "edit" ? "overview" : "edit")}
            className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors"
          >
            <Edit3 className="h-3.5 w-3.5" />
            {tab === "edit" ? "Отмена" : "Редактировать"}
          </button>
          <button className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
            Сайт
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-1 mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
        {([
          { id: "overview", label: "Обзор" },
          { id: "leads", label: "Заявки" },
          { id: "edit", label: "Настройки" },
        ] as const).map((t) => (
          <button
            key={t.id}
            onClick={() => setTab(t.id)}
            className={`h-8 px-3.5 rounded-lg text-xs font-medium transition-colors active:scale-95 ${
              tab === t.id
                ? "bg-foreground text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Overview tab */}
      {tab === "overview" && (
        <>
          {/* Stats */}
          <div className="grid grid-cols-2 gap-4 xl:grid-cols-4 mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Заявки всего</span>
              </div>
              <span className="text-2xl font-semibold tabular-nums text-foreground">{partner.leads.total}</span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <FileText className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Новые</span>
              </div>
              <span className="text-2xl font-semibold tabular-nums text-foreground">{partner.leads.new}</span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Конверсия</span>
              </div>
              <span className="text-2xl font-semibold tabular-nums text-foreground">{partner.leads.conversion}%</span>
            </div>
            <div className="rounded-2xl border border-border bg-card p-4">
              <div className="flex items-center gap-2 mb-3">
                <Star className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs font-medium text-muted-foreground">Рейтинг</span>
              </div>
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-foreground fill-foreground" />
                <span className="text-2xl font-semibold tabular-nums text-foreground">{partner.rating}</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
            {/* Chart + leads */}
            <div className="xl:col-span-2 space-y-6">
              {/* Monthly chart */}
              <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "140ms" }}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Заявки по месяцам</h3>
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={partner.monthlyLeads}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: "hsl(0 0% 45%)" }} />
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
                      stroke="hsl(220, 65%, 52%)"
                      strokeWidth={2.5}
                      dot={{ r: 4, fill: "hsl(0 0% 100%)", stroke: "hsl(220, 65%, 52%)", strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Recent leads preview */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
                <div className="flex items-center justify-between px-5 py-4 border-b border-border">
                  <h3 className="text-sm font-semibold text-foreground">Последние заявки</h3>
                  <button
                    onClick={() => setTab("leads")}
                    className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Все заявки →
                  </button>
                </div>
                <div className="divide-y divide-border">
                  {partner.recentLeads.slice(0, 3).map((l, i) => (
                    <div key={i} className="flex items-center gap-4 px-5 py-3.5 hover:bg-muted/40 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                        {l.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{l.name}</p>
                        <p className="text-[11px] text-muted-foreground">{l.type}</p>
                      </div>
                      <span className="text-[11px] text-muted-foreground tabular-nums">{l.date}</span>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[l.status]}`}>
                        {statusLabels[l.status]}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="space-y-6">
              {/* Map placeholder */}
              <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
                <div className="aspect-[4/3] bg-muted flex items-center justify-center">
                  <div className="text-center">
                    <MapPin className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
                    <p className="text-xs text-muted-foreground">Карта — {partner.address}</p>
                    <p className="text-[10px] text-muted-foreground/60 mt-0.5">Подключится при интеграции с картами</p>
                  </div>
                </div>
              </div>

              {/* Contact info */}
              <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "220ms" }}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Контакты</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium text-foreground tabular-nums">{partner.phone}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="font-medium text-foreground">{partner.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground shrink-0" />
                    <span className="text-muted-foreground">с {partner.joinDate}</span>
                  </div>
                </div>
              </div>

              {/* Staff */}
              <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "280ms" }}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Сотрудники</h3>
                <div className="space-y-3">
                  {partner.staff.map((s, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[10px] font-semibold text-foreground">
                        {s.name.split(" ").map(n => n[0]).join("")}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{s.name}</p>
                        <p className="text-[10px] text-muted-foreground">{s.role}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Promotions */}
              <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "340ms" }}>
                <h3 className="text-sm font-semibold text-foreground mb-4">Акции</h3>
                <div className="space-y-3">
                  {partner.promotions.map((p, i) => (
                    <div key={i} className="flex items-start justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-foreground">{p.title}</p>
                        <p className="text-[11px] text-muted-foreground">{p.period}</p>
                      </div>
                      <span className={`mt-0.5 h-2.5 w-2.5 shrink-0 rounded-full ${p.active ? "bg-success" : "bg-muted-foreground/30"}`} />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Leads tab */}
      {tab === "leads" && (
        <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[600px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Клиент</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Тип</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Дата</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
                </tr>
              </thead>
              <tbody>
                {partner.recentLeads.map((l, i) => (
                  <tr key={i} className="border-b border-border last:border-0 hover:bg-muted/40 transition-colors cursor-pointer">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                          {l.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <span className="text-sm font-medium text-foreground">{l.name}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground">{l.type}</td>
                    <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">{l.date}</td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[l.status]}`}>
                        {statusLabels[l.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit tab */}
      {tab === "edit" && (
        <div className="max-w-2xl opacity-0 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Данные партнёра</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Название</label>
                <input
                  defaultValue={partner.name}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Город</label>
                <input
                  defaultValue={partner.city}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Зона</label>
                <input
                  defaultValue={partner.zone}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Адрес</label>
                <input
                  defaultValue={partner.address}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Контактное лицо</label>
                <input
                  defaultValue={partner.contact}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Телефон</label>
                <input
                  defaultValue={partner.phone}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
                <input
                  defaultValue={partner.email}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Статус</label>
                <select className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow">
                  <option>Активен</option>
                  <option>Неактивен</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-2">
              <button
                onClick={() => setTab("overview")}
                className="h-9 px-5 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors"
              >
                Отмена
              </button>
              <button className="h-9 px-5 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors flex items-center gap-1.5">
                <Save className="h-3.5 w-3.5" />
                Сохранить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
