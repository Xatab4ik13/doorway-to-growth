import { CrmHeader } from "@/components/crm/CrmHeader";
import { StatCard } from "@/components/crm/StatCard";
import { RecentLeads } from "@/components/crm/RecentLeads";
import { SchedulePanel } from "@/components/crm/SchedulePanel";
import { FileText, Users, Package, TrendingUp } from "lucide-react";

export function DashboardPage() {
  return (
    <div className="flex flex-1">
      <div className="flex-1 px-8 py-6 min-w-0">
        <CrmHeader title="Дашборд" />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard icon={FileText} label="Заявки сегодня" value="47" change="+12" changePositive delay={0} />
          <StatCard icon={Users} label="Партнёры" value="5" change="+1" changePositive delay={80} />
          <StatCard icon={Package} label="Каталог" value="247" change="+8" changePositive delay={160} />
          <StatCard icon={TrendingUp} label="Конверсия" value="12.4%" change="+2.1%" changePositive delay={240} />
        </div>

        <div className="mt-8">
          <RecentLeads />
        </div>
      </div>

      <aside className="hidden xl:block w-[320px] shrink-0 border-l border-border px-5 py-6">
        <SchedulePanel />
      </aside>
    </div>
  );
}
