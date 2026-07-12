import { useState } from "react";
import { PartnerHeader } from "../PartnerHeader";
import { Plus, Tag, Calendar, Percent, Pencil, Trash2, Eye, EyeOff } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { Modal } from "@/components/crm/Modal";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { toast } from "@/hooks/use-toast";

type PromoForm = {
  id?: string;
  title: string;
  description: string;
  discount_type: string;
  discount_value: string;
  start_date: string;
  end_date: string;
  is_active: boolean;
};

const emptyForm: PromoForm = {
  title: "",
  description: "",
  discount_type: "percent",
  discount_value: "",
  start_date: "",
  end_date: "",
  is_active: true,
};

export function PartnerPromotionsPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();

  const [editOpen, setEditOpen] = useState(false);
  const [form, setForm] = useState<PromoForm>(emptyForm);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const { data: partner } = useQuery({
    queryKey: ["my-partner", user?.id],
    queryFn: async () => {
      const { data } = await supabase
        .from("partners")
        .select("id, site_id")
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

  const invalidate = () =>
    qc.invalidateQueries({ queryKey: ["partner-promotions", partner?.id] });

  const saveMutation = useMutation({
    mutationFn: async (f: PromoForm) => {
      if (!partner?.id) throw new Error("Партнёр не найден");
      const payload = {
        title: f.title.trim(),
        description: f.description.trim() || null,
        discount_type: f.discount_type || null,
        discount_value: f.discount_value.trim() || null,
        start_date: f.start_date || null,
        end_date: f.end_date || null,
        is_active: f.is_active,
        partner_id: partner.id,
        site_id: partner.site_id ?? null,
      };
      if (f.id) {
        const { error } = await supabase.from("promotions").update(payload).eq("id", f.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("promotions").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      invalidate();
      setEditOpen(false);
      toast({ title: form.id ? "Акция обновлена" : "Акция создана" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("promotions").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      invalidate();
      setDeleteId(null);
      toast({ title: "Акция удалена" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  const openCreate = () => {
    setForm(emptyForm);
    setEditOpen(true);
  };

  const openEdit = (p: any) => {
    setForm({
      id: p.id,
      title: p.title ?? "",
      description: p.description ?? "",
      discount_type: p.discount_type ?? "percent",
      discount_value: p.discount_value ?? "",
      start_date: p.start_date ?? "",
      end_date: p.end_date ?? "",
      is_active: !!p.is_active,
    });
    setEditOpen(true);
  };

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
        <button
          onClick={openCreate}
          disabled={!partner?.id}
          className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 transition-opacity active:scale-[0.97] disabled:opacity-40"
        >
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
                <button
                  onClick={() => openEdit(promo)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                >
                  <Pencil className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => setDeleteId(promo.id)}
                  className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title={form.id ? "Редактировать акцию" : "Новая акция"}
        footer={
          <>
            <button
              onClick={() => setEditOpen(false)}
              className="px-4 py-2 rounded-xl border border-border text-sm text-foreground hover:bg-muted transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={() => saveMutation.mutate(form)}
              disabled={!form.title.trim() || saveMutation.isPending}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40"
            >
              {saveMutation.isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="text-[11px] text-muted-foreground font-medium">Заголовок*</label>
            <input
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div>
            <label className="text-[11px] text-muted-foreground font-medium">Описание</label>
            <textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Тип скидки</label>
              <select
                value={form.discount_type}
                onChange={(e) => setForm({ ...form, discount_type: e.target.value })}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              >
                <option value="percent">Процент</option>
                <option value="fixed">Фикс. сумма</option>
                <option value="gift">Подарок</option>
              </select>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Значение</label>
              <input
                value={form.discount_value}
                onChange={(e) => setForm({ ...form, discount_value: e.target.value })}
                placeholder="10% / 5000 ₽ / -"
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Начало</label>
              <input
                type="date"
                value={form.start_date}
                onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Окончание</label>
              <input
                type="date"
                value={form.end_date}
                onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20"
              />
            </div>
          </div>
          <label className="flex items-center gap-2 pt-2 cursor-pointer">
            <input
              type="checkbox"
              checked={form.is_active}
              onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
              className="h-4 w-4 rounded border-border accent-foreground"
            />
            <span className="text-sm text-foreground">Акция активна</span>
          </label>
        </div>
      </Modal>

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={() => deleteId && deleteMutation.mutate(deleteId)}
        title="Удалить акцию?"
        description="Действие нельзя отменить."
        confirmLabel="Удалить"
        destructive
      />
    </div>
  );
}
