import { useState, useRef, useCallback } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Pagination } from "@/components/crm/Pagination";
import { EmptyState } from "@/components/crm/EmptyState";
import { Search, MoreHorizontal, ArrowUpDown, List, Columns3, MessageSquare, X, Send, GripVertical, Paperclip, FileImage, FileText as FileIcon, Clock, ChevronDown } from "lucide-react";

interface Lead {
  id: number;
  name: string;
  phone: string;
  type: string;
  partner: string;
  date: string;
  status: "new" | "contact" | "consult" | "measure" | "quote" | "contract" | "install" | "done" | "rejected";
  score: number;
  source: "phone" | "form" | "email";
}

const kanbanStatuses = ["new", "consult", "measure", "quote", "contract", "install", "done"] as const;
type KanbanStatus = (typeof kanbanStatuses)[number];

const statusLabels: Record<Lead["status"], string> = {
  new: "Новая",
  contact: "Контакт",
  consult: "Консультация",
  measure: "Замер",
  quote: "КП",
  contract: "Договор",
  install: "Монтаж",
  done: "Завершена",
  rejected: "Отклонена",
};

const statusStyles: Record<Lead["status"], string> = {
  new: "bg-[hsl(210_80%_52%/0.12)] text-[hsl(210,80%,52%)]",
  contact: "bg-warning/12 text-warning",
  consult: "bg-[hsl(190_60%_45%/0.12)] text-[hsl(190,60%,45%)]",
  measure: "bg-[hsl(270_60%_55%/0.12)] text-[hsl(270,60%,55%)]",
  quote: "bg-[hsl(30_70%_50%/0.12)] text-[hsl(30,70%,50%)]",
  contract: "bg-success/12 text-success",
  install: "bg-[hsl(330_55%_50%/0.12)] text-[hsl(330,55%,50%)]",
  done: "bg-foreground/10 text-foreground",
  rejected: "bg-destructive/12 text-destructive",
};

const kanbanColumnColors: Record<KanbanStatus, string> = {
  new: "bg-[hsl(210,80%,52%)]",
  consult: "bg-[hsl(190,60%,45%)]",
  measure: "bg-[hsl(270,60%,55%)]",
  quote: "bg-[hsl(30,70%,50%)]",
  contract: "bg-success",
  install: "bg-[hsl(330,55%,50%)]",
  done: "bg-foreground",
};

const initialLeads: Lead[] = [
  { id: 1, name: "Алексей Петров", phone: "+7 (926) 123-45-67", type: "Замер двери", partner: "Brandoors Марьино", date: "21.03.2026 14:24", status: "new", score: 82, source: "phone" },
  { id: 2, name: "Елена Сидорова", phone: "+7 (903) 234-56-78", type: "Консультация", partner: "Brandoors Митино", date: "21.03.2026 13:47", status: "consult", score: 64, source: "form" },
  { id: 3, name: "Дмитрий Козлов", phone: "+7 (915) 345-67-89", type: "Покупка двери", partner: "Brandoors Тёплый Стан", date: "21.03.2026 12:10", status: "done", score: 91, source: "phone" },
  { id: 4, name: "Ольга Иванова", phone: "+7 (977) 456-78-90", type: "Обратный звонок", partner: "Brandoors Люблино", date: "21.03.2026 11:33", status: "new", score: 20, source: "email" },
  { id: 5, name: "Сергей Морозов", phone: "+7 (916) 567-89-01", type: "Замер двери", partner: "Brandoors Марьино", date: "21.03.2026 10:15", status: "measure", score: 73, source: "form" },
  { id: 6, name: "Анна Белова", phone: "+7 (925) 678-90-12", type: "Покупка двери", partner: "Brandoors Сокольники", date: "20.03.2026 18:42", status: "rejected", score: 15, source: "email" },
  { id: 7, name: "Виктор Чернов", phone: "+7 (909) 789-01-23", type: "Консультация", partner: "Brandoors Митино", date: "20.03.2026 16:30", status: "contract", score: 88, source: "phone" },
  { id: 8, name: "Наталья Крылова", phone: "+7 (926) 890-12-34", type: "Замер двери", partner: "Brandoors Тёплый Стан", date: "20.03.2026 15:18", status: "quote", score: 56, source: "form" },
];

