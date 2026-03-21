import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { EmptyState } from "@/components/crm/EmptyState";
import { Bell, FileText, Users, Package, Settings, Check, CheckCheck, Trash2, Filter } from "lucide-react";

interface Notification {
  id: number;
  text: string;
  detail: string;
  time: string;
  date: string;
  type: "lead" | "partner" | "catalog" | "system";
  unread: boolean;
}

const typeIcons: Record<Notification["type"], React.ElementType> = {
  lead: FileText,
  partner: Users,
  catalog: Package,
  system: Settings,
};

const typeLabels: Record<Notification["type"], string> = {
  lead: "Заявка",
  partner: "Партнёр",
  catalog: "Каталог",
  system: "Система",
};

const typeColors: Record<Notification["type"], string> = {
  lead: "bg-[hsl(210,80%,52%/0.12)] text-[hsl(210,80%,52%)]",
  partner: "bg-success/12 text-success",
  catalog: "bg-warning/12 text-warning",
  system: "bg-muted text-muted-foreground",
};

const initialNotifications: Notification[] = [
  { id: 1, text: "Новая заявка от Алексея Петрова", detail: "Замер двери — Brandoors Марьино", time: "14:24", date: "21.03.2026", type: "lead", unread: true },
  { id: 2, text: "Партнёр Митино обновил контактные данные", detail: "Изменён телефон и адрес салона", time: "13:47", date: "21.03.2026", type: "partner", unread: true },
  { id: 3, text: "Товар Milano Premium добавлен в каталог", detail: "Категория: Межкомнатные, РРЦ: 28 500 ₽", time: "12:10", date: "21.03.2026", type: "catalog", unread: true },
  { id: 4, text: "Партнёр Сокольники деактивирован", detail: "Причина: истечение договора", time: "11:33", date: "21.03.2026", type: "partner", unread: false },
  { id: 5, text: "Заявка #47 переведена в статус «Замер»", detail: "Сергей Морозов — Brandoors Марьино", time: "10:15", date: "21.03.2026", type: "lead", unread: false },
  { id: 6, text: "Обновлены цены на 12 товаров", detail: "Категории: Межкомнатные, Входные", time: "18:42", date: "20.03.2026", type: "catalog", unread: false },
  { id: 7, text: "Новая заявка от Елены Сидоровой", detail: "Консультация — Brandoors Митино", time: "16:30", date: "20.03.2026", type: "lead", unread: false },
  { id: 8, text: "Резервная копия базы данных создана", detail: "Автоматическое резервное копирование", time: "03:00", date: "20.03.2026", type: "system", unread: false },
  { id: 9, text: "Партнёр Тёплый Стан добавил 3 сотрудника", detail: "Обновлена страница «О салоне»", time: "15:18", date: "19.03.2026", type: "partner", unread: false },
  { id: 10, text: "Новая заявка от Виктора Чернова", detail: "Покупка двери — Brandoors Митино", time: "14:05", date: "19.03.2026", type: "lead", unread: false },
];

const filterOptions = ["all", "lead", "partner", "catalog", "system"] as const;
const filterLabels: Record<string, string> = {
  all: "Все",
  lead: "Заявки",
  partner: "Партнёры",
  catalog: "Каталог",
  system: "Система",
};

export function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>(initialNotifications);
  const [filter, setFilter] = useState<string>("all");

  const filtered = filter === "all" ? notifications : notifications.filter((n) => n.type === filter);
  const unreadCount = notifications.filter((n) => n.unread).length;

  const markRead = (id: number) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, unread: false } : n)));
  };

  const markAllRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, unread: false })));
  };

  const deleteNotification = (id: number) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  // Group by date
  const grouped = filtered.reduce<Record<string, Notification[]>>((acc, n) => {
    (acc[n.date] ||= []).push(n);
    return acc;
  }, {});

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Уведомления" breadcrumbs={[{ label: "Дашборд" }]} />

      {/* Stats + actions */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 opacity-0 animate-fade-up">
        <div className="flex items-center gap-3">
          <span className="text-2xl font-semibold tabular-nums text-foreground">{notifications.length}</span>
          <span className="text-sm text-muted-foreground">уведомлений</span>
          {unreadCount > 0 && (
            <>
              <div className="h-5 w-px bg-border" />
              <span className="flex items-center gap-1.5 text-sm font-medium text-foreground">
                <span className="h-2 w-2 rounded-full bg-destructive" />
                {unreadCount} новых
              </span>
            </>
          )}
        </div>
        {unreadCount > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-1.5 h-8 px-3 rounded-xl border border-border bg-card text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors"
          >
            <CheckCheck className="h-3.5 w-3.5" />
            Прочитать все
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex items-center gap-1.5 mb-6 overflow-x-auto pb-1 opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
        <Filter className="h-4 w-4 text-muted-foreground mr-1" />
        {filterOptions.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`h-8 px-3 rounded-lg text-xs font-medium transition-colors active:scale-95 ${
              filter === f
                ? "bg-foreground text-primary-foreground"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            {filterLabels[f]}
          </button>
        ))}
      </div>

      {/* Notification list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Bell}
          title="Нет уведомлений"
          description="По выбранному фильтру уведомления не найдены"
          action={{ label: "Показать все", onClick: () => setFilter("all") }}
        />
      ) : (
        <div className="space-y-6 opacity-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {date === "21.03.2026" ? "Сегодня" : date === "20.03.2026" ? "Вчера" : date}
              </p>
              <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
                {items.map((n) => {
                  const Icon = typeIcons[n.type];
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-4 px-5 py-4 transition-colors hover:bg-muted/40 cursor-pointer ${
                        n.unread ? "bg-muted/20" : ""
                      }`}
                      onClick={() => markRead(n.id)}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${typeColors[n.type]}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`text-sm leading-snug ${n.unread ? "font-semibold text-foreground" : "text-foreground"}`}>
                              {n.text}
                            </p>
                            <p className="text-xs text-muted-foreground mt-0.5">{n.detail}</p>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {n.unread && <span className="h-2 w-2 rounded-full bg-destructive" />}
                            <span className="text-[10px] text-muted-foreground tabular-nums">{n.time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {n.unread && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markRead(n.id); }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-colors"
                            title="Отметить прочитанным"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteNotification(n.id); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-destructive active:scale-95 transition-colors"
                          title="Удалить"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
