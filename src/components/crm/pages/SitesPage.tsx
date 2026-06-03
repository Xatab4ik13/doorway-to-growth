import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Modal } from "@/components/crm/Modal";
import { ConfirmDialog } from "@/components/crm/ConfirmDialog";
import { Search, Globe, MoreHorizontal, Trash2, Link2, UserPlus, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useSites, useDeleteSite, useUpdateSite, type Site } from "@/hooks/useSites";
import { usePartners } from "@/hooks/usePartners";

const PAGE_SIZE = 10;

export function SitesPage() {
  const { data: sites = [], isLoading } = useSites();
  const { data: partners = [] } = usePartners();
  const deleteSiteMut = useDeleteSite();
  const updateSite = useUpdateSite();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");
  const [page, setPage] = useState(1);
  const [deleteTarget, setDeleteTarget] = useState<Site | null>(null);
  const [menuOpen, setMenuOpen] = useState<string | null>(null);
  const [assignOpen, setAssignOpen] = useState<Site | null>(null);
  const [assignPartnerId, setAssignPartnerId] = useState("");
  const [domainOpen, setDomainOpen] = useState<Site | null>(null);
  const [domainValue, setDomainValue] = useState("");
  const [domainChecking, setDomainChecking] = useState(false);
  const [domainCheckResult, setDomainCheckResult] = useState<null | { ok: boolean; message: string }>(null);

  const normalizeDomain = (raw: string) =>
    raw.trim().toLowerCase().replace(/^https?:\/\//, "").replace(/\/.*$/, "").replace(/\s+/g, "");

  const handleSaveDomain = async () => {
    if (!domainOpen) return;
    const value = normalizeDomain(domainValue);
    if (value && !/^[a-z0-9.-]+\.[a-z]{2,}$/i.test(value)) {
      toast({ title: "Некорректный домен", description: "Пример: dveri-msk.ru", variant: "destructive" });
      return;
    }
    await updateSite.mutateAsync({ id: domainOpen.id, domain: value || null } as any);
    toast({ title: value ? "Домен сохранён" : "Домен удалён" });
    setDomainOpen(null);
    setDomainValue("");
    setDomainCheckResult(null);
  };

  const handleCheckDomain = async () => {
    const value = normalizeDomain(domainValue);
    if (!value) return;
    setDomainChecking(true);
    setDomainCheckResult(null);
    try {
      const res = await fetch(`https://${value}`, { method: "HEAD", mode: "no-cors" });
      // no-cors returns opaque; reaching here means DNS resolved + TCP/TLS handshake succeeded
      setDomainCheckResult({ ok: true, message: "Домен отвечает. Убедитесь, что он привязан к Timeweb." });
    } catch (e: any) {
      setDomainCheckResult({ ok: false, message: "Домен не отвечает. Проверьте DNS и SSL в Timeweb." });
    } finally {
      setDomainChecking(false);
    }
  };

  const inputCls = "h-10 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow";

  const handleAssignPartner = async () => {
    if (!assignOpen || !assignPartnerId) return;
    const { error } = await (await import("@/integrations/supabase/client")).supabase
      .from("partners")
      .update({ site_id: assignOpen.id })
      .eq("id", assignPartnerId);
    if (error) {
      toast({ title: "Ошибка", description: error.message, variant: "destructive" });
    } else {
      toast({ title: "Партнёр привязан к сайту" });
      window.location.reload();
    }
    setAssignOpen(null);
    setAssignPartnerId("");
  };

  const filtered = sites.filter((s) => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || (s.district ?? "").toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || (filter === "active" ? s.is_active : !s.is_active);
    return matchSearch && matchFilter;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  if (isLoading) {
    return (
      <div className="px-4 sm:px-8 py-6">
        <CrmHeader title="Сайты" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-8 py-6">
      <CrmHeader title="Сайты" />

      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 flex-wrap">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Поиск сайта..."
              className="h-9 w-56 sm:w-64 rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
            />
          </div>
          <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden">
            {(["all", "active", "inactive"] as const).map((f) => (
              <button key={f} onClick={() => { setFilter(f); setPage(1); }}
                className={`h-9 px-3.5 text-xs font-medium transition-colors active:scale-95 ${filter === f ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>
                {f === "all" ? "Все" : f === "active" ? "Активные" : "Неактивные"}
              </button>
            ))}
          </div>
        </div>
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Globe}
          title={sites.length === 0 ? "Нет сайтов" : "Сайты не найдены"}
          description={sites.length === 0 ? "Сайты создаются через систему управления" : "Измените параметры поиска"}
          action={sites.length > 0
            ? { label: "Сбросить", onClick: () => { setSearch(""); setFilter("all"); } }
            : undefined
          }
        />
      ) : (
        <div className="rounded-2xl border border-border bg-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[750px]">
              <thead>
                <tr className="border-b border-border">
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Сайт</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Район</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">Домен</th>
                  <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Партнёр</th>
                  <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
                  <th className="px-5 py-3.5 w-10"></th>
                </tr>
              </thead>
              <tbody>
                {paginated.map((s) => (
                  <tr key={s.id} className="border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/40 cursor-pointer">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-muted">
                          <Globe className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
                        </div>
                        <div>
                          <p className="text-sm font-medium text-foreground">{s.name}</p>
                          <p className="text-[11px] text-muted-foreground">{s.address ?? s.city}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                        {s.district ?? "—"}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      {s.domain ? (
                        <span className="flex items-center gap-1 text-xs text-foreground">
                          <Link2 className="h-3 w-3 text-muted-foreground" />
                          {s.domain}
                        </span>
                      ) : (
                        <span className="text-xs text-muted-foreground">/{s.slug}</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      {s.partner ? (
                        <span className="text-xs font-medium text-foreground">{s.partner.name}</span>
                      ) : (
                        <button
                          onClick={(e) => { e.stopPropagation(); setAssignOpen(s); }}
                          className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
                        >
                          <UserPlus className="h-3 w-3" /> Назначить
                        </button>
                      )}
                    </td>
                    <td className="px-5 py-3.5 text-center">
                      <span className={`inline-block h-2.5 w-2.5 rounded-full ${s.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="relative flex items-center gap-1">
                        <a
                          href={s.domain ? `https://${s.domain}` : `/store/${s.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors"
                          title="Открыть сайт"
                        >
                          <ExternalLink className="h-3.5 w-3.5" />
                        </a>
                        <button
                          onClick={(e) => { e.stopPropagation(); setMenuOpen(menuOpen === s.id ? null : s.id); }}
                          className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>
                        {menuOpen === s.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 rounded-xl border border-border bg-card shadow-lg z-30 overflow-hidden">
                            <button
                              onClick={(e) => { e.stopPropagation(); setAssignOpen(s); setMenuOpen(null); }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted/40 transition-colors"
                            >
                              <UserPlus className="h-3.5 w-3.5" /> Назначить партнёра
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDomainOpen(s); setDomainValue(s.domain ?? ""); setDomainCheckResult(null); setMenuOpen(null); }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted/40 transition-colors"
                            >
                              <Link2 className="h-3.5 w-3.5" /> {s.domain ? "Изменить домен" : "Привязать домен"}
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                updateSite.mutate({ id: s.id, is_active: !s.is_active } as any);
                                setMenuOpen(null);
                                toast({ title: s.is_active ? "Сайт деактивирован" : "Сайт активирован" });
                              }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-foreground hover:bg-muted/40 transition-colors"
                            >
                              {s.is_active ? "Деактивировать" : "Активировать"}
                            </button>
                            <button
                              onClick={(e) => { e.stopPropagation(); setDeleteTarget(s); setMenuOpen(null); }}
                              className="flex w-full items-center gap-2 px-3 py-2.5 text-xs text-destructive hover:bg-destructive/5 transition-colors"
                            >
                              <Trash2 className="h-3.5 w-3.5" /> Удалить
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

      {/* Assign partner modal */}
      <Modal open={!!assignOpen} onClose={() => { setAssignOpen(null); setAssignPartnerId(""); }} title={`Назначить партнёра — ${assignOpen?.name}`}
        footer={
          <>
            <button onClick={() => { setAssignOpen(null); setAssignPartnerId(""); }} className="h-9 px-4 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">Отмена</button>
            <button onClick={handleAssignPartner} disabled={!assignPartnerId} className="h-9 px-4 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40">Назначить</button>
          </>
        }
      >
        <div>
          <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Выберите партнёра</label>
          <select value={assignPartnerId} onChange={(e) => setAssignPartnerId(e.target.value)} className={inputCls}>
            <option value="">— Выберите —</option>
            {partners.map((p) => (
              <option key={p.id} value={p.id}>{p.name} ({p.city})</option>
            ))}
          </select>
        </div>
      </Modal>

      {/* Domain modal */}
      <Modal
        open={!!domainOpen}
        onClose={() => { setDomainOpen(null); setDomainValue(""); setDomainCheckResult(null); }}
        title={`Домен — ${domainOpen?.name}`}
        footer={
          <>
            <button onClick={() => { setDomainOpen(null); setDomainValue(""); setDomainCheckResult(null); }} className="h-9 px-4 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">Отмена</button>
            <button onClick={handleSaveDomain} className="h-9 px-4 rounded-xl bg-foreground text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors">Сохранить</button>
          </>
        }
      >
        <div className="space-y-3">
          <div>
            <label className="block text-[11px] font-medium uppercase tracking-wider text-muted-foreground mb-1.5">Домен</label>
            <input
              value={domainValue}
              onChange={(e) => { setDomainValue(e.target.value); setDomainCheckResult(null); }}
              placeholder="dveri-msk.ru"
              className={inputCls}
              autoFocus
            />
            <p className="mt-1.5 text-[11px] text-muted-foreground leading-relaxed">
              Без https:// и без слеша. Точно как в браузере. Оставьте пустым, чтобы отвязать.
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3 space-y-2">
            <p className="text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Чек-лист подключения</p>
            <ul className="text-xs text-foreground space-y-1 list-disc pl-4">
              <li>Привязать домен к контейнеру в Timeweb Apps → Домены</li>
              <li>DNS: A-запись на IP контейнера или CNAME на технический домен Timeweb</li>
              <li>Подтвердить SSL (Let's Encrypt) для домена в Timeweb</li>
              <li>Значение в этом поле = ровно тот хост, что в адресной строке</li>
            </ul>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCheckDomain}
              disabled={!domainValue || domainChecking}
              className="h-9 px-3.5 rounded-xl border border-border text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors disabled:opacity-40"
            >
              {domainChecking ? "Проверка..." : "Проверить домен"}
            </button>
            {domainCheckResult && (
              <span className={`text-xs ${domainCheckResult.ok ? "text-success" : "text-destructive"}`}>
                {domainCheckResult.message}
              </span>
            )}
          </div>
        </div>
      </Modal>



      {/* Delete confirmation */}
      <ConfirmDialog
        open={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={() => {
          if (deleteTarget) {
            deleteSiteMut.mutate(deleteTarget.id);
            setDeleteTarget(null);
          }
        }}
        title="Удалить сайт"
        description={`Вы уверены, что хотите удалить сайт «${deleteTarget?.name}»? Это действие нельзя отменить.`}
        confirmLabel="Удалить"
        destructive
      />
    </div>
  );
}
