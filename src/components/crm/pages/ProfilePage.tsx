import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Camera, Mail, Phone, Shield, Key, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";

const activityLog = [
  { action: "Вход в систему", time: "21.03.2026 09:14", ip: "185.12.45.78" },
  { action: "Обновление профиля", time: "20.03.2026 16:42", ip: "185.12.45.78" },
  { action: "Вход в систему", time: "20.03.2026 09:01", ip: "185.12.45.78" },
  { action: "Смена пароля", time: "18.03.2026 14:20", ip: "185.12.45.78" },
  { action: "Вход в систему", time: "18.03.2026 09:08", ip: "91.234.12.5" },
];

export function ProfilePage() {
  const [firstName, setFirstName] = useState("Александр");
  const [lastName, setLastName] = useState("Дорохов");
  const [email] = useState("admin@brandoors.ru");
  const [phone, setPhone] = useState("+7 (926) 000-00-00");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSaveProfile = () => {
    toast({ title: "Профиль сохранён", description: "Ваши данные обновлены" });
  };

  const handleChangePassword = () => {
    if (!currentPassword || !newPassword) return;
    if (newPassword !== confirmPassword) {
      toast({ title: "Ошибка", description: "Пароли не совпадают", variant: "destructive" });
      return;
    }
    toast({ title: "Пароль обновлён" });
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Профиль" breadcrumbs={[{ label: "Настройки" }]} />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 opacity-0 animate-fade-up">
        {/* Left: Avatar card */}
        <div className="lg:col-span-1">
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex flex-col items-center text-center">
              <div className="relative group">
                <div className="flex h-24 w-24 items-center justify-center rounded-2xl bg-muted text-2xl font-semibold text-foreground">
                  АД
                </div>
                <button className="absolute inset-0 flex items-center justify-center rounded-2xl bg-foreground/60 text-primary-foreground opacity-0 group-hover:opacity-100 transition-opacity active:scale-95">
                  <Camera className="h-5 w-5" />
                </button>
              </div>
              <h3 className="mt-4 text-base font-semibold text-foreground">{firstName} {lastName}</h3>
              <span className="mt-1 inline-block rounded-full bg-foreground px-2.5 py-0.5 text-[10px] font-medium text-primary-foreground">
                Администратор
              </span>
              <div className="mt-4 w-full space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Mail className="h-3.5 w-3.5" />
                  <span className="truncate">{email}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Phone className="h-3.5 w-3.5" />
                  <span>{phone}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Полный доступ</span>
                </div>
              </div>
            </div>
          </div>

          {/* Activity log */}
          <div className="mt-6 rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-4">
              <Clock className="h-4 w-4 text-muted-foreground" />
              <h4 className="text-sm font-semibold text-foreground">Последние действия</h4>
            </div>
            <div className="space-y-3">
              {activityLog.map((a, i) => (
                <div key={i} className="flex items-start justify-between gap-2 text-sm">
                  <div>
                    <p className="text-foreground">{a.action}</p>
                    <p className="text-[10px] text-muted-foreground">{a.ip}</p>
                  </div>
                  <span className="text-[10px] text-muted-foreground tabular-nums whitespace-nowrap">{a.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Forms */}
        <div className="lg:col-span-2 space-y-6">
          {/* Personal info */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="text-sm font-semibold text-foreground mb-6">Персональные данные</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Имя</label>
                <input
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Фамилия</label>
                <input
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
                <input
                  value={email}
                  disabled
                  className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm text-muted-foreground cursor-not-allowed"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Телефон</label>
                <input
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleSaveProfile}
                className="h-9 px-5 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors"
              >
                Сохранить
              </button>
            </div>
          </div>

          {/* Change password */}
          <div className="rounded-2xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-6">
              <Key className="h-4 w-4 text-muted-foreground" />
              <h3 className="text-sm font-semibold text-foreground">Смена пароля</h3>
            </div>
            <div className="space-y-4 max-w-sm">
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Текущий пароль</label>
                <input
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Новый пароль</label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Подтверждение</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
              </div>
            </div>
            <div className="mt-6">
              <button
                onClick={handleChangePassword}
                disabled={!currentPassword || !newPassword}
                className="h-9 px-5 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40"
              >
                Обновить пароль
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
