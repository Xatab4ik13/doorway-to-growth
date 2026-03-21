import { useState } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { StatCard } from "@/components/crm/StatCard";
import { RecentLeads } from "@/components/crm/RecentLeads";
import { PartnersOverview } from "@/components/crm/PartnersOverview";
import { Store, Package, FileText, TrendingUp } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <CrmSidebar activeSection={activeSection} onNavigate={setActiveSection} />

      <main className="ml-[68px] flex-1 px-8 py-6">
        <CrmHeader title="Workspace" />

        {/* Stat cards — 3 columns like Flowly */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <StatCard
            icon={Store}
            label="Партнёры"
            value="5"
            change="+2"
            changePositive
            delay={0}
          />
          <StatCard
            icon={Package}
            label="Каталог"
            value="247"
            change="+12"
            changePositive
            delay={80}
          />
          <StatCard
            icon={FileText}
            label="Заявки"
            value="94"
            change="+18%"
            changePositive
            delay={160}
          />
        </div>

        {/* Two columns: leads + partners */}
        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <RecentLeads />
          <PartnersOverview />
        </div>
      </main>
    </div>
  );
};

export default Index;
