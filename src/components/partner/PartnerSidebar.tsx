import { cn } from "@/lib/utils";
import logoFull from "@/assets/logo.png";
import {
  FileText,
  Layout,
  Tag,
  Megaphone,
  Settings,
  Menu,
  X,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useState } from "react";

interface NavItem {
  icon: React.ElementType;
  id: string;
  label: string;
}

const navItems: NavItem[] = [
  { icon: FileText, id: "leads", label: "Мои заявки" },
  { icon: Layout, id: "content", label: "Контент сайта" },
  { icon: Tag, id: "promotions", label: "Мои акции" },
  { icon: Megaphone, id: "announcements", label: "Объявления" },
];

interface PartnerSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function PartnerSidebar({ activeSection, onNavigate, expanded, onToggleExpand }: PartnerSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
  };

  const NavButton = ({ item, mobile = false }: { item: NavItem; mobile?: boolean }) => {
    const isActive = activeSection === item.id;
    return (
      <button
        onClick={() => (mobile ? handleNavigate(item.id) : onNavigate(item.id))}
        title={!expanded && !mobile ? item.label : undefined}
        className={cn(
          "relative flex items-center rounded-lg transition-colors duration-150 active:scale-[0.97]",
          mobile || expanded ? "gap-3 px-3 py-2.5 w-full" : "h-10 w-10 justify-center",
          isActive
            ? "bg-sidebar-primary text-sidebar-primary-foreground"
            : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        )}
      >
        <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
        {(mobile || expanded) && (
          <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
        )}
      </button>
    );
  };

  return (
    <>
      {/* Mobile hamburger */}
      <button
        onClick={() => setMobileOpen(true)}
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground shadow-sm sm:hidden active:scale-95 transition-transform"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-foreground/20 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[240px] bg-sidebar shadow-xl animate-slide-in-left flex flex-col">
            <div className="flex flex-col flex-1 py-5 px-3">
              <div className="flex items-center justify-between mb-6 px-2">
                <img src={logoFull} alt="Brandoors" className="h-5 object-contain" />
                <button onClick={() => setMobileOpen(false)} className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent active:scale-95 transition-colors">
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="mb-4 mx-2 px-3 py-2 rounded-lg bg-sidebar-accent/50">
                <p className="text-xs text-sidebar-accent-foreground font-medium">Партнёр</p>
                <p className="text-[11px] text-sidebar-foreground mt-0.5">Салон дверей «Митино»</p>
              </div>
              <nav className="flex flex-col gap-0.5 flex-1">
                {navItems.map((item) => <NavButton key={item.id} item={item} mobile />)}
              </nav>
              <NavButton item={{ icon: Settings, id: "settings", label: "Настройки" }} mobile />
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className={cn(
        "hidden sm:flex fixed left-0 top-0 z-40 h-screen flex-col bg-sidebar transition-[width] duration-200 ease-out",
        expanded ? "w-[220px]" : "w-[68px]"
      )}>
        <div className="absolute right-0 top-0 h-full w-px bg-sidebar-border" />

        {/* Header */}
        <div className={cn("flex items-center h-16 px-3 shrink-0", expanded ? "justify-between" : "justify-center")}>
          <div className={cn("flex items-center overflow-hidden", expanded ? "w-auto" : "w-10 justify-center")}>
            {expanded ? (
              <img src={logoFull} alt="Brandoors" className="h-12 object-contain" />
            ) : (
              <img src={logoFull} alt="B" className="h-9 w-auto object-contain" />
            )}
          </div>
          <button onClick={onToggleExpand} className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors active:scale-95">
            {expanded ? <ChevronsLeft className="h-4 w-4" /> : <ChevronsRight className="h-4 w-4" />}
          </button>
        </div>

        {/* Partner badge */}
        {expanded && (
          <div className="mx-3 mb-2 px-3 py-2 rounded-lg bg-sidebar-accent/50">
            <p className="text-xs text-sidebar-accent-foreground font-medium">Партнёр</p>
            <p className="text-[11px] text-sidebar-foreground mt-0.5">Салон дверей «Митино»</p>
          </div>
        )}

        {/* Nav */}
        <nav className={cn("flex flex-1 flex-col gap-0.5 px-3 pt-2", !expanded && "items-center")}>
          {navItems.map((item) => <NavButton key={item.id} item={item} />)}
        </nav>

        {/* Settings */}
        <div className={cn("px-3 pb-5", !expanded && "flex justify-center")}>
          <NavButton item={{ icon: Settings, id: "settings", label: "Настройки" }} />
        </div>
      </aside>
    </>
  );
}
