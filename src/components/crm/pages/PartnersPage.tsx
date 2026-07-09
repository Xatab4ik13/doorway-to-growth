import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Modal } from "@/components/crm/Modal";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { Search, Plus, MapPin, MoreHorizontal, Users, Trash2, KeyRound, Loader2 } from "lucide-react";
import { PartnerProfile } from "@/components/crm/PartnerProfile";
import { toast } from "@/hooks/use-toast";
import { usePartners, useCreatePartner, useDeletePartner, useUpdatePartner, type Partner } from "@/hooks/usePartners";
import { useSites } from "@/hooks/useSites";
import { supabase } from "@/integrations/supabase/client";

const PAGE_SIZE = 10;

function slugify(text: string) {
  return text.toLowerCase().replace(/[^a-zа-яё0-9]+/gi, "-").replace(/^-|-$/g, "");
}


export function PartnersPage() {
  const { data: partners = [], isLoading } = usePartners();
  const { data: sites = [] } = useSites();
  const createPartner = useCreatePartner();
  const deletePartnerMut = useDeletePartner();
  const updatePartner = useUpdatePartner();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [selectedPartner, setSelectedPartner] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [addOpen, setAddOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<Partner | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  // Form state
  const [formContactName, setFormContactName] = useState("");
  const [formName, setFormName] = useState("");
  const [formSiteId, setFormSiteId] = useState<string>("");
  const [formCity, setFormCity] = useState("Москва");
  const [formDistrict, setFormDistrict] = useState("");
  const [formPhone, setFormPhone] = useState("");
  const [formEmail, setFormEmail] = useState("");
  const [formPassword, setFormPassword] = useState("");
  const [createAccount, setCreateAccount] = useState(true);

  // Credentials modal
  const [credentials, setCredentials] = useState<{ email: string; password: string } | null>(null);

  // IDs of sites already assigned to a partner
  const takenSiteIds = new Set(partners.map((p) => p.site_id).filter(Boolean) as string[]);

  const handleSelectSite = (siteId: string) => {
    setFormSiteId(siteId);
    const site = sites.find((s) => s.id === siteId);
    if (site) {
      if (!formName.trim()) setFormName(site.name);
      if (site.city) setFormCity(site.city);
      if (site.district) setFormDistrict(site.district);
      if (site.phone && !formPhone.trim()) setFormPhone(site.phone);
      if (site.email && !formEmail.trim()) setFormEmail(site.email);
    }
  };

  const resetForm = () => {
    setFormContactName(""); setFormName(""); setFormSiteId(""); setFormCity("Москва"); setFormDistrict(""); setFormPhone(""); setFormEmail(""); setFormPassword(""); setCreateAccount(true);
  };

  const handleAdd = async () => {
    if (!formContactName.trim() || !formName.trim() || !formEmail.trim() || !formSiteId) return;
    if (createAccount && formPassword.trim().length < 6) {
      toast({ title: "Пароль должен быть не короче 6 символов", variant: "destructive" });
      return;
    }
    setCreating(true);

    try {
      let userId: string | undefined;

      if (createAccount) {
        const password = formPassword.trim();
        const { data, error } = await supabase.functions.invoke("create-user", {
          body: {
            email: formEmail.trim(),
            password,
            role: "partner",
            full_name: formContactName.trim(),
          },
        });

        if (error) throw new Error(error.message);
        if (data?.error) throw new Error(data.error);

        userId = data.user_id;
        setCredentials({ email: formEmail.trim(), password });
      }

      createPartner.mutate({
        name: formName.trim(),
        slug: slugify(formName),
        city: formCity.trim() || "Москва",
        district: formDistrict.trim() || undefined,
        phone: formPhone.trim() || undefined,
        email: formEmail.trim() || undefined,
        user_id: userId,
        site_id: formSiteId,
      });

      setAddOpen(false);
      resetForm();
    } catch (e: any) {
      toast({ title: "Ошибка создания аккаунта", description: e.message, variant: "destructive" });
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = (partner: Partner) => {
    deletePartnerMut.mutate(partner.id);
    setDeleteTarget(null);
  };

  const filtered = partners.filter((p) => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || (p.district ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? p.is_active : !p.is_active);
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const inputCls = "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow";

  if (selectedPartner !== null) {
    return <PartnerProfile onBack={() => setSelectedPartner(null)} />;
  }

  if (isLoading) {
    return (
      <div className="px-4 sm:px-8 py-6">
        <CrmHeader title="Партнёры" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Партнёры" />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Поиск партнёра..."
              className="h-9 w-56 sm:w-64 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
            />
          </div>
          <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button
                key={f}
                onClick={() => { setFilter(f); setPage(1); }}
                className={`h-9 px-3.5 text-xs font-medium transition-colors active:scale-95 ${
                  filter === f ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {f === "all" ? "Все" : f === "active" ? "Активные" : "Неактивные"}
              </button>
            ))}
          </div>
        </div>
        <button
          onClick={() => setAddOpen(true)}
          className="flex h-9 items-center gap-2 rounded-xl bg-foreground px-4 text-xs font-medium text-primary-foreground transition-colors hover:bg-foreground/90 active:scale-95 shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">Добавить</span>
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Users}
          title={partners.length === 0 ? "Нет партнёров" : "Партнёры не найдены"}
          description={partners.length === 0 ? "Добавьте первого партнёра" : "Нет партнёров по заданным фильтрам"}
          action={partners.length === 0
            ? { label: "Добавить партнёра", onClick: () => setAddOpen(true) }
            : { label: "Сбросить", onClick: () => { setSearch(""); setFilter("all"); } }
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Партнёр</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Район</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden lg:table-cell">Телефон</th>
                  <th className="px-5 py-3.5 text-right text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Заявки</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground w-20">Аккаунт</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
                  <th className="px-5 py-3.5 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelectedPartner(p.id)}
                    className="border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/40 hover:shadow-[inset_3px_0_0_hsl(var(--foreground))] cursor-pointer"
                  >
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{p.name}</p>
                          <p className="text-[11px] text-muted-foreground">{p.address ?? p.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {p.district ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-sm text-foreground hidden lg:table-cell">{p.phone ?? "—"}</td>
                    <td className="px-5 py-3.5 text-right text-sm font-semibold tabular-nums text-foreground">{p.leads_count ?? 0}</td>
                    <td className="px-5 py-3.5 text-center">
                      {p.user_id ? (
                        <span className="inline-flex items-center gap-1 text-[10px] font-medium text-success">
                          <KeyRound className="h-3 w-3" /> Есть
                        </span>
                      ) : (
                        <span className="text-[10px] text-muted-foreground">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${p.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="relative">
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === p.id ? null : p.id); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {menuOpen === p.id && (
                          <div className="absolute right-0 top-full mt-1 w-40 rounded-xl border border-border bg-card shadow-lg z-30 overflow-hidden">
                            <button
                              onClick={(e) => { e.stopPropagation(); setSelectedPartner(p.id); setMenuOpen(null); }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted/40 transition-colors"
                            >
                              Открыть профиль
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updatePartner.mutate({ id: p.id, is_active: !p.is_active });
                                setMenuOpen(null);
                                toast({ title: p.is_active ? "Партнёр деактивирован" : "Партнёр активирован" });
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted/40 transition-colors"
                            >
                              {p.is_active ? "Деактивировать" : "Активировать"}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteTarget(p); setMenuOpen(null); }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-destructive hover:bg-destructive/5 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              Удалить
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
        </div>
      )}

      {/* Add partner modal */}
      <Modal
        open={addOpen}
        onClose={() => { setAddOpen(false); resetForm(); }}
        title="Новый партнёр"
        footer={
          <>
            <button onClick={() => { setAddOpen(false); resetForm(); }} className="h-9 px-4 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">Отмена</button>
            <button onClick={handleAdd} disabled={!formContactName.trim() || !formName.trim() || !formEmail.trim() || !formSiteId || (createAccount && formPassword.trim().length < 6) || creating} className="h-9 px-4 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40 flex items-center gap-2">
              {creating && <Loader2 className="h-3.5 w-3.5 animate-spin" />}
              Добавить
            </button>
          </>
        }
      >
        <div className="grid grid-cols-2 gap-4">
          {/* Site selection */}
          <div className="col-span-2">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Сайт (магазин) *</label>
            <select
              value={formSiteId}
              onChange={(e) => handleSelectSite(e.target.value)}
              className={inputCls}
            >
              <option value="">— Выберите сайт —</option>
              {sites.map((s) => {
                const taken = takenSiteIds.has(s.id);
                return (
                  <option key={s.id} value={s.id} disabled={taken}>
                    {s.name}{s.domain ? ` — ${s.domain}` : ""}{taken ? " (уже привязан)" : ""}
                  </option>
                );
              })}
            </select>
            <p className="mt-1 text-[10px] text-muted-foreground">К каждому сайту можно привязать одного партнёра-владельца.</p>
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Имя партнёра (ФИО) *</label>
            <input value={formContactName} onChange={(e) => setFormContactName(e.target.value)} placeholder="Иван Иванов" className={inputCls} />
          </div>

          <div className="col-span-2">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Название магазина *</label>
            <input value={formName} onChange={(e) => setFormName(e.target.value)} placeholder="BRANDOORS Район" className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Email (логин) *</label>
            <input type="email" value={formEmail} onChange={(e) => setFormEmail(e.target.value)} placeholder="partner@brandoors.su" className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Телефон</label>
            <input value={formPhone} onChange={(e) => setFormPhone(e.target.value)} placeholder="+7 (999) 123-45-67" className={inputCls} />
          </div>

          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Город</label>
            <input value={formCity} onChange={(e) => setFormCity(e.target.value)} className={inputCls} />
          </div>
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Район</label>
            <input value={formDistrict} onChange={(e) => setFormDistrict(e.target.value)} placeholder="ЮВАО" className={inputCls} />
          </div>
          <div className="col-span-2">
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Пароль {createAccount ? "*" : ""}</label>
            <input type="text" value={formPassword} onChange={(e) => setFormPassword(e.target.value)} placeholder="Минимум 6 символов" disabled={!createAccount} className={inputCls} />
          </div>

          {/* Account toggle */}
          <div className="col-span-2 rounded-xl border border-border bg-muted/30 p-3">
            <label className="flex items-center gap-2.5 cursor-pointer">
              <input type="checkbox" checked={createAccount} onChange={(e) => setCreateAccount(e.target.checked)} className="h-4 w-4 rounded accent-foreground" />
              <div>
                <p className="text-xs font-medium text-foreground">Создать аккаунт для входа в CRM</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">По этому email и сгенерированному паролю партнёр войдёт в crm.brandoors.su и попадёт в свой кабинет.</p>
              </div>
            </label>
          </div>
        </div>
      </Modal>

      {/* Credentials modal */}
      <Modal
        open={!!credentials}
        onClose={() => setCredentials(null)}
        title="Аккаунт партнёра создан"
        footer={
          <button
            onClick={() => {
              navigator.clipboard.writeText(`Email: ${credentials?.email}\nПароль: ${credentials?.password}`);
              toast({ title: "Скопировано в буфер обмена" });
            }}
            className="h-9 px-4 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors"
          >
            Скопировать
          </button>
        }
      >
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Сохраните данные — пароль показывается только один раз.</p>
          <div className="rounded-xl bg-muted p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Email:</span>
              <span className="font-medium text-foreground font-mono">{credentials?.email}</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Пароль:</span>
              <span className="font-medium text-foreground font-mono">{credentials?.password}</span>
            </div>
          </div>
        </div>
      </Modal>

      <ConfirmDialog open={!!deleteTarget} onClose={() => setDeleteTarget(null)} onConfirm={() => deleteTarget && handleDelete(deleteTarget)} title="Удалить партнёра" description={`Вы уверены, что хотите удалить ${deleteTarget?.name}? Это действие нельзя отменить.`} confirmLabel="Удалить" destructive />
    </div>
  );
}
