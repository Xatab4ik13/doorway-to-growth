import { useState, useRef } from "react";
import { PartnerSidebar } from "@/components/partner/PartnerSidebar";
import { PartnerLeadsPage } from "@/components/partner/pages/PartnerLeadsPage";
import { PartnerContentPage } from "@/components/partner/pages/PartnerContentPage";
import { PartnerPromotionsPage } from "@/components/partner/pages/PartnerPromotionsPage";
import { PartnerAnnouncementsPage } from "@/components/partner/pages/PartnerAnnouncementsPage";
import { PartnerSettingsPage } from "@/components/partner/pages/PartnerSettingsPage";

const Partner = () => {
  const [activeSection, setActiveSection] = useState("leads");
  const [transitioning, setTransitioning] = useState(false);
  const [sidebarExpanded, setSidebarExpanded] = useState(false);

  const handleNavigate = (section: string) => {
    if (section === activeSection) return;
    setTransitioning(true);
    setTimeout(() => {
      setActiveSection(section);
      setTransitioning(false);
    }, 150);
  };

  const renderPage = () => {
    switch (activeSection) {
      case "leads":
        return <PartnerLeadsPage onNavigate={handleNavigate} />;
      case "content":
        return <PartnerContentPage onNavigate={handleNavigate} />;
      case "promotions":
        return <PartnerPromotionsPage onNavigate={handleNavigate} />;
      case "announcements":
        return <PartnerAnnouncementsPage onNavigate={handleNavigate} />;
      case "settings":
        return <PartnerSettingsPage onNavigate={handleNavigate} />;
      default:
        return <PartnerLeadsPage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-background">
      <PartnerSidebar
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
  );
};

export default Partner;
