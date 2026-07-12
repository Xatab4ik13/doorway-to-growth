import { useState, useEffect } from "react";
import { PartnerHeader } from "../PartnerHeader";
import { User, Lock } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export function PartnerSettingsPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const { data: profile, isLoading } = useQuery({
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

  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (profile) {
      setFullName(profile.full_name ?? "");
      setPhone(profile.phone ?? "");
    }
  }, [profile]);

  const saveProfile = useMutation({
    mutationFn: async () => {
      const { error } = await supabase
        .from("profiles")
        .update({ full_name: fullName, phone })
        .eq("user_id", user!.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-profile", user?.id] });
      toast({ title: "Профиль обновлён" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  const handleChangePassword = async () => {
    if (!newPassword) return;
    if (newPassword.length < 6) {
      toast({ title: "Ошибка", description: "Пароль должен быть не короче 6 символов", variant: "destructive" });
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
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Email</label>
              <input
                value={user?.email ?? ""}
                readOnly
                className="mt-1 w-full h-10 rounded-xl border border-border bg-muted/40 px-3 text-sm text-muted-foreground cursor-not-allowed"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Контактное лицо / название</label>
              <input
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={isLoading}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Телефон</label>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={isLoading}
                placeholder="+7 ___ ___ __ __"
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
          <div className="mt-4">
            <button
              onClick={() => saveProfile.mutate()}
              disabled={saveProfile.isPending || isLoading}
              className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.97] disabled:opacity-40"
            >
              {saveProfile.isPending ? "Сохранение..." : "Сохранить профиль"}
            </button>
          </div>
        </div>

        {/* Security */}
        <div className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center">
              <Lock className="h-4 w-4 text-muted-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-foreground">Смена пароля</h2>
              <p className="text-[11px] text-muted-foreground">Минимум 6 символов</p>
            </div>
          </div>
          <div className="space-y-3 max-w-sm">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Новый пароль</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Подтверждение</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <button
              onClick={handleChangePassword}
              disabled={!newPassword}
              className="px-5 py-2.5 rounded-xl border border-border text-sm font-medium text-foreground hover:bg-muted transition-colors disabled:opacity-40"
            >
              Обновить пароль
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
