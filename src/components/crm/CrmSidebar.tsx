import { cn } from "@/lib/utils";
import logoFull from "@/assets/logo.png";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
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
  { icon: LayoutDashboard, id: "dashboard", label: "Дашборд" },
  { icon: Users, id: "partners", label: "Партнёры" },
  { icon: Package, id: "catalog", label: "Каталог" },
  { icon: FileText, id: "leads", label: "Заявки" },
  { icon: BarChart3, id: "analytics", label: "Аналитика" },
];

interface CrmSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
  expanded: boolean;
  onToggleExpand: () => void;
}

export function CrmSidebar({ activeSection, onNavigate, expanded, onToggleExpand }: CrmSidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleNavigate = (id: string) => {
    onNavigate(id);
    setMobileOpen(false);
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
          <div
            className="absolute inset-0 bg-foreground/20 animate-fade-in"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 h-full w-[240px] bg-sidebar shadow-xl animate-slide-in-left flex flex-col">
            <div className="flex flex-col flex-1 py-5 px-3">
              <div className="flex items-center justify-between mb-6 px-2">
                <img src={logoFull} alt="Brandoors" className="h-5 object-contain" />
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent active:scale-95 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-0.5 flex-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 active:scale-[0.97]",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={() => handleNavigate("settings")}
                className={cn(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors duration-150 active:scale-[0.97]",
                  activeSection === "settings"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                Настройки
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside
        className={cn(
          "hidden sm:flex fixed left-0 top-0 z-40 h-screen flex-col bg-sidebar transition-[width] duration-200 ease-out",
          expanded ? "w-[220px]" : "w-[68px]"
        )}
      >
        {/* Divider line */}
        <div className="absolute right-0 top-0 h-full w-px bg-sidebar-border" />

        {/* Header: Logo + collapse toggle */}
        <div className={cn(
          "flex items-center h-16 px-3 shrink-0",
          expanded ? "justify-between" : "justify-center"
        )}>
          <div className={cn(
            "flex items-center overflow-hidden",
            expanded ? "w-auto" : "w-10 justify-center"
          )}>
            {expanded ? (
              <img src={logoFull} alt="Brandoors" className="h-9 object-contain" />
            ) : (
              <img src={logoFull} alt="B" className="h-7 w-auto object-contain" />
            )}
          </div>
          <button
            onClick={onToggleExpand}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors active:scale-95"
          >
            {expanded ? (
              <ChevronsLeft className="h-4 w-4" />
            ) : (
              <ChevronsRight className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Nav items */}
        <nav className={cn(
          "flex flex-1 flex-col gap-0.5 px-3 pt-2",
          !expanded && "items-center"
        )}>
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={!expanded ? item.label : undefined}
                className={cn(
                  "relative flex items-center rounded-lg transition-colors duration-150 active:scale-[0.97]",
                  expanded ? "gap-3 px-3 py-2.5 w-full" : "h-10 w-10 justify-center",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
                {expanded && (
                  <span className="text-sm font-medium whitespace-nowrap">{item.label}</span>
                )}
                {/* Tooltip when collapsed */}
                {!expanded && (
                  <span className="absolute left-full ml-3 rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-primary-foreground opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-lg z-50 group">
                    {item.label}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <div className={cn("px-3 pb-5", !expanded && "flex justify-center")}>
          <button
            onClick={() => onNavigate("settings")}
            title={!expanded ? "Настройки" : undefined}
            className={cn(
              "relative flex items-center rounded-lg transition-colors duration-150 active:scale-[0.97]",
              expanded ? "gap-3 px-3 py-2.5 w-full" : "h-10 w-10 justify-center",
              activeSection === "settings"
                ? "bg-sidebar-primary text-sidebar-primary-foreground"
                : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            )}
          >
            <Settings className="h-[18px] w-[18px] shrink-0" strokeWidth={1.8} />
            {expanded && (
              <span className="text-sm font-medium whitespace-nowrap">Настройки</span>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
