import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  Users,
  FileText,
  BarChart3,
  Settings,
} from "lucide-react";

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
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-[68px] flex-col items-center border-r border-sidebar-border bg-sidebar py-5">
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
            </button>
          );
        })}
      </nav>

      {/* Settings */}
      <button
        onClick={() => onNavigate("settings")}
        title="Настройки"
        className={cn(
          "flex h-10 w-10 items-center justify-center rounded-xl transition-all duration-200",
          "active:scale-95",
          activeSection === "settings"
            ? "bg-foreground text-primary-foreground"
            : "text-muted-foreground hover:bg-accent hover:text-foreground"
        )}
      >
        <Settings className="h-[18px] w-[18px]" strokeWidth={1.8} />
      </button>
    </aside>
  );
}
