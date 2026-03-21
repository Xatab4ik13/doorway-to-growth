import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
  Menu,
  X,
  DoorOpen,
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
}

export function CrmSidebar({ activeSection, onNavigate }: CrmSidebarProps) {
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
        className="fixed left-3 top-3 z-50 flex h-10 w-10 items-center justify-center rounded-xl bg-card border border-border text-foreground shadow-card sm:hidden active:scale-95 transition-transform"
      >
        <Menu className="h-5 w-5" />
      </button>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 sm:hidden">
          <div className="absolute inset-0 bg-foreground/30 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[220px] bg-sidebar shadow-xl animate-slide-in-left flex flex-col">
            {/* Door pattern background */}
            <div className="absolute inset-0 door-pattern opacity-[0.04] pointer-events-none" />
            <div className="relative flex flex-col flex-1 py-5 px-3">
              <div className="flex items-center justify-between mb-6 px-1">
                <div className="flex items-center gap-2.5">
                  <div className="group flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent transition-colors">
                    <DoorOpen className="h-5 w-5 text-sidebar-primary transition-transform duration-300 group-hover:rotate-[-12deg]" strokeWidth={1.8} />
                  </div>
                  <span className="text-sm font-bold text-sidebar-accent-foreground tracking-tight">Brandoors</span>
                </div>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg text-sidebar-foreground hover:bg-sidebar-accent active:scale-95 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <nav className="flex flex-col gap-1 flex-1">
                {navItems.map((item) => {
                  const isActive = activeSection === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => handleNavigate(item.id)}
                      className={cn(
                        "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]",
                        isActive
                          ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-card"
                          : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                      )}
                    >
                      <item.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                      {item.label}
                    </button>
                  );
                })}
              </nav>
              <button
                onClick={() => handleNavigate("settings")}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 active:scale-[0.97]",
                  activeSection === "settings"
                    ? "bg-sidebar-primary text-sidebar-primary-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
                Настройки
              </button>
            </div>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden sm:flex fixed left-0 top-0 z-40 h-screen w-[68px] flex-col items-center bg-sidebar py-5 overflow-hidden">
        {/* Door pattern background */}
        <div className="absolute inset-0 door-pattern opacity-[0.04] pointer-events-none" />
        
        {/* Decorative vertical line — like a door frame edge */}
        <div className="absolute right-0 top-0 h-full w-px bg-sidebar-border" />
        
        {/* Logo with hover animation */}
        <div className="relative mb-8 group">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sidebar-accent transition-all duration-300 group-hover:shadow-[0_0_20px_hsl(220_14%_40%/0.3)]">
            <DoorOpen className="h-5 w-5 text-sidebar-primary transition-transform duration-300 group-hover:rotate-[-12deg]" strokeWidth={1.8} />
          </div>
        </div>

        {/* Nav icons */}
        <nav className="relative flex flex-1 flex-col items-center gap-1">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={item.label}
                className={cn(
                  "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
                  "active:scale-95",
                  isActive
                    ? "bg-sidebar-primary text-sidebar-primary-foreground shadow-[0_2px_8px_hsl(220_20%_10%/0.3)]"
                    : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                {/* Active indicator bar */}
                {isActive && (
                  <span className="absolute -left-[1px] top-1/2 -translate-y-1/2 h-5 w-[3px] rounded-r-full bg-sidebar-primary animate-scale-in" />
                )}
                <span className="absolute left-full ml-3 rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-primary-foreground opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-lg z-50">
                  {item.label}
                </span>
              </button>
            );
          })}
        </nav>

        {/* Settings */}
        <button
          onClick={() => onNavigate("settings")}
          title="Настройки"
          className={cn(
            "relative group flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
            "active:scale-95",
            activeSection === "settings"
              ? "bg-sidebar-primary text-sidebar-primary-foreground"
              : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
          )}
        >
          <Settings className="h-[18px] w-[18px] transition-transform duration-300 group-hover:rotate-90" strokeWidth={1.8} />
          <span className="absolute left-full ml-3 rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-primary-foreground opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-lg z-50">
            Настройки
          </span>
        </button>
      </aside>
    </>
  );
}
