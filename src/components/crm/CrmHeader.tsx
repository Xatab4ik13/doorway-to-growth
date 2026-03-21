import { useState, useRef, useEffect } from "react";
import { Search, Bell, ChevronRight, LogOut, Settings, User, X } from "lucide-react";
import { useCrmNavigation } from "./CrmNavigationContext";

interface CrmHeaderProps {
  title: string;
  breadcrumbs?: { label: string; onClick?: () => void }[];
  onNavigate?: (section: string) => void;
}

const notifications = [
  { id: 1, text: "Новая заявка от Алексея Петрова", time: "5 мин назад", unread: true },
  { id: 2, text: "Партнёр Митино обновил контакты", time: "32 мин назад", unread: true },
  { id: 3, text: "Товар Milano Premium добавлен в каталог", time: "1 ч назад", unread: false },
  { id: 4, text: "Партнёр Сокольники деактивирован", time: "3 ч назад", unread: false },
];

export function CrmHeader({ title, breadcrumbs, onNavigate }: CrmHeaderProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus();
  }, [searchOpen]);

  return (
    <header className="flex items-center justify-between pb-6 gap-4">
      {/* Left: breadcrumbs + title */}
      <div className="min-w-0">
        {breadcrumbs && breadcrumbs.length > 0 && (
          <div className="flex items-center gap-1 mb-1">
            {breadcrumbs.map((crumb, i) => (
              <div key={i} className="flex items-center gap-1">
                {i > 0 && <ChevronRight className="h-3 w-3 text-muted-foreground/50" />}
                <button
                  onClick={crumb.onClick}
                  className="text-[11px] text-muted-foreground hover:text-foreground transition-colors"
                  disabled={!crumb.onClick}
                >
                  {crumb.label}
                </button>
              </div>
            ))}
            <ChevronRight className="h-3 w-3 text-muted-foreground/50" />
            <span className="text-[11px] text-foreground font-medium">{title}</span>
          </div>
        )}
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      {/* Right: search + notifications + avatar */}
      <div className="flex items-center gap-2 shrink-0">
        {/* Global search */}
        <div className="relative">
          {searchOpen ? (
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={searchRef}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Поиск по CRM..."
                  className="h-9 w-64 rounded-xl border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-all"
                />
              </div>
              <button
                onClick={() => { setSearchOpen(false); setSearchQuery(""); }}
                className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={() => setSearchOpen(true)}
              className="flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
            >
              <Search className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Notifications */}
        <div className="relative" ref={notifRef}>
          <button
            onClick={() => { setNotifOpen(!notifOpen); setUserOpen(false); }}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
          >
            <Bell className="h-4 w-4" strokeWidth={1.8} />
            {unreadCount > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[9px] font-bold text-destructive-foreground">
                {unreadCount}
              </span>
            )}
          </button>

          {notifOpen && (
            <div className="absolute right-0 top-full mt-2 w-80 rounded-2xl border border-border bg-card shadow-lg z-50 overflow-hidden animate-scale-in">
              <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                <span className="text-sm font-semibold text-foreground">Уведомления</span>
                <span className="text-[10px] font-medium text-muted-foreground">{unreadCount} новых</span>
              </div>
              <div className="max-h-72 overflow-y-auto">
                {notifications.map((n) => (
                  <div
                    key={n.id}
                    className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer ${
                      n.unread ? "bg-muted/20" : ""
                    }`}
                  >
                    {n.unread && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-destructive" />}
                    {!n.unread && <span className="mt-1.5 h-2 w-2 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm text-foreground leading-snug">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t border-border px-4 py-2.5">
                <button
                  onClick={() => { setNotifOpen(false); onNavigate?.("notifications"); }}
                  className="text-xs font-medium text-muted-foreground hover:text-foreground transition-colors w-full text-center"
                >
                  Все уведомления
                </button>
              </div>
            </div>
          )}
        </div>

        {/* User menu */}
        <div className="relative" ref={userRef}>
          <button
            onClick={() => { setUserOpen(!userOpen); setNotifOpen(false); }}
            className="flex items-center gap-2 rounded-xl px-1.5 py-1 hover:bg-muted transition-colors active:scale-[0.97]"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-xs font-semibold text-primary-foreground">
              АД
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-foreground leading-none">Александр Д.</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Администратор</p>
            </div>
          </button>

          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-card shadow-lg z-50 overflow-hidden animate-scale-in">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Александр Дорохов</p>
                <p className="text-[11px] text-muted-foreground">admin@brandoors.ru</p>
              </div>
              <div className="py-1">
                <button
                  onClick={() => { setUserOpen(false); onNavigate?.("profile"); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors"
                >
                  <User className="h-4 w-4 text-muted-foreground" />
                  Профиль
                </button>
                <button
                  onClick={() => { setUserOpen(false); onNavigate?.("settings"); }}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors"
                >
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Настройки
                </button>
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors">
                  <Settings className="h-4 w-4 text-muted-foreground" />
                  Настройки
                </button>
              </div>
              <div className="border-t border-border py-1">
                <button className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-destructive hover:bg-destructive/5 transition-colors">
                  <LogOut className="h-4 w-4" />
                  Выйти
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
