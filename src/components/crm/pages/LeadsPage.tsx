import { useState, useCallback } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Search, MoreHorizontal, ArrowUpDown, List, Columns3, X, GripVertical, ChevronDown } from "lucide-react";
import { useLeads, useUpdateLeadStage, type Lead, type LeadStage } from "@/hooks/useLeads";
import { formatDistanceToNow, format } from "date-fns";
import { ru } from "date-fns/locale";

const kanbanStatuses = ["new", "consultation", "quote", "paid", "completed"] as const;
type KanbanStatus = (typeof kanbanStatuses)[number];

const statusLabels: Record<LeadStage, string> = {
  new: "Новая",
  consultation: "Консультация",
  quote: "КП",
  paid: "Оплачено",
  completed: "Завершена",
  cancelled: "Отменена",
};

const statusStyles: Record<LeadStage, string> = {
  new: "bg-[hsl(210_80%_52%/0.12)] text-[hsl(210,80%,52%)]",
  consultation: "bg-[hsl(190_60%_45%/0.12)] text-[hsl(190,60%,45%)]",
  quote: "bg-[hsl(30_70%_50%/0.12)] text-[hsl(30,70%,50%)]",
  paid: "bg-success/12 text-success",
  completed: "bg-foreground/10 text-foreground",
  cancelled: "bg-destructive/12 text-destructive",
};

const kanbanColumnColors: Record<KanbanStatus, string> = {
  new: "bg-[hsl(210,80%,52%)]",
  consultation: "bg-[hsl(190,60%,45%)]",
  quote: "bg-[hsl(30,70%,50%)]",
  paid: "bg-success",
  completed: "bg-foreground",
};

const PAGE_SIZE = 10;

const getInitials = (name: string) =>
  name.split(" ").map((w) => w[0]).filter(Boolean).slice(0, 2).join("").toUpperCase();

