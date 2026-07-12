import { useState, useEffect } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { Modal } from "@/components/crm/Modal";
import { User, Shield, Bell, Palette, Globe, Lock, LogOut, Moon, Sun, Plus, Trash2, Copy } from "lucide-react";
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

type NotifPrefs = {
  newLeads: boolean;
  partnerStatus: boolean;
  catalogChanges: boolean;
  emailReports: boolean;
};

const DEFAULT_PREFS: NotifPrefs = {
  newLeads: true,
  partnerStatus: true,
  catalogChanges: false,
  emailReports: true,
};

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
  const { user, role, signOut } = useAuth();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState("profile");
  const [logoutOpen, setLogoutOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => document.documentElement.classList.contains("dark"));

  const isAdmin = role === "admin";

  // Profile
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

  // Users + roles + emails via admin endpoint (fallback: use roles table + profiles)
  const { data: users = [], refetch: refetchUsers } = useQuery({
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
          phone: p?.phone ?? "",
          role: r.role,
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

  // ============ NOTIFICATIONS PREFS ============
  const [notifPrefs, setNotifPrefs] = useState<NotifPrefs>(DEFAULT_PREFS);
  useEffect(() => {
    if (profile?.notification_prefs) {
      setNotifPrefs({ ...DEFAULT_PREFS, ...(profile.notification_prefs as any) });
    }
  }, [profile?.notification_prefs]);

  const saveNotifPrefs = useMutation({
    mutationFn: async (next: NotifPrefs) => {
      const { error } = await supabase
        .from("profiles")
        .update({ notification_prefs: next })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["my-profile", user?.id] });
      toast({ title: "Настройки сохранены" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  const handleNotifToggle = (key: keyof NotifPrefs, value: boolean) => {
    const next = { ...notifPrefs, [key]: value };
    setNotifPrefs(next);
    saveNotifPrefs.mutate(next);
  };

  // ============ PASSWORD ============
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleChangePassword = async () => {
    if (!newPassword) return;
    if (newPassword.length < 6) {
      toast({ title: "Ошибка", description: "Минимум 6 символов", variant: "destructive" });
      return;
    }
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

  // ============ USER MANAGEMENT (admin only) ============
  const [inviteOpen, setInviteOpen] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", password: "", full_name: "", role: "partner" as "admin" | "partner" });
  const [inviteResult, setInviteResult] = useState<{ email: string; password: string } | null>(null);
  const [deleteUser, setDeleteUser] = useState<{ user_id: string; name: string } | null>(null);

  const inviteMutation = useMutation({
    mutationFn: async () => {
      if (!inviteForm.email.trim() || !inviteForm.password.trim()) throw new Error("Заполните email и пароль");
      if (inviteForm.password.length < 6) throw new Error("Пароль минимум 6 символов");
      const { data, error } = await supabase.functions.invoke("create-user", {
        body: {
          email: inviteForm.email.trim(),
          password: inviteForm.password,
          full_name: inviteForm.full_name.trim() || inviteForm.email.trim(),
          role: inviteForm.role,
        },
      });
      if (error) throw error;
      if ((data as any)?.error) throw new Error((data as any).error);
      return data;
    },
    onSuccess: () => {
      setInviteResult({ email: inviteForm.email, password: inviteForm.password });
      setInviteForm({ email: "", password: "", full_name: "", role: "partner" });
      setInviteOpen(false);
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      toast({ title: "Пользователь создан" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  const changeRoleMutation = useMutation({
    mutationFn: async ({ user_id, role }: { user_id: string; role: "admin" | "partner" }) => {
      // delete existing role rows for user then insert new
      const { error: delErr } = await supabase.from("user_roles").delete().eq("user_id", user_id);
      if (delErr) throw delErr;
      const { error: insErr } = await supabase.from("user_roles").insert({ user_id, role });
      if (insErr) throw insErr;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      toast({ title: "Роль обновлена" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  const deleteUserMutation = useMutation({
    mutationFn: async (user_id: string) => {
      // Remove role rows — actual auth.users row remains but user loses CRM access
      const { error } = await supabase.from("user_roles").delete().eq("user_id", user_id);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["all-users"] });
      setDeleteUser(null);
      toast({ title: "Доступ отозван" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  // ============ APPEARANCE ============
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
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-muted text-lg font-semibold text-foreground overflow-hidden">
                  {profile?.avatar_url ? (
                    <img src={profile.avatar_url} alt="" className="w-full h-full object-cover" />
                  ) : (
                    initials
                  )}
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
                  { key: "newLeads" as const, label: "Новые заявки", desc: "Уведомления о новых заявках со всех сайтов" },
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
                      checked={notifPrefs[item.key]}
                      onChange={(v) => handleNotifToggle(item.key, v)}
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
                {isAdmin && (
                  <button
                    onClick={() => setInviteOpen(true)}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-[0.97]"
                  >
                    <Plus className="h-3.5 w-3.5" />Пригласить
                  </button>
                )}
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
                        <p className="text-sm font-medium text-foreground truncate">{u.name}</p>
                        {u.phone && <p className="text-[11px] text-muted-foreground truncate">{u.phone}</p>}
                      </div>
                      {isAdmin && u.user_id !== user?.id ? (
                        <>
                          <select
                            value={u.role}
                            onChange={(e) => changeRoleMutation.mutate({ user_id: u.user_id, role: e.target.value as any })}
                            className="h-8 rounded-lg border border-border bg-background px-2 text-xs text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                          >
                            <option value="admin">Администратор</option>
                            <option value="partner">Партнёр</option>
                          </select>
                          <button
                            onClick={() => setDeleteUser({ user_id: u.user_id, name: u.name })}
                            className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </>
                      ) : (
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${
                          u.role === "admin" ? "bg-foreground text-primary-foreground" : "bg-muted text-muted-foreground"
                        }`}>
                          {u.role === "admin" ? "Администратор" : "Партнёр"}
                        </span>
                      )}
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

      {/* Invite modal */}
      <Modal
        open={inviteOpen}
        onClose={() => setInviteOpen(false)}
        title="Пригласить пользователя"
        footer={
          <>
            <button onClick={() => setInviteOpen(false)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted">Отмена</button>
            <button
              onClick={() => inviteMutation.mutate()}
              disabled={inviteMutation.isPending}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40"
            >
              {inviteMutation.isPending ? "Создание..." : "Создать"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-muted-foreground font-medium">Email*</label>
            <input
              type="email"
              value={inviteForm.email}
              onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
              className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground font-medium">Пароль*</label>
            <input
              value={inviteForm.password}
              onChange={(e) => setInviteForm({ ...inviteForm, password: e.target.value })}
              placeholder="минимум 6 символов"
              className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
            <p className="mt-1 text-[10px] text-muted-foreground">Передайте пароль пользователю — он сможет сменить его в настройках.</p>
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground font-medium">Имя</label>
            <input
              value={inviteForm.full_name}
              onChange={(e) => setInviteForm({ ...inviteForm, full_name: e.target.value })}
              className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground font-medium">Роль</label>
            <select
              value={inviteForm.role}
              onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value as any })}
              className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              <option value="partner">Партнёр</option>
              <option value="admin">Администратор</option>
            </select>
          </div>
        </div>
      </Modal>

      {/* Invite success — show credentials */}
      <Modal
        open={!!inviteResult}
        onClose={() => setInviteResult(null)}
        title="Пользователь создан"
        footer={
          <button
            onClick={() => setInviteResult(null)}
            className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90"
          >
            Готово
          </button>
        }
      >
        {inviteResult && (
          <div className="space-y-3">
            <p className="text-sm text-muted-foreground">Передайте эти данные пользователю:</p>
            <div className="rounded-xl border border-border bg-muted/40 p-3 font-mono text-xs space-y-2">
              <div className="flex items-center justify-between gap-2">
                <span><span className="text-muted-foreground">Email:</span> {inviteResult.email}</span>
                <button onClick={() => { navigator.clipboard.writeText(inviteResult.email); toast({ title: "Скопировано" }); }} className="p-1 rounded hover:bg-background">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
              <div className="flex items-center justify-between gap-2">
                <span><span className="text-muted-foreground">Пароль:</span> {inviteResult.password}</span>
                <button onClick={() => { navigator.clipboard.writeText(inviteResult.password); toast({ title: "Скопировано" }); }} className="p-1 rounded hover:bg-background">
                  <Copy className="h-3 w-3" />
                </button>
              </div>
            </div>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteUser}
        onClose={() => setDeleteUser(null)}
        onConfirm={() => deleteUser && deleteUserMutation.mutate(deleteUser.user_id)}
        title={`Отозвать доступ у ${deleteUser?.name}?`}
        description="Пользователь потеряет доступ к CRM. Учётная запись сохранится, доступ можно вернуть повторным приглашением."
        confirmLabel="Отозвать"
        destructive
      />

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
