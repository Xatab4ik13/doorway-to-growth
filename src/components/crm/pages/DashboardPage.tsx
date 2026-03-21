import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { StatCard } from "@/components/crm/StatCard";
import { RecentLeads } from "@/components/crm/RecentLeads";
import { SchedulePanel } from "@/components/crm/SchedulePanel";
import { ActivityFeed } from "@/components/crm/ActivityFeed";
import { Announcements } from "@/components/crm/Announcements";
import { FileText, Users, Package, TrendingUp, Plus, Eye, UserPlus } from "lucide-react";

export function DashboardPage() {
  const [period, setPeriod] = useState<"today" | "week" | "month">("today");

  return (
    <div className="flex flex-1">
      <div className="flex-1 px-4 sm:px-8 py-6 min-w-0">
        <CrmHeader title="Дашборд" />

        {/* Welcome + period selector */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6 opacity-0 animate-fade-up">
          <div>
            <h2 className="text-xl font-semibold text-foreground">Добро пожаловать, Александр</h2>
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
        <div className="flex items-center gap-2 mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "60ms" }}>
          <button className="flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors">
            <UserPlus className="h-3.5 w-3.5" />
            Партнёр
          </button>
          <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">
            <Plus className="h-3.5 w-3.5" />
            Товар
          </button>
          <button className="flex h-8 items-center gap-1.5 rounded-lg border border-border bg-card px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">
            <Eye className="h-3.5 w-3.5" />
            Заявки
          </button>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={FileText}
            label="Заявки"
            value="47"
            change="+12"
            changePositive
            delay={0}
            sparkline={[22, 28, 18, 35, 31, 42, 47]}
          />
          <StatCard
            icon={Users}
            label="Партнёры"
            value="5"
            change="+1"
            changePositive
            delay={80}
            sparkline={[2, 2, 3, 3, 4, 4, 5]}
          />
          <StatCard
            icon={Package}
            label="Каталог"
            value="247"
            change="+8"
            changePositive
            delay={160}
            sparkline={[210, 218, 225, 230, 235, 239, 247]}
          />
          <StatCard
            icon={TrendingUp}
            label="Конверсия"
            value="12.4%"
            change="+2.1%"
            changePositive
            delay={240}
            sparkline={[8.2, 9.1, 10.4, 9.8, 11.6, 12.4]}
          />
        </div>

        <div className="mt-8">
          <RecentLeads />
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