export function LeadsPage() {
  const { data: leads = [], isLoading } = useLeads();
  const updateStage = useUpdateLeadStage();

  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "kanban">("kanban");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [page, setPage] = useState(1);

  const [draggedId, setDraggedId] = useState<string | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanStatus | null>(null);

  const filtered = leads.filter((l) => {
    const q = search.toLowerCase();
    return (
      l.name.toLowerCase().includes(q) ||
      (l.partner?.name?.toLowerCase().includes(q) ?? false) ||
      (l.product?.name?.toLowerCase().includes(q) ?? false)
    );
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleDragStart = useCallback((e: React.DragEvent, leadId: string) => {
    setDraggedId(leadId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", leadId);
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: KanbanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => setDragOverColumn(null), []);

  const handleDrop = useCallback(
    (e: React.DragEvent, targetStatus: KanbanStatus) => {
      e.preventDefault();
      const leadId = e.dataTransfer.getData("text/plain");
      if (leadId) updateStage.mutate({ id: leadId, stage: targetStatus });
      setDraggedId(null);
      setDragOverColumn(null);
    },
    [updateStage]
  );

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverColumn(null);
  }, []);

  const formatShortDate = (iso: string) => {
    try {
      return format(new Date(iso), "dd.MM.yyyy HH:mm");
    } catch {
      return iso;
    }
  };

  const formatRelative = (iso: string) => {
    try {
      return formatDistanceToNow(new Date(iso), { addSuffix: true, locale: ru });
    } catch {
      return iso;
    }
  };

  return (
    <div className="px-4 sm:px-8 py-6 h-screen flex flex-col">
      <CrmHeader title="Заявки" />

      {/* Stats row */}
      <div className="flex items-center gap-4 sm:gap-6 mb-6 opacity-0 animate-fade-up flex-wrap">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-semibold tabular-nums text-foreground">{leads.length}</span>
          <span className="text-sm text-muted-foreground">всего</span>
        </div>
        <div className="h-5 w-px bg-border hidden sm:block" />
        <div className="flex items-center gap-3 sm:gap-6 flex-wrap">
          {kanbanStatuses.map((s) => (
            <div key={s} className="flex items-center gap-1.5">
              <span className={`h-2 w-2 rounded-full ${kanbanColumnColors[s]}`} />
              <span className="text-sm tabular-nums text-foreground">
                {leads.filter((l) => l.stage === s).length}
              </span>
              <span className="text-xs text-muted-foreground hidden sm:inline">
                {statusLabels[s].toLowerCase()}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center justify-between gap-4 mb-6 opacity-0 animate-fade-up" style={{ animationDelay: "80ms" }}>
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Поиск по имени, партнёру или товару..."
              className="h-9 w-full rounded-xl border border-border bg-card pl-9 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
            />
          </div>
        </div>
        <div className="flex items-center rounded-xl border border-border bg-card overflow-hidden shrink-0">
          <button
            onClick={() => setView("kanban")}
            className={`flex h-9 w-9 items-center justify-center transition-colors active:scale-95 ${
              view === "kanban" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <Columns3 className="h-4 w-4" />
          </button>
          <button
            onClick={() => setView("table")}
            className={`flex h-9 w-9 items-center justify-center transition-colors active:scale-95 ${
              view === "table" ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <List className="h-4 w-4" />
          </button>
        </div>
      </div>

      {isLoading && (
        <div className="text-center py-12 text-sm text-muted-foreground">Загрузка...</div>
      )}

      {/* Kanban view */}
      {!isLoading && view === "kanban" && (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
          {kanbanStatuses.map((status) => {
            const columnLeads = leads.filter((l) => l.stage === status);
            const isOver = dragOverColumn === status;
            return (
              <div
                key={status}
                className={`flex w-[240px] sm:w-[260px] shrink-0 flex-col rounded-2xl transition-colors duration-200 ${isOver ? "bg-muted/60" : ""}`}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${kanbanColumnColors[status]}`} />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{statusLabels[status]}</span>
                  <span className="ml-auto text-xs font-medium text-muted-foreground tabular-nums">{columnLeads.length}</span>
                </div>
                <div className="flex flex-col gap-2.5 flex-1 px-1 min-h-[80px]">
                  {columnLeads.map((lead) => (
                    <div
                      key={lead.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, lead.id)}
                      onDragEnd={handleDragEnd}
                      onClick={() => setSelectedLead(lead)}
                      className={`text-left rounded-2xl border border-border bg-card p-4 transition-all duration-200 hover:shadow-card-hover active:scale-[0.98] cursor-grab active:cursor-grabbing ${
                        draggedId === lead.id ? "opacity-40 scale-[0.97]" : ""
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-3.5 w-3.5 text-muted-foreground/40 shrink-0 -ml-1" />
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-[11px] font-semibold text-foreground">
                          {getInitials(lead.name)}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{lead.product?.name ?? "—"}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground truncate">
                          {lead.partner?.name?.replace("Brandoors ", "") ?? "—"}
                        </span>
                      </div>
                      <p className="mt-2 text-[10px] text-muted-foreground tabular-nums">{formatShortDate(lead.created_at)}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {!isLoading && view === "table" && (
        <>
          {filtered.length === 0 ? (
            <EmptyState title="Заявки не найдены" description="Попробуйте изменить параметры поиска" action={{ label: "Сбросить", onClick: () => setSearch("") }} />
          ) : (
            <div className="rounded-2xl border border-border bg-card overflow-hidden opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Клиент</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Товар</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">Партнёр</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                          Дата <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
                      <th className="px-5 py-3.5 w-10"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginated.map((l) => (
                      <tr
                        key={l.id}
                        onClick={() => setSelectedLead(l)}
                        className="border-b border-border last:border-0 transition-all duration-200 hover:bg-muted/40 hover:shadow-[inset_3px_0_0_hsl(var(--foreground))] cursor-pointer"
                      >
                        <td className="px-5 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold text-foreground">
                              {getInitials(l.name)}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{l.name}</p>
                              <p className="text-[11px] text-muted-foreground">{l.phone ?? "—"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-foreground">{l.product?.name ?? "—"}</td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground hidden md:table-cell">{l.partner?.name ?? "—"}</td>
                        <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">{formatShortDate(l.created_at)}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[l.stage]}`}>
                            {statusLabels[l.stage]}
                          </span>
                        </td>
                        <td className="px-5 py-3.5">
                          <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
                            <MoreHorizontal className="h-4 w-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} totalItems={filtered.length} pageSize={PAGE_SIZE} />
            </div>
          )}
        </>
      )}

      {/* Lead detail slide-over */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 flex justify-end">
          <div className="absolute inset-0 bg-foreground/20 animate-fade-in" onClick={() => setSelectedLead(null)} />
          <div className="relative w-full max-w-md bg-card border-l border-border shadow-xl animate-slide-in-right flex flex-col">
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Детали заявки</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {getInitials(selectedLead.name)}
                </div>
                <div className="min-w-0">
                  <p className="text-base font-semibold text-foreground truncate">{selectedLead.name}</p>
                  <p className="text-sm text-muted-foreground truncate">{selectedLead.phone ?? "—"}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Товар</p>
                  <p className="text-sm text-foreground mt-0.5">{selectedLead.product?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Партнёр</p>
                  <p className="text-sm text-foreground mt-0.5 truncate">{selectedLead.partner?.name ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Email</p>
                  <p className="text-sm text-foreground mt-0.5 truncate">{selectedLead.email ?? "—"}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Источник</p>
                  <p className="text-sm text-foreground mt-0.5">{selectedLead.source ?? "—"}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Статус</p>
                  <div className="relative mt-1 inline-block">
                    <select
                      value={selectedLead.stage}
                      onChange={(e) => {
                        const newStage = e.target.value as LeadStage;
                        updateStage.mutate({ id: selectedLead.id, stage: newStage });
                        setSelectedLead({ ...selectedLead, stage: newStage });
                      }}
                      className={`appearance-none rounded-full pl-2.5 pr-6 py-0.5 text-[11px] font-medium border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-ring/20 ${statusStyles[selectedLead.stage]}`}
                    >
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <option key={key} value={key}>{label}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 h-3 w-3 pointer-events-none" />
                  </div>
                </div>
                <div className="col-span-2">
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Создана</p>
                  <p className="text-sm text-foreground mt-0.5">
                    {formatShortDate(selectedLead.created_at)}{" "}
                    <span className="text-muted-foreground">({formatRelative(selectedLead.created_at)})</span>
                  </p>
                </div>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
              {selectedLead.message && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Сообщение</p>
                  <div className="rounded-xl bg-muted/40 px-3 py-2.5 text-sm text-foreground whitespace-pre-wrap">
                    {selectedLead.message}
                  </div>
                </div>
              )}
              {selectedLead.notes && (
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium mb-1.5">Заметки</p>
                  <div className="rounded-xl bg-muted/40 px-3 py-2.5 text-sm text-foreground whitespace-pre-wrap">
                    {selectedLead.notes}
                  </div>
                </div>
              )}
              {!selectedLead.message && !selectedLead.notes && (
                <p className="text-sm text-muted-foreground text-center py-8">Дополнительной информации нет</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
