import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  Store,
  FileText,
  BarChart3,
  Settings,
  ChevronLeft,
  LogOut,
} from "lucide-react";

interface NavItem {
  icon: React.ElementType;
  label: string;
  id: string;
}

const mainNav: NavItem[] = [
  { icon: LayoutDashboard, label: "Дашборд", id: "dashboard" },
  { icon: Package, label: "Каталог", id: "catalog" },
  { icon: Store, label: "Партнёры", id: "partners" },
  { icon: FileText, label: "Заявки", id: "leads" },
  { icon: BarChart3, label: "Аналитика", id: "analytics" },
];

const bottomNav: NavItem[] = [
  { icon: Settings, label: "Настройки", id: "settings" },
];

interface CrmSidebarProps {
  activeSection: string;
  onNavigate: (section: string) => void;
}

export function CrmSidebar({ activeSection, onNavigate }: CrmSidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-sidebar-border bg-sidebar transition-all duration-300",
        collapsed ? "w-[72px]" : "w-[240px]"
      )}
    >
      {/* Logo */}
      <div className="flex h-16 items-center gap-3 px-5">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-foreground">
          <span className="text-sm font-bold text-card">B</span>
        </div>
        {!collapsed && (
          <span className="text-base font-semibold tracking-tight text-foreground">
            Brandoors
          </span>
        )}
      </div>

      {/* Main nav */}
      <nav className="mt-4 flex flex-1 flex-col gap-1 px-3">
        {mainNav.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                "active:scale-[0.97]",
                isActive
                  ? "bg-foreground text-card shadow-card"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}
      </nav>

      {/* Bottom nav */}
      <div className="flex flex-col gap-1 px-3 pb-4">
        {bottomNav.map((item) => {
          const isActive = activeSection === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onNavigate(item.id)}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-150",
                "active:scale-[0.97]",
                isActive
                  ? "bg-foreground text-card shadow-card"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <item.icon className="h-[18px] w-[18px] shrink-0" />
              {!collapsed && <span>{item.label}</span>}
            </button>
          );
        })}

        <button
          onClick={() => setCollapsed(!collapsed)}
          className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-sidebar-foreground transition-all duration-150 hover:bg-sidebar-accent active:scale-[0.97]"
        >
          <ChevronLeft
            className={cn(
              "h-[18px] w-[18px] shrink-0 transition-transform duration-300",
              collapsed && "rotate-180"
            )}
          />
          {!collapsed && <span>Свернуть</span>}
        </button>
      </div>
    </aside>
  );
}
