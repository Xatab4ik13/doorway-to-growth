import { PartnerHeader } from "../PartnerHeader";
import { Plus, Tag, Calendar, Percent, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export function PartnerPromotionsPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { user } = useAuth();

  const { data: partner } = useQuery({
    queryKey: ["my-partner", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("partners")
        .select("id")
        .eq("user_id", user!.id)
        .maybeSingle();
      return data;
    },
    enabled: !!user,
  });

  const { data: promotions = [], isLoading } = useQuery({
    queryKey: ["partner-promotions", partner?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("promotions")
        .select("*, promotion_products(count)")
        .eq("partner_id", partner!.id)
        .order("created_at", { ascending: false });
      return (data ?? []).map((p: any) => ({
        ...p,
        productsCount: p.promotion_products?.[0]?.count ?? 0,
      }));
    },
    enabled: !!partner?.id,
  });

  const activeCount = promotions.filter((p: any) => p.is_active).length;
  const totalProducts = promotions.reduce((a: number, p: any) => a + p.productsCount, 0);

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-6xl">
      <PartnerHeader title="Мои акции" onNavigate={onNavigate} />

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[11px] text-muted-foreground font-medium">Всего акций</p>
          <p className="text-xl font-bold text-foreground mt-1">{promotions.length}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4">
          <p className="text-[11px] text-muted-foreground font-medium">Активные</p>
          <p className="text-xl font-bold text-success mt-1">{activeCount}</p>
        </div>
        <div className="rounded-2xl border border-border bg-card p-4 col-span-2 sm:col-span-1">
          <p className="text-[11px] text-muted-foreground font-medium">Привязано товаров</p>
          <p className="text-xl font-bold text-foreground mt-1">{totalProducts}</p>
        </div>
      </div>

      <div className="flex items-center justify-between mb-5">
        <h2 className="text-sm font-semibold text-foreground">Все акции</h2>
        <button className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.97]">
          <Plus className="h-4 w-4" />Создать акцию
        </button>
      </div>

      <div className="space-y-3">
        {isLoading && <div className="text-center py-12 text-sm text-muted-foreground">Загрузка...</div>}
        {!isLoading && promotions.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">Акции не созданы</div>
        )}
        {promotions.map((promo: any) => (
          <div key={promo.id} className="rounded-2xl border border-border bg-card p-5 hover:shadow-sm transition-shadow">
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{promo.title}</h3>
                  {promo.is_active ? (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-success/10 text-success">
                      <Eye className="h-3 w-3" />Активна
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-muted text-muted-foreground">
                      <EyeOff className="h-3 w-3" />Завершена
                    </span>
                  )}
                </div>
                {promo.description && <p className="text-xs text-muted-foreground mb-3">{promo.description}</p>}
                <div className="flex flex-wrap gap-3 text-[11px] text-muted-foreground">
                  {promo.discount_value && <span className="flex items-center gap-1"><Percent className="h-3 w-3" />Скидка: {promo.discount_value}</span>}
                  {promo.start_date && <span className="flex items-center gap-1"><Calendar className="h-3 w-3" />{promo.start_date} — {promo.end_date || "..."}</span>}
                  {promo.productsCount > 0 && <span className="flex items-center gap-1"><Tag className="h-3 w-3" />{promo.productsCount} товаров</span>}
                </div>
              </div>
              <div className="flex gap-1 shrink-0">
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
    </div>
  );
}
