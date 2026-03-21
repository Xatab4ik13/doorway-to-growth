import { useState } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { StatCard } from "@/components/crm/StatCard";
import { RecentLeads } from "@/components/crm/RecentLeads";
import { SchedulePanel } from "@/components/crm/SchedulePanel";
import { Phone, Mail, PenLine } from "lucide-react";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  return (
    <div className="flex min-h-screen bg-background">
      <CrmSidebar activeSection={activeSection} onNavigate={setActiveSection} />

      {/* Main content area */}
      <div className="ml-[68px] flex flex-1">
        {/* Left: main */}
        <main className="flex-1 px-8 py-6 min-w-0">
          <CrmHeader title="Workspace" />

          {/* Stat cards — 3 columns like Flowly */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            <StatCard
              icon={Phone}
              label="Звонки"
              value="2,556"
              change="+32"
              changePositive
              delay={0}
            />
            <StatCard
              icon={Mail}
              label="Email"
              value="2,244"
              change="+15"
              changePositive
              delay={80}
            />
            <StatCard
              icon={PenLine}
              label="Просрочено"
              value="1,244"
              change="-28"
              changePositive={false}
              delay={160}
            />
          </div>

          {/* Leads section */}
          <div className="mt-8">
            <RecentLeads />
          </div>
        </main>

        {/* Right panel: Schedule */}
        <aside className="hidden xl:block w-[320px] shrink-0 border-l border-border px-5 py-6">
          <SchedulePanel />
        </aside>
      </div>
    </div>
  );
};

export default Index;
