import { ArrowUpRight, Phone, MessageSquare, MapPin } from "lucide-react";
import { useCrmNavigation } from "./CrmNavigationContext";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

const funnelStages: Record<string, { label: string; class: string }> = {
  new: { label: "Новая", class: "bg-[hsl(210_80%_52%/0.12)] text-[hsl(210_80%_52%)]" },
  consultation: { label: "Консультация", class: "bg-[hsl(38_92%_50%/0.12)] text-warning" },
  measurement: { label: "Замер", class: "bg-[hsl(270_60%_55%/0.12)] text-[hsl(270_60%_55%)]" },
  calculation: { label: "Расчёт", class: "bg-[hsl(190_70%_42%/0.12)] text-[hsl(190_70%_42%)]" },
  contract: { label: "Договор", class: "bg-success/12 text-success" },
  installation: { label: "Монтаж", class: "bg-success/20 text-success" },
  completed: { label: "Завершена", class: "bg-muted text-muted-foreground" },
  cancelled: { label: "Отменена", class: "bg-destructive/12 text-destructive" },
};

interface RecentLeadsProps {
  leads?: any[];
  isLoading?: boolean;
}

export function RecentLeads({ leads, isLoading }: RecentLeadsProps) {
  const { navigate } = useCrmNavigation();

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((w) => w[0])
      .join("")
      .slice(0, 2)
      .toUpperCase();
  };

  const formatDate = (dateStr: string) => {
    try {
      return formatDistanceToNow(new Date(dateStr), { addSuffix: true, locale: ru });
    } catch {
      return dateStr;
    }
  };

  if (isLoading) {
    return (
      <div className="opacity-0 animate-fade-up" style={{ animationDelay: "300ms" }}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold text-foreground">Последние заявки</h3>
        </div>
        <div className="rounded-2xl border border-border bg-card p-8 text-center text-sm text-muted-foreground">
          Загрузка...
        </div>
      </div>
    );
  }

  const items = leads ?? [];

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
        {items.length === 0 ? (
          <div className="px-5 py-8 text-center text-sm text-muted-foreground">
            Заявок пока нет
          </div>
        ) : (
          <>
            <div className="hidden sm:grid grid-cols-[1fr_1.2fr_0.7fr_0.7fr_0.6fr] gap-3 px-5 py-3 border-b border-border text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              <span>Клиент</span>
              <span>Товар</span>
              <span>Партнёр</span>
              <span>Дата</span>
              <span>Статус</span>
            </div>

            {items.map((lead: any) => {
              const stage = funnelStages[lead.stage] ?? funnelStages.new;
              return (
                <div
                  key={lead.id}
                  className="grid grid-cols-1 sm:grid-cols-[1fr_1.2fr_0.7fr_0.7fr_0.6fr] gap-1 sm:gap-3 items-center px-5 py-3.5 border-b border-border last:border-b-0 hover:bg-muted/40 transition-colors cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                      {getInitials(lead.name)}
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                      <div className="flex items-center gap-1 sm:hidden">
                        {lead.source === "phone" ? (
                          <Phone className="h-3 w-3 text-muted-foreground" />
                        ) : (
                          <MessageSquare className="h-3 w-3 text-muted-foreground" />
                        )}
                        <span className="text-[11px] text-muted-foreground">
                          {lead.source === "phone" ? "Звонок" : "Сайт"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <p className="text-[13px] text-foreground truncate hidden sm:block">
                    {lead.product?.name ?? "—"}
                  </p>

                  <div className="hidden sm:flex items-center gap-1.5">
                    <MapPin className="h-3 w-3 text-muted-foreground shrink-0" />
                    <span className="text-[13px] text-muted-foreground truncate">
                      {lead.partner?.name ?? "—"}
                    </span>
                  </div>

                  <span className="text-[12px] text-muted-foreground tabular-nums hidden sm:block">
                    {formatDate(lead.created_at)}
                  </span>

                  <div className="mt-1.5 sm:mt-0">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${stage.class}`}>
                      {stage.label}
                    </span>
                  </div>

                  <div className="flex items-center justify-between sm:hidden mt-1">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3 text-muted-foreground" />
                      <span className="text-[11px] text-muted-foreground">{lead.partner?.name ?? "—"}</span>
                    </div>
                    <span className="text-[11px] text-muted-foreground tabular-nums">{formatDate(lead.created_at)}</span>
                  </div>
                </div>
              );
            })}
          </>
        )}
      </div>
    </div>
  );
}