const mockHistory = [
  { time: "14:24", text: "Заявка создана с сайта", type: "system" as const },
  { time: "14:30", text: "Партнёр взял в работу", type: "system" as const },
  { time: "14:45", text: "Перезвонили клиенту, договорились на замер 23.03", type: "note" as const },
  { time: "15:10", text: "Клиент подтвердил время замера", type: "note" as const },
];

const PAGE_SIZE = 10;

export function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [search, setSearch] = useState("");
  const [view, setView] = useState<"table" | "kanban">("kanban");
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [statusFilter] = useState<Lead["status"] | "all">("all");
  const [page, setPage] = useState(1);

  // Drag & drop state
  const [draggedId, setDraggedId] = useState<number | null>(null);
  const [dragOverColumn, setDragOverColumn] = useState<KanbanStatus | null>(null);

  const filtered = leads.filter((l) => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) || l.partner.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === "all" || l.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // Drag handlers
  const handleDragStart = useCallback((e: React.DragEvent, leadId: number) => {
    setDraggedId(leadId);
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", String(leadId));
  }, []);

  const handleDragOver = useCallback((e: React.DragEvent, status: KanbanStatus) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverColumn(status);
  }, []);

  const handleDragLeave = useCallback(() => {
    setDragOverColumn(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent, targetStatus: KanbanStatus) => {
    e.preventDefault();
    const leadId = Number(e.dataTransfer.getData("text/plain"));
    setLeads(prev => prev.map(l => l.id === leadId ? { ...l, status: targetStatus } : l));
    setDraggedId(null);
    setDragOverColumn(null);
  }, []);

  const handleDragEnd = useCallback(() => {
    setDraggedId(null);
    setDragOverColumn(null);
  }, []);

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
              <span className="text-sm tabular-nums text-foreground">{leads.filter(l => l.status === s).length}</span>
              <span className="text-xs text-muted-foreground hidden sm:inline">{statusLabels[s].toLowerCase()}</span>
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
              placeholder="Поиск по имени или партнёру..."
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

      {/* Kanban view */}
      {view === "kanban" && (
        <div className="flex-1 flex gap-4 overflow-x-auto pb-4 opacity-0 animate-fade-up" style={{ animationDelay: "160ms" }}>
          {kanbanStatuses.map((status) => {
            const columnLeads = leads.filter((l) => l.status === status);
            const isOver = dragOverColumn === status;
            return (
              <div
                key={status}
                className={`flex w-[240px] sm:w-[260px] shrink-0 flex-col rounded-2xl transition-colors duration-200 ${isOver ? "bg-muted/60" : ""}`}
                onDragOver={(e) => handleDragOver(e, status)}
                onDragLeave={handleDragLeave}
                onDrop={(e) => handleDrop(e, status)}
              >
                {/* Column header */}
                <div className="flex items-center gap-2 mb-3 px-1">
                  <span className={`h-2.5 w-2.5 rounded-full ${kanbanColumnColors[status]}`} />
                  <span className="text-xs font-semibold text-foreground uppercase tracking-wider">{statusLabels[status]}</span>
                  <span className="ml-auto text-xs font-medium text-muted-foreground tabular-nums">{columnLeads.length}</span>
                </div>
                {/* Cards */}
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
                          {lead.name.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-foreground truncate">{lead.name}</p>
                          <p className="text-[11px] text-muted-foreground truncate">{lead.type}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex items-center justify-between">
                        <span className="text-[10px] text-muted-foreground truncate">{lead.partner.replace("Brandoors ", "")}</span>
                        <div
                          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold ${
                            lead.score >= 70
                              ? "bg-success/12 text-success"
                              : lead.score >= 40
                              ? "bg-warning/12 text-warning"
                              : "bg-muted text-muted-foreground"
                          }`}
                        >
                          {lead.score}
                        </div>
                      </div>
                      <p className="mt-2 text-[10px] text-muted-foreground tabular-nums">{lead.date}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Table view */}
      {view === "table" && (
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
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Тип</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden md:table-cell">Партнёр</th>
                      <th className="px-5 py-3.5 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
                        <div className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors">
                          Дата <ArrowUpDown className="h-3 w-3" />
                        </div>
                      </th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground">Статус</th>
                      <th className="px-5 py-3.5 text-center text-[11px] font-medium uppercase tracking-wider text-muted-foreground hidden sm:table-cell">Скоринг</th>
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
                              {l.name.split(" ").map(n => n[0]).join("")}
                            </div>
                            <div>
                              <p className="text-sm font-medium text-foreground">{l.name}</p>
                              <p className="text-[11px] text-muted-foreground">{l.phone}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-sm text-foreground">{l.type}</td>
                        <td className="px-5 py-3.5 text-sm text-muted-foreground hidden md:table-cell">{l.partner}</td>
                        <td className="px-5 py-3.5 text-sm tabular-nums text-muted-foreground">{l.date}</td>
                        <td className="px-5 py-3.5 text-center">
                          <span className={`inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[l.status]}`}>
                            {statusLabels[l.status]}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-center hidden sm:table-cell">
                          <div
                            className={`inline-flex h-7 w-7 items-center justify-center rounded-full text-[11px] font-semibold ${
                              l.score >= 70
                                ? "bg-success/12 text-success"
                                : l.score >= 40
                                ? "bg-warning/12 text-warning"
                                : "bg-muted text-muted-foreground"
                            }`}
                          >
                            {l.score}
                          </div>
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
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-border">
              <h3 className="text-sm font-semibold text-foreground">Детали заявки</h3>
              <button
                onClick={() => setSelectedLead(null)}
                className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Client info */}
            <div className="px-6 py-5 border-b border-border">
              <div className="flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted text-sm font-semibold text-foreground">
                  {selectedLead.name.split(" ").map(n => n[0]).join("")}
                </div>
                <div>
                  <p className="text-base font-semibold text-foreground">{selectedLead.name}</p>
                  <p className="text-sm text-muted-foreground">{selectedLead.phone}</p>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Тип</p>
                  <p className="text-sm text-foreground mt-0.5">{selectedLead.type}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Партнёр</p>
                  <p className="text-sm text-foreground mt-0.5">{selectedLead.partner.replace("Brandoors ", "")}</p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Статус</p>
                  <span className={`mt-1 inline-block rounded-full px-2.5 py-0.5 text-[10px] font-medium ${statusStyles[selectedLead.status]}`}>
                    {statusLabels[selectedLead.status]}
                  </span>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider text-muted-foreground font-medium">Скоринг</p>
                  <p className="text-sm font-semibold text-foreground mt-0.5 tabular-nums">{selectedLead.score}</p>
                </div>
              </div>
            </div>

            {/* Communication history */}
            <div className="flex-1 overflow-y-auto px-6 py-4">
              <h4 className="text-xs font-semibold text-foreground uppercase tracking-wider mb-3">История</h4>
              <div className="space-y-3">
                {mockHistory.map((h, i) => (
                  <div key={i} className="flex gap-3 opacity-0 animate-fade-up-stagger" style={{ animationDelay: `${i * 80}ms` }}>
                    <span className="text-[10px] font-medium text-muted-foreground tabular-nums w-10 shrink-0 pt-0.5">{h.time}</span>
                    <div className="flex-1">
                      <div className={`rounded-xl px-3 py-2 text-sm ${
                        h.type === "system"
                          ? "bg-muted text-muted-foreground"
                          : "bg-foreground/5 text-foreground"
                      }`}>
                        {h.text}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Note input */}
            <div className="border-t border-border px-6 py-4">
              <div className="relative">
                <input
                  placeholder="Добавить заметку..."
                  className="h-10 w-full rounded-xl border border-border bg-background pl-4 pr-10 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow"
                />
                <button className="absolute right-1.5 top-1/2 -translate-y-1/2 flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted active:scale-95 transition-colors">
                  <Send className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
