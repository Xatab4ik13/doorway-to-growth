import { useState, useEffect } from "react";
import { PartnerHeader } from "../PartnerHeader";
import { Image, Users, Star, MapPin, Phone, Mail, Upload, Pencil, Plus, Trash2, Loader2 } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { resolveStorageUrl } from "@/lib/storageUrl";
import { Modal } from "@/components/crm/Modal";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { toast } from "@/hooks/use-toast";

const tabs = [
  { id: "banners", label: "Баннеры", icon: Image },
  { id: "staff", label: "Сотрудники", icon: Users },
  { id: "reviews", label: "Отзывы", icon: Star },
  { id: "contacts", label: "Контакты", icon: MapPin },
];

const BUCKET = "partner-assets";

async function uploadImage(file: File, folder: string): Promise<string> {
  const ext = file.name.split(".").pop() || "jpg";
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;
  const { error } = await supabase.storage.from(BUCKET).upload(path, file, { upsert: false });
  if (error) throw error;
  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}

export function PartnerContentPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { user } = useAuth();
  const qc = useQueryClient();
  const [activeTab, setActiveTab] = useState("banners");

  const { data: partner } = useQuery({
    queryKey: ["my-partner-full", user?.id],
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
  const site = (partner as any)?.sites;

  const { data: banners = [] } = useQuery({
    queryKey: ["partner-banners", partnerId],
    queryFn: async () => {
      const { data } = await supabase.from("partner_banners").select("*").eq("partner_id", partnerId!).order("sort_order", { ascending: true });
      return data ?? [];
    },
    enabled: !!partnerId,
  });

  const { data: staff = [] } = useQuery({
    queryKey: ["partner-staff", partnerId],
    queryFn: async () => {
      const { data } = await supabase.from("partner_staff").select("*").eq("partner_id", partnerId!).order("sort_order", { ascending: true });
      return data ?? [];
    },
    enabled: !!partnerId,
  });

  const { data: reviews = [] } = useQuery({
    queryKey: ["partner-reviews", partnerId],
    queryFn: async () => {
      const { data } = await supabase.from("partner_reviews").select("*").eq("partner_id", partnerId!).order("created_at", { ascending: false });
      return data ?? [];
    },
    enabled: !!partnerId,
  });

  // ============ BANNERS ============
  const [bannerModal, setBannerModal] = useState<any>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [bannerUploading, setBannerUploading] = useState(false);

  const saveBanner = useMutation({
    mutationFn: async (b: any) => {
      let imageUrl = b.image_url;
      if (bannerFile) {
        setBannerUploading(true);
        imageUrl = await uploadImage(bannerFile, `banners/${partnerId}`);
      }
      const payload = {
        title: b.title || null,
        subtitle: b.subtitle || null,
        link: b.link || null,
        sort_order: Number(b.sort_order) || 0,
        is_active: b.is_active ?? true,
        image_url: imageUrl,
        partner_id: partnerId,
        site_id: partner?.site_id ?? null,
      };
      if (!payload.image_url) throw new Error("Загрузите изображение");
      if (b.id) {
        const { error } = await supabase.from("partner_banners").update(payload).eq("id", b.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("partner_banners").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partner-banners", partnerId] });
      setBannerModal(null);
      setBannerFile(null);
      toast({ title: "Баннер сохранён" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
    onSettled: () => setBannerUploading(false),
  });

  const deleteBanner = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partner_banners").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partner-banners", partnerId] });
      toast({ title: "Баннер удалён" });
    },
  });

  // ============ STAFF ============
  const [staffModal, setStaffModal] = useState<any>(null);
  const [staffFile, setStaffFile] = useState<File | null>(null);
  const [staffUploading, setStaffUploading] = useState(false);

  const saveStaff = useMutation({
    mutationFn: async (s: any) => {
      let photoUrl = s.photo_url;
      if (staffFile) {
        setStaffUploading(true);
        photoUrl = await uploadImage(staffFile, `staff/${partnerId}`);
      }
      const payload = {
        name: s.name,
        position: s.position || null,
        photo_url: photoUrl || null,
        sort_order: Number(s.sort_order) || 0,
        partner_id: partnerId,
        site_id: partner?.site_id ?? null,
      };
      if (!payload.name?.trim()) throw new Error("Укажите имя");
      if (s.id) {
        const { error } = await supabase.from("partner_staff").update(payload).eq("id", s.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("partner_staff").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partner-staff", partnerId] });
      setStaffModal(null);
      setStaffFile(null);
      toast({ title: "Сотрудник сохранён" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
    onSettled: () => setStaffUploading(false),
  });

  const deleteStaff = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partner_staff").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partner-staff", partnerId] });
      toast({ title: "Удалено" });
    },
  });

  // ============ REVIEWS ============
  const [reviewModal, setReviewModal] = useState<any>(null);

  const saveReview = useMutation({
    mutationFn: async (r: any) => {
      const payload = {
        author_name: r.author_name?.trim(),
        rating: Number(r.rating) || 5,
        text: r.text || null,
        is_published: r.is_published ?? true,
        partner_id: partnerId,
        site_id: partner?.site_id ?? null,
      };
      if (!payload.author_name) throw new Error("Укажите имя автора");
      if (r.id) {
        const { error } = await supabase.from("partner_reviews").update(payload).eq("id", r.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from("partner_reviews").insert(payload);
        if (error) throw error;
      }
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partner-reviews", partnerId] });
      setReviewModal(null);
      toast({ title: "Отзыв сохранён" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  const deleteReview = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("partner_reviews").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["partner-reviews", partnerId] });
      toast({ title: "Отзыв удалён" });
    },
  });

  const [deleteConfirm, setDeleteConfirm] = useState<{ type: string; id: string } | null>(null);

  // ============ CONTACTS ============
  const [contactForm, setContactForm] = useState({ address: "", phone: "", email: "", description: "" });
  useEffect(() => {
    if (site) {
      setContactForm({
        address: site.address ?? "",
        phone: site.phone ?? "",
        email: site.email ?? "",
        description: site.description ?? "",
      });
    }
  }, [site?.id]);

  const saveContacts = useMutation({
    mutationFn: async () => {
      if (!site?.id) throw new Error("Сайт не привязан к партнёру");
      const { error } = await supabase
        .from("sites")
        .update({
          address: contactForm.address || null,
          phone: contactForm.phone || null,
          email: contactForm.email || null,
          description: contactForm.description || null,
        })
        .eq("id", site.id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["my-partner-full", user?.id] });
      toast({ title: "Контакты сохранены" });
    },
    onError: (e: Error) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

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

      {/* ================ BANNERS ================ */}
      {activeTab === "banners" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Баннеры главной страницы</h2>
            <button
              onClick={() => { setBannerFile(null); setBannerModal({ is_active: true, sort_order: banners.length }); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-[0.97]"
            >
              <Plus className="h-3.5 w-3.5" />Добавить
            </button>
          </div>
          {banners.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground">Баннеры не добавлены</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {banners.map((b: any) => (
              <div key={b.id} className="rounded-2xl border border-border bg-card overflow-hidden">
                <div className="h-36 bg-muted flex items-center justify-center overflow-hidden">
                  {b.image_url ? (
                    <img src={resolveStorageUrl(b.image_url)} alt={b.title || ""} className="w-full h-full object-cover" />
                  ) : (
                    <Image className="h-8 w-8 text-muted-foreground/30" />
                  )}
                </div>
                <div className="p-3 flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{b.title || "Баннер"}</p>
                    <p className="text-[11px] text-muted-foreground truncate">{b.subtitle || ""}</p>
                  </div>
                  <div className="flex gap-1 shrink-0">
                    <button onClick={() => { setBannerFile(null); setBannerModal(b); }} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirm({ type: "banner", id: b.id })} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================ STAFF ================ */}
      {activeTab === "staff" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Сотрудники салона</h2>
            <button
              onClick={() => { setStaffFile(null); setStaffModal({ sort_order: staff.length }); }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-[0.97]"
            >
              <Plus className="h-3.5 w-3.5" />Добавить
            </button>
          </div>
          {staff.length === 0 && <div className="text-center py-8 text-sm text-muted-foreground">Сотрудники не добавлены</div>}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {staff.map((s: any) => (
              <div key={s.id} className="rounded-2xl border border-border bg-card p-4 flex items-center gap-3">
                <div className="h-12 w-12 rounded-xl bg-muted flex items-center justify-center shrink-0 overflow-hidden">
                  {s.photo_url ? (
                    <img src={resolveStorageUrl(s.photo_url)} alt={s.name} className="w-full h-full object-cover" />
                  ) : (
                    <Users className="h-5 w-5 text-muted-foreground/40" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-foreground truncate">{s.name}</p>
                  <p className="text-[11px] text-muted-foreground truncate">{s.position || ""}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => { setStaffFile(null); setStaffModal(s); }} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground">
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm({ type: "staff", id: s.id })} className="h-8 w-8 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================ REVIEWS ================ */}
      {activeTab === "reviews" && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-foreground">Отзывы клиентов</h2>
            <button
              onClick={() => setReviewModal({ rating: 5, is_published: true })}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-foreground text-background text-xs font-medium hover:opacity-90 active:scale-[0.97]"
            >
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
                    {!r.is_published && <span className="text-[10px] px-2 py-0.5 rounded-full bg-muted text-muted-foreground">Скрыт</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] text-muted-foreground">
                      {new Date(r.created_at).toLocaleDateString("ru-RU")}
                    </span>
                    <button onClick={() => setReviewModal(r)} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground">
                      <Pencil className="h-3.5 w-3.5" />
                    </button>
                    <button onClick={() => setDeleteConfirm({ type: "review", id: r.id })} className="h-7 w-7 rounded-lg flex items-center justify-center text-muted-foreground hover:bg-destructive/10 hover:text-destructive">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{r.text || ""}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ================ CONTACTS ================ */}
      {activeTab === "contacts" && (
        <div className="space-y-4">
          <h2 className="text-sm font-semibold text-foreground">Контактная информация салона</h2>
          {!site?.id && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 dark:bg-amber-950/20 dark:border-amber-900 p-4 text-sm text-amber-900 dark:text-amber-200">
              Сайт не привязан к вашему профилю. Обратитесь к администратору Brandoors.
            </div>
          )}
          <div className="rounded-2xl border border-border bg-card p-5 space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1"><MapPin className="h-3 w-3" /> Адрес</label>
              <input
                value={contactForm.address}
                onChange={(e) => setContactForm({ ...contactForm, address: e.target.value })}
                disabled={!site?.id}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1"><Phone className="h-3 w-3" /> Телефон</label>
              <input
                value={contactForm.phone}
                onChange={(e) => setContactForm({ ...contactForm, phone: e.target.value })}
                disabled={!site?.id}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium flex items-center gap-1"><Mail className="h-3 w-3" /> Email</label>
              <input
                value={contactForm.email}
                onChange={(e) => setContactForm({ ...contactForm, email: e.target.value })}
                disabled={!site?.id}
                className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
              />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Описание салона</label>
              <textarea
                value={contactForm.description}
                onChange={(e) => setContactForm({ ...contactForm, description: e.target.value })}
                disabled={!site?.id}
                rows={3}
                className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 disabled:opacity-50"
              />
            </div>
            <button
              onClick={() => saveContacts.mutate()}
              disabled={!site?.id || saveContacts.isPending}
              className="px-5 py-2.5 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 active:scale-[0.97] disabled:opacity-40"
            >
              {saveContacts.isPending ? "Сохранение..." : "Сохранить"}
            </button>
          </div>
        </div>
      )}

      {/* ============ BANNER MODAL ============ */}
      <Modal
        open={!!bannerModal}
        onClose={() => setBannerModal(null)}
        title={bannerModal?.id ? "Редактировать баннер" : "Новый баннер"}
        footer={
          <>
            <button onClick={() => setBannerModal(null)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted">Отмена</button>
            <button
              onClick={() => saveBanner.mutate(bannerModal)}
              disabled={saveBanner.isPending || bannerUploading}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
            >
              {(saveBanner.isPending || bannerUploading) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Сохранить
            </button>
          </>
        }
      >
        {bannerModal && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Изображение</label>
              <label className="mt-1 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-foreground/30">
                {bannerFile ? (
                  <img src={URL.createObjectURL(bannerFile)} alt="" className="max-h-32 rounded-lg" />
                ) : bannerModal.image_url ? (
                  <img src={resolveStorageUrl(bannerModal.image_url)} alt="" className="max-h-32 rounded-lg" />
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Выбрать файл</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setBannerFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Заголовок</label>
              <input value={bannerModal.title ?? ""} onChange={(e) => setBannerModal({ ...bannerModal, title: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Подзаголовок</label>
              <input value={bannerModal.subtitle ?? ""} onChange={(e) => setBannerModal({ ...bannerModal, subtitle: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">Ссылка</label>
                <input value={bannerModal.link ?? ""} onChange={(e) => setBannerModal({ ...bannerModal, link: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
              <div>
                <label className="text-[11px] text-muted-foreground font-medium">Порядок</label>
                <input type="number" value={bannerModal.sort_order ?? 0} onChange={(e) => setBannerModal({ ...bannerModal, sort_order: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
              </div>
            </div>
            <label className="flex items-center gap-2 pt-2 cursor-pointer">
              <input type="checkbox" checked={bannerModal.is_active ?? true} onChange={(e) => setBannerModal({ ...bannerModal, is_active: e.target.checked })} className="h-4 w-4 accent-foreground" />
              <span className="text-sm">Активен</span>
            </label>
          </div>
        )}
      </Modal>

      {/* ============ STAFF MODAL ============ */}
      <Modal
        open={!!staffModal}
        onClose={() => setStaffModal(null)}
        title={staffModal?.id ? "Редактировать сотрудника" : "Новый сотрудник"}
        footer={
          <>
            <button onClick={() => setStaffModal(null)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted">Отмена</button>
            <button
              onClick={() => saveStaff.mutate(staffModal)}
              disabled={saveStaff.isPending || staffUploading}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40 flex items-center gap-2"
            >
              {(saveStaff.isPending || staffUploading) && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Сохранить
            </button>
          </>
        }
      >
        {staffModal && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Фото</label>
              <label className="mt-1 flex flex-col items-center justify-center gap-1 border-2 border-dashed border-border rounded-xl p-4 cursor-pointer hover:border-foreground/30">
                {staffFile ? (
                  <img src={URL.createObjectURL(staffFile)} alt="" className="max-h-24 rounded-lg" />
                ) : staffModal.photo_url ? (
                  <img src={resolveStorageUrl(staffModal.photo_url)} alt="" className="max-h-24 rounded-lg" />
                ) : (
                  <>
                    <Upload className="h-5 w-5 text-muted-foreground" />
                    <p className="text-xs text-muted-foreground">Выбрать файл</p>
                  </>
                )}
                <input type="file" accept="image/*" className="hidden" onChange={(e) => setStaffFile(e.target.files?.[0] ?? null)} />
              </label>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Имя*</label>
              <input value={staffModal.name ?? ""} onChange={(e) => setStaffModal({ ...staffModal, name: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Должность</label>
              <input value={staffModal.position ?? ""} onChange={(e) => setStaffModal({ ...staffModal, position: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Порядок</label>
              <input type="number" value={staffModal.sort_order ?? 0} onChange={(e) => setStaffModal({ ...staffModal, sort_order: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
          </div>
        )}
      </Modal>

      {/* ============ REVIEW MODAL ============ */}
      <Modal
        open={!!reviewModal}
        onClose={() => setReviewModal(null)}
        title={reviewModal?.id ? "Редактировать отзыв" : "Новый отзыв"}
        footer={
          <>
            <button onClick={() => setReviewModal(null)} className="px-4 py-2 rounded-xl border border-border text-sm hover:bg-muted">Отмена</button>
            <button
              onClick={() => saveReview.mutate(reviewModal)}
              disabled={saveReview.isPending}
              className="px-4 py-2 rounded-xl bg-foreground text-background text-sm font-medium hover:opacity-90 disabled:opacity-40"
            >
              Сохранить
            </button>
          </>
        }
      >
        {reviewModal && (
          <div className="space-y-3">
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Имя автора*</label>
              <input value={reviewModal.author_name ?? ""} onChange={(e) => setReviewModal({ ...reviewModal, author_name: e.target.value })} className="mt-1 w-full h-10 rounded-xl border border-border bg-background px-3 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Оценка</label>
              <div className="flex gap-1 mt-1">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button key={n} type="button" onClick={() => setReviewModal({ ...reviewModal, rating: n })} className="p-1">
                    <Star className={`h-6 w-6 ${n <= (reviewModal.rating || 0) ? "text-amber-400 fill-amber-400" : "text-muted-foreground/30"}`} />
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-[11px] text-muted-foreground font-medium">Текст отзыва</label>
              <textarea value={reviewModal.text ?? ""} onChange={(e) => setReviewModal({ ...reviewModal, text: e.target.value })} rows={4} className="mt-1 w-full rounded-xl border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring/20" />
            </div>
            <label className="flex items-center gap-2 pt-2 cursor-pointer">
              <input type="checkbox" checked={reviewModal.is_published ?? true} onChange={(e) => setReviewModal({ ...reviewModal, is_published: e.target.checked })} className="h-4 w-4 accent-foreground" />
              <span className="text-sm">Опубликован на витрине</span>
            </label>
          </div>
        )}
      </Modal>

      <ConfirmDialog
        open={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={() => {
          if (!deleteConfirm) return;
          if (deleteConfirm.type === "banner") deleteBanner.mutate(deleteConfirm.id);
          if (deleteConfirm.type === "staff") deleteStaff.mutate(deleteConfirm.id);
          if (deleteConfirm.type === "review") deleteReview.mutate(deleteConfirm.id);
          setDeleteConfirm(null);
        }}
        title="Удалить?"
        description="Действие нельзя отменить."
        confirmLabel="Удалить"
        destructive
      />
    </div>
  );
}
