import { useState } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { StatCard } from "@/components/crm/StatCard";
import { RecentLeads } from "@/components/crm/RecentLeads";
import { PartnersOverview } from "@/components/crm/PartnersOverview";
import { Store, Package, FileText, TrendingUp } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  return (
    <div className="flex min-h-screen bg-background">
      <CrmSidebar activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="ml-[240px] flex-1 p-6 lg:p-8 transition-all duration-300">
        <CrmHeader
          title="Дашборд"
          subtitle="Обзор платформы Brandoors"
        />

        {/* Stat cards */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <StatCard
            icon={Store}
            title="Активных партнёров"
            value="5"
            change="+2"
            changeType="positive"
            delay={0}
          />
          <StatCard
            icon={Package}
            title="Товаров в каталоге"
            value="247"
            change="+12"
            changeType="positive"
            delay={80}
          />
          <StatCard
            icon={FileText}
            title="Заявок за месяц"
            value="94"
            change="+18%"
            changeType="positive"
            delay={160}
          />
          <StatCard
            icon={TrendingUp}
            title="Конверсия"
            value="3.2%"
            change="-0.4%"
            changeType="negative"
            delay={240}
          />
        </div>

        {/* Two columns */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentLeads />
          <PartnersOverview />
        </div>
      </main>
    </div>
  );
};

export default Index;
