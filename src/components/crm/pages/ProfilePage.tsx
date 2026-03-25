import { useState, useEffect } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Camera, Mail, Phone, Shield, Key, Clock } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function ProfilePage() {
  const { user } = useAuth();
  const queryClient = useQueryClient();

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

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile?.full_name) {
      const parts = profile.full_name.split(" ");
      setFirstName(parts[0] ?? "");
      setLastName(parts.slice(1).join(" ") ?? "");
    }
    if (profile?.phone) setPhone(profile.phone);
  }, [profile]);

  const email = user?.email ?? "";
  const initials = `${firstName?.[0] ?? ""}${lastName?.[0] ?? ""}`.toUpperCase() || "?";

  const updateProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: `${firstName} ${lastName}`.trim(),
          phone: phone || null,
        })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      toast({ title: "Профиль сохранён" });
      queryClient.invalidateQueries({ queryKey: ["my-profile"] });
    },
    onError: () => toast({ title: "Ошибка сохранения", variant: "destructive" }),
  });

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
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    }
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
                  {initials}
                </div>
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
                {phone && (
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Phone className="h-3.5 w-3.5" />
                    <span>{phone}</span>
                  </div>
                )}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Shield className="h-3.5 w-3.5" />
                  <span>Полный доступ</span>
                </div>
              </div>
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
                <input value={firstName} onChange={(e) => setFirstName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Фамилия</label>
                <input value={lastName} onChange={(e) => setLastName(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Email</label>
                <input value={email} disabled
                  className="h-10 w-full rounded-xl border border-border bg-muted px-3 text-sm text-muted-foreground cursor-not-allowed" />
              </div>
              <div>
                <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Телефон</label>
                <input value={phone} onChange={(e) => setPhone(e.target.value)}
                  className="h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow" />
              </div>
            </div>
            <div className="mt-6 flex justify-end">
              <button onClick={() => updateProfile.mutate()} disabled={updateProfile.isPending}
                className="h-9 px-5 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40">
                {updateProfile.isPending ? "Сохранение..." : "Сохранить"}
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
        </div>
      </div>
    </div>
  );
}
