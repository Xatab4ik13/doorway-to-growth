import { useState, useRef, useEffect } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { DashboardPage } from "@/components/crm/pages/DashboardPage";
import { PartnersPage } from "@/components/crm/pages/PartnersPage";
import { CatalogPage } from "@/components/crm/pages/CatalogPage";
import { LeadsPage } from "@/components/crm/pages/LeadsPage";
import { AnalyticsPage } from "@/components/crm/pages/AnalyticsPage";
import { SettingsPage } from "@/components/crm/pages/SettingsPage";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [transitioning, setTransitioning] = useState(false);
  const prevSection = useRef(activeSection);

  const handleNavigate = (section: string) => {
    if (section === activeSection) return;
    setTransitioning(true);
    setTimeout(() => {
      prevSection.current = section;
      setActiveSection(section);
      setTransitioning(false);
    }, 180);
  };

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
      <CrmSidebar activeSection={activeSection} onNavigate={handleNavigate} />
      <main
        className={`sm:ml-[68px] flex-1 min-w-0 pt-14 sm:pt-0 transition-all duration-200 ease-out ${
          transitioning ? "opacity-0 translate-x-3 scale-[0.998]" : "opacity-100 translate-x-0 scale-100"
        }`}
      >
        {renderPage()}
      </main>
    </div>
  );
};

export default Index;
