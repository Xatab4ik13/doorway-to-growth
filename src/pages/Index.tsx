import { useState } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { DashboardPage } from "@/components/crm/pages/DashboardPage";
import { PartnersPage } from "@/components/crm/pages/PartnersPage";
import { CatalogPage } from "@/components/crm/pages/CatalogPage";
import { LeadsPage } from "@/components/crm/pages/LeadsPage";
import { AnalyticsPage } from "@/components/crm/pages/AnalyticsPage";
import { SettingsPage } from "@/components/crm/pages/SettingsPage";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");

  const renderPage = () => {
    switch (activeSection) {
      case "dashboard":
        return <DashboardPage />;
      case "partners":
        return <PartnersPage />;
      case "catalog":
        return <CatalogPage />;
      case "leads":
        return <LeadsPage />;
      case "analytics":
        return <AnalyticsPage />;
      case "settings":
        return <SettingsPage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <CrmSidebar activeSection={activeSection} onNavigate={setActiveSection} />
      <main className="ml-[68px] flex-1 min-w-0">
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
