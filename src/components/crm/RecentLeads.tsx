import { ArrowUpRight, Phone, MessageSquare, MapPin } from "lucide-react";
import { useCrmNavigation } from "./CrmNavigationContext";

const funnelStages: Record<string, { label: string; class: string }> = {
  new: { label: "Новая", class: "bg-[hsl(210_80%_52%/0.12)] text-[hsl(210_80%_52%)]" },
  consultation: { label: "Консультация", class: "bg-[hsl(38_92%_50%/0.12)] text-warning" },
  measurement: { label: "Замер", class: "bg-[hsl(270_60%_55%/0.12)] text-[hsl(270_60%_55%)]" },
  quote: { label: "КП", class: "bg-[hsl(190_70%_42%/0.12)] text-[hsl(190_70%_42%)]" },
  contract: { label: "Договор", class: "bg-success/12 text-success" },
  installation: { label: "Монтаж", class: "bg-success/20 text-success" },
};

const leads = [
  {
    name: "Алексей Петров",
    product: "Milano Premium (межкомнатная)",
    partner: "Марьино",
    date: "Сегодня, 14:24",
    stage: "new",
    source: "phone" as const,
    avatar: "АП",
  },
  {
    name: "Елена Сидорова",
    product: "Torex Professor 4+ (входная)",
    partner: "Тёплый Стан",
    date: "Сегодня, 13:47",
    stage: "measurement",
    source: "web" as const,
    avatar: "ЕС",
  },
  {
    name: "Дмитрий Козлов",
    product: "Profil Doors 2.71XN (межкомнатная)",
    partner: "Митино",
    date: "Сегодня, 12:10",
    stage: "quote",
    source: "phone" as const,
    avatar: "ДК",
  },
  {
    name: "Ольга Иванова",
    product: "Браво Porta S4 (входная)",
    partner: "Люблино",
    date: "Вчера, 18:33",
    stage: "contract",
    source: "web" as const,
    avatar: "ОИ",
  },
  {
    name: "Сергей Волков",
    product: "Velldoris Duplex 3 (межкомнатная)",
    partner: "Марьино",
    date: "Вчера, 16:05",
    stage: "consultation",
    source: "phone" as const,
    avatar: "СВ",
  },
];

export function RecentLeads() {
  const { navigate } = useCrmNavigation();

  return (
    <div className="opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-foreground">Последние заявки</h3>
        <button
          onClick={() => navigate("leads")}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors active:scale-95"
        >
          Все заявки
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      <div className="rounded-2xl border border-border bg-card overflow-hidden">
        {/* Table header */}
        <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.7fr_0.7fr_0.6fr] gap-3 px-5 py-3 border-b border-border text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
          <span>Клиент</span>
          <span>Товар</span>
          <span>Партнёр</span>
          <span>Дата</span>
          <span>Статус</span>
        </div>

        {/* Rows */}
        {leads.map((lead, i) => {
          const stage = funnelStages[lead.stage];
          return (
            <div
              key={i}
              className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_0.7fr_0.7fr_0.6fr] gap-1 sm:gap-3 items-center px-5 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors cursor-pointer"
            >
              {/* Client */}
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                  {lead.avatar}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                  <div className="flex items-center gap-1 sm:hidden">
                    {lead.source === "phone" ? (
                      <Phone className="h-3 w-3 text-muted-foreground" />
                    ) : (
                      <MessageSquare className="h-3 w-3 text-muted-foreground" />
                    )}
                    <span className="text-[11px] text-muted-foreground">{lead.source === "phone" ? "Звонок" : "Сайт"}</span>
                  </div>
                </div>
              </div>

              {/* Product */}
              <p className="text-[13px] text-foreground truncate hidden sm:block">{lead.product}</p>

              {/* Partner */}
              <div className="hidden sm:flex items-center gap-1.5">
                <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                <span className="text-[13px] text-muted-foreground truncate">{lead.partner}</span>
              </div>

              {/* Date */}
              <span className="text-[12px] text-muted-foreground tabular-nums hidden sm:block">{lead.date}</span>

              {/* Status */}
              <div className="mt-1.5 sm:mt-0">
                <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${stage.class}`}>
                  {stage.label}
                </span>
              </div>

              {/* Mobile extra info */}
              <div className="flex items-center justify-between sm:hidden mt-1">
                <div className="flex items-center gap-1.5">
                  <MapPin className="h-3 w-3 text-muted-foreground" />
                  <span className="text-[11px] text-muted-foreground">{lead.partner}</span>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums">{lead.date}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
