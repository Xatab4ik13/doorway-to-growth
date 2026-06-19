import { useState } from "react";
import { PartnerHeader } from "../PartnerHeader";
import { Image, Users, Star, MapPin, Phone, Clock, Upload, Pencil, Plus, Trash2 } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { resolveStorageUrl } from "@/lib/storageUrl";

const tabs = [
  { id: "banners", label: "Баннеры", icon: Image },
  { id: "staff", label: "Сотрудники", icon: Users },
  { id: "reviews", label: "Отзывы", icon: Star },
  { id: "contacts", label: "Контакты", icon: MapPin },
];

export function PartnerContentPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState("banners");

  const { data: partner } = useQuery({
    queryKey: ["my-partner", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("partners")
        .select("*, sites(id, name, address, phone, email, description)")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const partnerId = partner?.id;
  const siteId = partner?.site_id;

  const { data: banners = [] } = useQuery({
    queryKey: ["partner-banners", partnerId],
    queryFn: async () => {
      const { data } = await supabase
        .from("partner_banners")
        .select("*")
        .eq("partner_id", partnerId!)
        .order("sort_order", { ascending: true });
      return data ?? [];
    },
    enabled: !!partnerId,
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["partner-staff", partnerId],
    queryFn: async () => {
      const { data } = await supabase
        .from("partner_staff")
        .select("*")
        .eq("partner_id", partnerId!)
        .order("sort_order", { ascending: true });
      return data ?? [];
    },
    enabled: !!partnerId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["partner-reviews", partnerId],
    queryFn: async () => {
      const { data } = await supabase
        .from("partner_reviews")
        .select("*")
        .eq("partner_id", partnerId!)
        .order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!partnerId,
  });

  const site = (partner as any)?.sites;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <PartnerHeader title="Контент сайта" onNavigate={onNavigate} />
      <p className="text-sm text-muted-foreground mb-5">Управляйте содержимым вашего сайта-витрины.</p>

      <div className="flex gap-1 mb-6 overflow-x-auto pb-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors shrink-0 ${
              activeTab === tab.id ? "bg-foreground text-background" : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="h-4 w-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "banners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Баннеры главной страницы</h2>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity active:scale-[0.97]">
              <Plus className="h-3.5 w-3.5" />Добавить
            </button>
          </div>
          {banners.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground">Баннеры не добавлены</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((b: any) => (
              <div key={b.id} className="rounded-2xl border border-border bg-card overflow-hidden group">
                <div className="h-36 bg-muted flex items-center justify-center overflow-hidden">
                  {b.image_url ? (
                    <img src={resolveStorageUrl(b.image_url)} alt={b.title || ""} className="w-full h-full object-cover" />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-foreground">{b.title || "Баннер"}</p>
                    <p className="text-[11px] text-muted-foreground">{b.subtitle || ""}</p>
                  </div>
                  <div className="flex gap-1">
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border-2 border-dashed border-border bg-muted/30 p-8 flex flex-col items-center justify-center text-center cursor-pointer hover:border-foreground/20 transition-colors">
            <Upload className="h-8 w-8 text-muted-foreground/40 mb-2" />
            <p className="text-sm text-muted-foreground">Перетащите изображение или нажмите для загрузки</p>
            <p className="text-[11px] text-muted-foreground/60 mt-1">PNG, JPG до 5 МБ</p>
          </div>
        </div>
      )}

      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Сотрудники салона</h2>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity active:scale-[0.97]">
              <Plus className="h-3.5 w-3.5" />Добавить
            </button>
          </div>
          {staff.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground">Сотрудники не добавлены</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {staff.map((s: any) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {s.photo_url ? (
                    <img src={s.photo_url} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground">{s.position || ""}</p>
                </div>
                <div className="flex gap-1">
                  <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Отзывы клиентов</h2>
            <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 transition-opacity active:scale-[0.97]">
              <Plus className="h-3.5 w-3.5" />Добавить
            </button>
          </div>
          {reviews.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground">Отзывов пока нет</div>}
          <div className="space-y-3">
            {reviews.map((r: any) => (
              <div key={r.id} className="rounded-2xl border border-border bg-card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <p className="text-sm font-medium text-foreground">{r.author_name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-3 w-3 ${i < (r.rating || 0) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/20"}`} />
                      ))}
                    </div>
                  </div>
                  <span className="text-[10px] text-muted-foreground">
                    {new Date(r.created_at).toLocaleDateString("ru-RU")}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{r.text || ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "contacts" && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Контактная информация</h2>
          <div className="rounded-2xl border border-border bg-card p-5 space-y-4">
            {[
              { label: "Адрес", value: site?.address || partner?.address || "Не указан", icon: MapPin },
              { label: "Телефон", value: site?.phone || partner?.phone || "Не указан", icon: Phone },
              { label: "Время работы", value: "Пн-Сб: 10:00–20:00, Вс: 11:00–18:00", icon: Clock },
            ].map((field, i) => (
              <div key={i} className="flex items-start gap-3">
                <div className="h-9 w-9 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <field.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[11px] text-muted-foreground font-medium mb-1">{field.label}</p>
                  <p className="text-sm text-foreground">{field.value}</p>
                </div>
                <button className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors shrink-0">
                  <Pencil className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-border bg-muted h-48 flex items-center justify-center">
            <p className="text-sm text-muted-foreground">Карта будет подключена позже</p>
          </div>
        </div>
      )}
    </div>
  );
}
