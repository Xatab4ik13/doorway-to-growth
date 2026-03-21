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
          <div className="absolute inset-0 bg-foreground/20 animate-fade-in" onClick={() => setMobileOpen(false)} />
          <aside className="absolute left-0 top-0 h-full w-[220px] bg-sidebar border-r border-sidebar-border shadow-xl animate-slide-in-left flex flex-col py-5 px-3">
            <div className="flex items-center justify-between mb-6 px-1">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
                <span className="text-sm font-bold text-primary-foreground tracking-tight">B</span>
              </div>
              <button
                onClick={() => setMobileOpen(false)}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
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
                        ? "bg-foreground text-primary-foreground shadow-card"
                        : "text-muted-foreground hover:bg-accent hover:text-foreground"
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
                  ? "bg-foreground text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
              Настройки
            </button>
          </aside>
        </div>
      )}

      {/* Desktop sidebar */}
      <aside className="hidden sm:flex fixed left-0 top-0 z-40 h-screen w-[68px] flex-col items-center border-r border-sidebar-border bg-sidebar py-5">
        {/* Logo */}
        <div className="mb-8 flex h-10 w-10 items-center justify-center rounded-xl bg-foreground">
          <span className="text-sm font-bold text-primary-foreground tracking-tight">B</span>
        </div>

        {/* Nav icons */}
        <nav className="flex flex-1 flex-col items-center gap-1">
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
                    ? "bg-foreground text-primary-foreground shadow-card"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <item.icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
                {/* Tooltip */}
                <span className="absolute left-full ml-3 rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-primary-foreground opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-lg">
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
            "group relative flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
            "active:scale-95",
            activeSection === "settings"
              ? "bg-foreground text-primary-foreground"
              : "text-muted-foreground hover:bg-accent hover:text-foreground"
          )}
        >
          <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
          <span className="absolute left-full ml-3 rounded-lg bg-foreground px-2.5 py-1 text-xs font-medium text-primary-foreground opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap shadow-lg">
            Настройки
          </span>
        </button>
      </aside>
    </>
  );
}
