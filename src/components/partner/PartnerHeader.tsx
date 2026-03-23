import { useState, useRef, useEffect } from "react";
import { Bell, LogOut, Settings, User, ChevronRight } from "lucide-react";

interface PartnerHeaderProps {
  title: string;
  onNavigate: (section: string) => void;
}

const notifications = [
  { id: 1, text: "Новая заявка от клиента Петров И.", time: "10 мин назад", unread: true },
  { id: 2, text: "Объявление от Brandoors: новая коллекция", time: "2 ч назад", unread: true },
  { id: 3, text: "Акция «Весенняя скидка» истекает через 3 дня", time: "5 ч назад", unread: false },
];

export function PartnerHeader({ title, onNavigate }: PartnerHeaderProps) {
  const [notifOpen, setNotifOpen] = useState(false);
  const [userOpen, setUserOpen] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);
  const userRef = useRef<HTMLDivElement>(null);

  const unreadCount = notifications.filter((n) => n.unread).length;

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
      if (userRef.current && !userRef.current.contains(e.target as Node)) setUserOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <header className="flex items-center justify-between pb-4 sm:pb-6 gap-2 sm:gap-4">
      <div className="min-w-0">
        <h1 className="text-lg font-semibold text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-1 sm:gap-2 shrink-0">
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
                  <div key={n.id} className={`flex items-start gap-3 px-4 py-3 hover:bg-muted/40 transition-colors cursor-pointer ${n.unread ? "bg-muted/20" : ""}`}>
                    {n.unread ? <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-destructive" /> : <span className="mt-1.5 h-2 w-2 shrink-0" />}
                    <div className="min-w-0">
                      <p className="text-sm text-foreground leading-snug">{n.text}</p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">{n.time}</p>
                    </div>
                  </div>
                ))}
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
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-xs font-semibold text-primary-foreground">
              МТ
            </div>
            <div className="hidden sm:block text-left">
              <p className="text-xs font-medium text-foreground leading-none">Салон «Митино»</p>
              <p className="text-[10px] text-muted-foreground leading-none mt-0.5">Партнёр</p>
            </div>
          </button>

          {userOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 rounded-2xl border border-border bg-card shadow-lg z-50 overflow-hidden animate-scale-in">
              <div className="px-4 py-3 border-b border-border">
                <p className="text-sm font-medium text-foreground">Салон дверей «Митино»</p>
                <p className="text-[11px] text-muted-foreground">partner@mitino.ru</p>
              </div>
              <div className="py-1">
                <button onClick={() => { setUserOpen(false); onNavigate("settings"); }} className="flex w-full items-center gap-3 px-4 py-2.5 text-sm text-foreground hover:bg-muted/40 transition-colors">
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
