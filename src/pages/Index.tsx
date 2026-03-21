import { useState, useRef } from "react";
import { CrmSidebar } from "@/components/crm/CrmSidebar";
import { CrmNavigationProvider } from "@/components/crm/CrmNavigationContext";
import { DashboardPage } from "@/components/crm/pages/DashboardPage";
import { PartnersPage } from "@/components/crm/pages/PartnersPage";
import { CatalogPage } from "@/components/crm/pages/CatalogPage";
import { LeadsPage } from "@/components/crm/pages/LeadsPage";
import { AnalyticsPage } from "@/components/crm/pages/AnalyticsPage";
import { SettingsPage } from "@/components/crm/pages/SettingsPage";
import { NotificationsPage } from "@/components/crm/pages/NotificationsPage";
import { ProfilePage } from "@/components/crm/pages/ProfilePage";

const Index = () => {
  const [activeSection, setActiveSection] = useState("dashboard");
  const [transitioning, setTransitioning] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);
  const prevSection = useRef(activeSection);

  const handleNavigate = (section: string) => {
    if (section === activeSection) return;
    setTransitioning(true);
    setTimeout(() => {
      prevSection.current = section;
      setActiveSection(section);
      setTransitioning(false);
    }, 150);
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
      case "notifications":
        return <NotificationsPage />;
      case "profile":
        return <ProfilePage />;
      default:
        return <DashboardPage />;
    }
  };

  return (
    <CrmNavigationProvider value={{ navigate: handleNavigate }}>
      <div className="flex min-h-screen bg-background">
        <CrmSidebar
          activeSection={activeSection}
          onNavigate={handleNavigate}
          expanded={sidebarExpanded}
          onToggleExpand={() => setSidebarExpanded(!sidebarExpanded)}
        />
        <main
          className={`flex-1 min-w-0 pt-14 sm:pt-0 transition-all duration-200 ease-out ${
            sidebarExpanded ? "sm:ml-[220px]" : "sm:ml-[68px]"
          } ${transitioning ? "opacity-0" : "opacity-100"}`}
        >
          {renderPage()}
        </main>
      </div>
    </CrmNavigationProvider>
  );
};

export default Index;
