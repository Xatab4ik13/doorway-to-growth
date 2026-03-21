import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { User, Shield, Bell, Palette, Globe, Lock, ChevronRight, LogOut } from "lucide-react";

const tabs = [
  { id: "profile", label: "Профиль", icon: User },
  { id: "security", label: "Безопасность", icon: Lock },
  { id: "notifications", label: "Уведомления", icon: Bell },
  { id: "users", label: "Пользователи", icon: Shield },
  { id: "appearance", label: "Внешний вид", icon: Palette },
  { id: "system", label: "Система", icon: Globe },
];

const users = [
  { name: "Александр Дорохов", email: "admin@brandoors.ru", role: "Администратор", active: true },
  { name: "Иван Смирнов", email: "marjino@brandoors.ru", role: "Партнёр", active: true },
  { name: "Мария Козлова", email: "teply-stan@brandoors.ru", role: "Партнёр", active: true },
  { name: "Алексей Волков", email: "mitino@brandoors.ru", role: "Партнёр", active: true },
  { name: "Дмитрий Фёдоров", email: "sokolniki@brandoors.ru", role: "Партнёр", active: false },
];

export function SettingsPage() {
  const [activeTab, setActiveTab] = useState("profile");

  return (
    <div className="px-8 py-6">
      <CrmHeader title="Настройки" />

      <div className="flex gap-8 opacity-0 animate-fade-up">
        {/* Sidebar tabs */}
        <div className="w-52 shrink-0 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors active:scale-[0.98] ${
                activeTab === tab.id
                  ? "bg-foreground text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              }`}
            >
              <tab.icon className="h-4 w-4" strokeWidth={1.8} />
              {tab.label}
            </button>
          ))}
          <div className="pt-4">
            <button className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors active:scale-[0.98]">
              <LogOut className="h-4 w-4" strokeWidth={1.8} />
              Выйти
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {activeTab === "profile" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Профиль</h3>
              <div className="flex items-center gap-5 mb-8">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-lg font-semibold text-foreground">
                  АД
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">Александр Дорохов</p>
                  <p className="text-sm text-muted-foreground">admin@brandoors.ru</p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Имя</label>
                  <input
                    defaultValue="Александр"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Фамилия</label>
                  <input
                    defaultValue="Дорохов"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
                  <input
                    defaultValue="admin@brandoors.ru"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Телефон</label>
                  <input
                    defaultValue="+7 (926) 000-00-00"
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                  />
                </div>
              </div>
              <div className="mt-6 flex justify-end">
                <button className="h-9 px-5 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors">
                  Сохранить
                </button>
              </div>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Безопасность</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Текущий пароль</label>
                  <input type="password" className="h-10 w-full max-w-sm rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Новый пароль</label>
                  <input type="password" className="h-10 w-full max-w-sm rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Подтверждение</label>
                  <input type="password" className="h-10 w-full max-w-sm rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
                </div>
              </div>
              <div className="mt-6">
                <button className="h-9 px-5 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors">
                  Обновить пароль
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Уведомления</h3>
              <div className="space-y-4">
                {[
                  { label: "Новые заявки", desc: "Получать уведомления о новых заявках со всех сайтов" },
                  { label: "Статус партнёра", desc: "Уведомления когда партнёр меняет статус" },
                  { label: "Изменения каталога", desc: "Уведомления при добавлении/удалении товаров" },
                  { label: "Email отчёты", desc: "Еженедельная сводка по почте" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <button className="relative h-6 w-11 rounded-full bg-foreground transition-colors active:scale-95">
                      <span className="absolute right-0.5 top-0.5 h-5 w-5 rounded-full bg-primary-foreground shadow-sm transition-transform" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Пользователи</h3>
                <button className="h-8 px-3.5 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors">
                  Добавить
                </button>
              </div>
              <div className="divide-y divide-border">
                {users.map((u) => (
                  <div key={u.email} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                      {u.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-foreground">{u.name}</p>
                      <p className="text-[11px] text-muted-foreground">{u.email}</p>
                    </div>
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                      u.role === "Администратор" ? "bg-foreground text-primary-foreground" : "bg-muted text-muted-foreground"
                    }`}>
                      {u.role}
                    </span>
                    <span className={`h-2.5 w-2.5 rounded-full ${u.active ? "bg-success" : "bg-muted-foreground/30"}`} />
                    <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Внешний вид</h3>
              <p className="text-sm text-muted-foreground">Настройки темы и оформления будут доступны в следующем обновлении.</p>
            </div>
          )}

          {activeTab === "system" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Система</h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Версия</span>
                  <span className="font-medium text-foreground tabular-nums">1.0.0</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Партнёров</span>
                  <span className="font-medium text-foreground tabular-nums">5</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-border">
                  <span className="text-muted-foreground">Товаров в каталоге</span>
                  <span className="font-medium text-foreground tabular-nums">247</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Последнее обновление</span>
                  <span className="font-medium text-foreground">21.03.2026</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
