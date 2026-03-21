import { CrmHeader } from "@/components/crm/CrmHeader";
import { ArrowLeft, MapPin, TrendingUp, FileText, Users, Star, ExternalLink } from "lucide-react";

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
  recentLeads: [
    { name: "Алексей Петров", type: "Замер двери", date: "21.03.2026", status: "new" as const },
    { name: "Мария Кузнецова", type: "Покупка двери", date: "20.03.2026", status: "done" as const },
    { name: "Игорь Лебедев", type: "Консультация", date: "20.03.2026", status: "contact" as const },
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
  return (
    <div className="px-8 py-6">
      <CrmHeader title="Партнёр" />

      {/* Back + name */}
      <div className="flex items-center gap-4 mb-8 opacity-0 animate-fade-up">
        <button
          onClick={onBack}
          className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
        </button>
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
            <MapPin className="h-5 w-5 text-muted-foreground" strokeWidth={1.8} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-foreground">{partner.name}</h2>
            <p className="text-sm text-muted-foreground">{partner.address} · {partner.zone}</p>
          </div>
        </div>
        <span className={`ml-3 h-3 w-3 rounded-full ${partner.active ? "bg-success" : "bg-muted-foreground/30"}`} />
        <div className="ml-auto flex items-center gap-2">
          <button className="flex h-9 items-center gap-2 rounded-xl border border-border bg-card px-4 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">
            <ExternalLink className="h-3.5 w-3.5" />
            Открыть сайт
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-8 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
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
          <span className="text-2xl font-semibold tabular-nums text-foreground">{partner.rating}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {/* Recent leads */}
        <div className="xl:col-span-2 rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
          <div className="flex items-center justify-between px-5 py-4 border-b border-border">
            <h3 className="text-sm font-semibold text-foreground">Последние заявки</h3>
          </div>
          <div className="divide-y divide-border">
            {partner.recentLeads.map((l, i) => (
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

        {/* Right column */}
        <div className="space-y-6">
          {/* Contact info */}
          <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "200ms" }}>
            <h3 className="text-sm font-semibold text-foreground mb-4">Контактная информация</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Контакт</span>
                <span className="font-medium text-foreground">{partner.contact}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Телефон</span>
                <span className="font-medium text-foreground tabular-nums">{partner.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Email</span>
                <span className="font-medium text-foreground">{partner.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Дата подключения</span>
                <span className="font-medium text-foreground tabular-nums">{partner.joinDate}</span>
              </div>
            </div>
          </div>

          {/* Promotions */}
          <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "280ms" }}>
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

          {/* Staff */}
          <div className="rounded-2xl border border-border bg-card p-5 opacity-0 animate-fade-up" style={{ animationDelay: "360ms" }}>
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
        </div>
      </div>
    </div>
  );
}
