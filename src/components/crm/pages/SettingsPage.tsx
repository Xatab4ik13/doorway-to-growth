import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { User, Shield, Bell, Palette, Globe, Lock, ChevronRight, LogOut, Moon, Sun } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

const tabs = [
  { id: "profile", label: "Профиль", icon: User },
  { id: "security", label: "Безопасность", icon: Lock },
  { id: "notifications", label: "Уведомления", icon: Bell },
  { id: "users", label: "Пользователи", icon: Shield },
  { id: "appearance", label: "Внешний вид", icon: Palette },
  { id: "system", label: "Система", icon: Globe },
];

function Toggle({ checked, onChange }: { checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 rounded-full transition-colors active:scale-95 ${
        checked ? "bg-foreground" : "bg-muted"
      }`}
    >
      <span
        className={`absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-sm transition-transform ${
          checked ? "left-[22px]" : "left-0.5"
        }`}
      />
    </button>
  );
}

export function SettingsPage() {
  const { user, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));
  const [notifications, setNotifications] = useState({
    newLeads: true,
    partnerStatus: true,
    catalogChanges: false,
    emailReports: true,
  });

  // Real profile data
  const { data: profile } = useQuery({
    queryKey: ["my-profile", user?.id],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("user_id", user!.id)
        .maybeSingle();
      if (error) throw error;
      return data;
    },
    enabled: !!user?.id,
  });

  // Real users list
  const { data: users = [] } = useQuery({
    queryKey: ["all-users"],
    queryFn: async () => {
      const { data: roles, error: rolesErr } = await supabase
        .from("user_roles")
        .select("user_id, role");
      if (rolesErr) throw rolesErr;

      const { data: profiles, error: profErr } = await supabase
        .from("profiles")
        .select("user_id, full_name, phone");
      if (profErr) throw profErr;

      return (roles ?? []).map((r) => {
        const p = profiles?.find((pr) => pr.user_id === r.user_id);
        return {
          name: p?.full_name ?? "Без имени",
          email: "",
          role: r.role === "admin" ? "Администратор" : "Партнёр",
          active: true,
          user_id: r.user_id,
        };
      });
    },
  });

  // System stats
  const { data: systemStats } = useQuery({
    queryKey: ["system-stats"],
    queryFn: async () => {
      const [{ count: partnerCount }, { count: productCount }] = await Promise.all([
        supabase.from("partners").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }),
      ]);
      return { partners: partnerCount ?? 0, products: productCount ?? 0 };
    },
  });

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!newPassword) return;
    if (newPassword !== confirmPassword) {
      toast({ title: "Ошибка", description: "Пароли не совпадают", variant: "destructive" });
      return;
    }
    const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Пароль обновлён" });
      setNewPassword("");
      setConfirmPassword("");
    }
  };

  const toggleDarkMode = (on: boolean) => {
    setDarkMode(on);
    document.documentElement.classList.toggle("dark", on);
    localStorage.setItem("theme", on ? "dark" : "light");
  };

  const fullName = profile?.full_name ?? user?.email ?? "";
  const initials = fullName.split(" ").map((w: string) => w[0]).join("").slice(0, 2).toUpperCase() || "?";

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Настройки" />

      <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 opacity-0 animate-fade-up">
        {/* Sidebar tabs */}
        <div className="w-full sm:w-52 shrink-0 flex sm:flex-col gap-1 overflow-x-auto sm:overflow-visible pb-2 sm:pb-0">
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
            <button
              onClick={() => setLogoutOpen(true)}
              className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors active:scale-[0.98]"
            >
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
                  {initials}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{fullName}</p>
                  <p className="text-sm text-muted-foreground">{user?.email}</p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">Для редактирования профиля перейдите в раздел «Профиль» в меню.</p>
            </div>
          )}

          {activeTab === "security" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Безопасность</h3>
              <div className="space-y-4 max-w-sm">
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Новый пароль</label>
                  <input type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
                </div>
                <div>
                  <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Подтверждение</label>
                  <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                    className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
                </div>
              </div>
              <div className="mt-6">
                <button onClick={handleChangePassword} disabled={!newPassword}
                  className="h-9 px-5 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40">
                  Обновить пароль
                </button>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Уведомления</h3>
              <div className="space-y-4">
                {([
                  { key: "newLeads" as const, label: "Новые заявки", desc: "Получать уведомления о новых заявках со всех сайтов" },
                  { key: "partnerStatus" as const, label: "Статус партнёра", desc: "Уведомления когда партнёр меняет статус" },
                  { key: "catalogChanges" as const, label: "Изменения каталога", desc: "Уведомления при добавлении/удалении товаров" },
                  { key: "emailReports" as const, label: "Email отчёты", desc: "Еженедельная сводка по почте" },
                ]).map((item) => (
                  <div key={item.key} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-foreground">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Toggle
                      checked={notifications[item.key]}
                      onChange={(v) => setNotifications((prev) => ({ ...prev, [item.key]: v }))}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "users" && (
            <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up">
              <div className="flex items-center justify-between px-6 py-4 border-b border-border">
                <h3 className="text-sm font-semibold text-foreground">Пользователи</h3>
              </div>
              <div className="divide-y divide-border">
                {users.length === 0 ? (
                  <div className="px-6 py-8 text-center text-sm text-muted-foreground">Загрузка...</div>
                ) : (
                  users.map((u) => (
                    <div key={u.user_id} className="flex items-center gap-4 px-6 py-3.5 hover:bg-muted/40 transition-colors">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                        {u.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground">{u.name}</p>
                      </div>
                      <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                        u.role === "Администратор" ? "bg-foreground text-primary-foreground" : "bg-muted text-muted-foreground"
                      }`}>
                        {u.role}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {activeTab === "appearance" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Внешний вид</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    {darkMode ? <Moon className="h-4 w-4 text-muted-foreground" /> : <Sun className="h-4 w-4 text-muted-foreground" />}
                    <div>
                      <p className="text-sm font-medium text-foreground">Тёмная тема</p>
                      <p className="text-xs text-muted-foreground">Переключить оформление интерфейса</p>
                    </div>
                  </div>
                  <Toggle checked={darkMode} onChange={toggleDarkMode} />
                </div>
              </div>
            </div>
          )}

          {activeTab === "system" && (
            <div className="rounded-2xl border border-border bg-card p-6 opacity-0 animate-fade-up">
              <h3 className="text-sm font-semibold text-foreground mb-6">Система</h3>
              <div className="space-y-3 text-sm">
                {[
                  { label: "Версия", value: "1.0.0" },
                  { label: "Партнёров", value: String(systemStats?.partners ?? "—") },
                  { label: "Товаров в каталоге", value: String(systemStats?.products ?? "—") },
                ].map((item, i, arr) => (
                  <div key={item.label} className={`flex items-center justify-between py-2 ${i < arr.length - 1 ? "border-b border-border" : ""}`}>
                    <span className="text-muted-foreground">{item.label}</span>
                    <span className="font-medium text-foreground tabular-nums">{item.value}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Logout confirmation */}
      <ConfirmDialog
        open={logoutOpen}
        onClose={() => setLogoutOpen(false)}
        onConfirm={() => signOut()}
        title="Выход из системы"
        description="Вы уверены, что хотите выйти из CRM?"
        confirmLabel="Выйти"
        destructive
      />
    </div>
  );
}
