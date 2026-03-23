import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { StatCard } from "@/components/crm/StatCard";
import { RecentLeads } from "@/components/crm/RecentLeads";
import { SchedulePanel } from "@/components/crm/SchedulePanel";
import { ActivityFeed } from "@/components/crm/ActivityFeed";
import { Announcements } from "@/components/crm/Announcements";
import { useCrmNavigation } from "@/components/crm/CrmNavigationContext";
import { useDashboardStats } from "@/hooks/useDashboardStats";
import { FileText, Users, Package, Ruler, Plus, Eye, UserPlus, Globe } from "lucide-react";

export function DashboardPage() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");
  const { navigate } = useCrmNavigation();
  const { data: stats, isLoading } = useDashboardStats();

  return (
    <div className="flex flex-1">
      <div className="flex-1 px-4 sm:px-8 py-6 min-w-0">
        <CrmHeader title="Дашборд" />

        {/* Welcome + period selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 opacity-0 animate-fade-up">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Добро пожаловать</h2>
            <p className="text-sm text-muted-foreground mt-0.5">Вот что происходит с вашим бизнесом сегодня</p>
          </div>
          <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden shrink-0">
            {(["today", "week", "month"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPeriod(p)}
                className={`h-8 px-3.5 text-xs font-medium transition-colors active:scale-95 ${
                  period === p ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {p === "today" ? "Сегодня" : p === "week" ? "Неделя" : "Месяц"}
              </button>
            ))}
          </div>
        </div>

        {/* Quick actions */}
        <div className="flex items-center gap-2 mb-6 opacity-0 animate-fade-up flex-wrap" style={{ animationDelay: "60ms" }}>
          <button
            onClick={() => navigate("partners")}
            className="flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors"
          >
            <UserPlus className="h-3.5 w-3.5" />
            Новый партнёр
          </button>
          <button
            onClick={() => navigate("catalog")}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors"
          >
            <Plus className="h-3.5 w-3.5" />
            Добавить товар
          </button>
          <button
            onClick={() => navigate("leads")}
            className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors"
          >
            <Eye className="h-3.5 w-3.5" />
            Все заявки
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Заявки сегодня"
            value={isLoading ? "—" : String(stats?.leadsToday ?? 0)}
            change={stats?.leadsWeek ? `${stats.leadsWeek} за неделю` : undefined}
            changePositive
            delay={0}
          />
          <StatCard
            icon={Users}
            label="Активные партнёры"
            value={isLoading ? "—" : String(stats?.activePartners ?? 0)}
            change={stats ? `из ${stats.totalPartners}` : undefined}
            changePositive
            delay={80}
          />
          <StatCard
            icon={Ruler}
            label="Замеры на неделе"
            value={isLoading ? "—" : String(stats?.measurementsWeek ?? 0)}
            changePositive
            delay={160}
          />
          <StatCard
            icon={Package}
            label="Товаров в каталоге"
            value={isLoading ? "—" : String(stats?.totalProducts ?? 0)}
            delay={240}
          />
        </div>

        <div className="mt-8">
          <RecentLeads leads={stats?.recentLeads} isLoading={isLoading} />
        </div>

        <div className="mt-8">
          <Announcements />
        </div>
      </div>

      <aside className="hidden xl:block w-[320px] shrink-0 border-l border-border px-5 py-6 space-y-6">
        <SchedulePanel />
        <ActivityFeed />
      </aside>
    </div>
  );
}
