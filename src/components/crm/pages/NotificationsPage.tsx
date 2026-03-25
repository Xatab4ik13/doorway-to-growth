import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { EmptyState } from "@/components/crm/EmptyState";
import { Bell, FileText, Users, Package, Settings, Check, CheckCheck, Trash2, Filter } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

type NotificationType = "lead" | "partner" | "catalog" | "system";

const typeIcons: Record<NotificationType, React.ElementType> = {
  lead: FileText,
  partner: Users,
  catalog: Package,
  system: Settings,
};

const typeLabels: Record<NotificationType, string> = {
  lead: "Заявка",
  partner: "Партнёр",
  catalog: "Каталог",
  system: "Система",
};

const typeColors: Record<NotificationType, string> = {
  lead: "bg-[hsl(210,80%,52%/0.12)] text-[hsl(210,80%,52%)]",
  partner: "bg-success/12 text-success",
  catalog: "bg-warning/12 text-warning",
  system: "bg-muted text-muted-foreground",
};

const filterOptions = ["all", "lead", "partner", "catalog", "system"] as const;
const filterLabels: Record<string, string> = {
  all: "Все",
  lead: "Заявки",
  partner: "Партнёры",
  catalog: "Каталог",
  system: "Система",
};

export function NotificationsPage() {
  const queryClient = useQueryClient();
  const [filter, setFilter] = useState<string>("all");

  const { data: notifications = [], isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(50);
      if (error) throw error;
      return data ?? [];
    },
    refetchInterval: 15000,
  });

  const markReadMut = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markAllReadMut = useMutation({
    mutationFn: async () => {
      await supabase.from("notifications").update({ is_read: true }).eq("is_read", false);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const deleteMut = useMutation({
    mutationFn: async (id: string) => {
      await supabase.from("notifications").delete().eq("id", id);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const filtered = filter === "all" ? notifications : notifications.filter((n: any) => n.type === filter);
  const unreadCount = notifications.filter((n: any) => !n.is_read).length;

  // Group by date
  const grouped = filtered.reduce<Record<string, any[]>>((acc, n: any) => {
    const date = new Date(n.created_at).toLocaleDateString("ru-RU");
    (acc[date] ||= []).push(n);
    return acc;
  }, {});

  const today = new Date().toLocaleDateString("ru-RU");
  const yesterday = new Date(Date.now() - 86400000).toLocaleDateString("ru-RU");

  if (isLoading) {
    return (
      <div className="px-4 sm:px-8 py-6">
        <CrmHeader title="Уведомления" breadcrumbs={[{ label: "Дашборд" }]} />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

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
            onClick={() => markAllReadMut.mutate()}
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
          description={filter !== "all" ? "По выбранному фильтру уведомления не найдены" : "Уведомления появятся при поступлении новых заявок"}
          action={filter !== "all" ? { label: "Показать все", onClick: () => setFilter("all") } : undefined}
        />
      ) : (
        <div className="space-y-6 opacity-0 animate-fade-up" style={{ animationDelay: "120ms" }}>
          {Object.entries(grouped).map(([date, items]) => (
            <div key={date}>
              <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-2 px-1">
                {date === today ? "Сегодня" : date === yesterday ? "Вчера" : date}
              </p>
              <div className="rounded-2xl border border-border bg-card overflow-hidden divide-y divide-border">
                {items.map((n: any) => {
                  const nType = (n.type as NotificationType) || "system";
                  const Icon = typeIcons[nType] || Settings;
                  const time = formatDistanceToNow(new Date(n.created_at), { addSuffix: true, locale: ru });
                  return (
                    <div
                      key={n.id}
                      className={`flex items-start gap-3 sm:gap-4 px-4 sm:px-5 py-3 sm:py-4 transition-colors hover:bg-muted/40 cursor-pointer ${
                        !n.is_read ? "bg-muted/20" : ""
                      }`}
                      onClick={() => !n.is_read && markReadMut.mutate(n.id)}
                    >
                      <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${typeColors[nType] || typeColors.system}`}>
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className={`text-sm leading-snug ${!n.is_read ? "font-semibold text-foreground" : "text-foreground"}`}>
                              {n.title}
                            </p>
                            {n.detail && <p className="text-xs text-muted-foreground mt-0.5">{n.detail}</p>}
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {!n.is_read && <span className="h-2 w-2 rounded-full bg-destructive" />}
                            <span className="text-[10px] text-muted-foreground tabular-nums">{time}</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1 shrink-0 hidden sm:flex">
                        {!n.is_read && (
                          <button
                            onClick={(e) => { e.stopPropagation(); markReadMut.mutate(n.id); }}
                            className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-colors"
                            title="Отметить прочитанным"
                          >
                            <Check className="h-3.5 w-3.5" />
                          </button>
                        )}
                        <button
                          onClick={(e) => { e.stopPropagation(); deleteMut.mutate(n.id); }}
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
