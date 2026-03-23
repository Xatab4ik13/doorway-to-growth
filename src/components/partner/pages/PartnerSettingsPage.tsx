import { PartnerHeader } from "../PartnerHeader";
import { User, Lock, Bell } from "lucide-react";

export function PartnerSettingsPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      <PartnerHeader title="Настройки" onNavigate={onNavigate} />

      <div className="space-y-5">
        {/* Profile */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
              <User className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Профиль</h2>
              <p className="text-[11px] text-muted-foreground">Основная информация аккаунта</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Название салона", value: "Салон дверей «Митино»" },
              { label: "Email", value: "partner@mitino.ru" },
              { label: "Контактное лицо", value: "Иванов Пётр Сергеевич" },
            ].map((f, i) => (
              <div key={i}>
                <label className="text-[11px] text-muted-foreground font-medium">{f.label}</label>
                <input
                  defaultValue={f.value}
                  className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Безопасность</h2>
              <p className="text-[11px] text-muted-foreground">Пароль и доступ</p>
            </div>
          </div>
          <button className="px-4 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors">
            Сменить пароль
          </button>
        </div>

        {/* Notifications */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
              <Bell className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Уведомления</h2>
              <p className="text-[11px] text-muted-foreground">Настройки уведомлений</p>
            </div>
          </div>
          <div className="space-y-3">
            {[
              { label: "Новые заявки", desc: "Email-уведомления о новых заявках", checked: true },
              { label: "Объявления от Brandoors", desc: "Уведомления о новых объявлениях", checked: true },
              { label: "Истекающие акции", desc: "Напоминания за 3 дня до окончания", checked: false },
            ].map((n, i) => (
              <label key={i} className="flex items-center justify-between py-2 cursor-pointer">
                <div>
                  <p className="text-sm text-foreground">{n.label}</p>
                  <p className="text-[11px] text-muted-foreground">{n.desc}</p>
                </div>
                <input type="checkbox" defaultChecked={n.checked} className="h-4 w-4 rounded border-border text-foreground accent-foreground" />
              </label>
            ))}
          </div>
        </div>

        <button className="w-full sm:w-auto px-6 py-3 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.97]">
          Сохранить изменения
        </button>
      </div>
    </div>
  );
}
