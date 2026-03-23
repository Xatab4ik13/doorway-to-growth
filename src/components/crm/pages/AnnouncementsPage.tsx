import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Modal } from "@/components/crm/Modal";
import { EmptyState } from "@/components/crm/EmptyState";
import { Megaphone, Plus, Search, Trash2, Eye, Users, AlertTriangle, CheckCircle2, Edit2 } from "lucide-react";
import { useAnnouncements, useCreateAnnouncement, useDeleteAnnouncement, type Announcement } from "@/hooks/useAnnouncements";

export function AnnouncementsPage() {
  const { data: announcements = [], isLoading } = useAnnouncements();
  const createAnnouncement = useCreateAnnouncement();
  const deleteAnnouncement = useDeleteAnnouncement();

  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState<Announcement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);

  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formUrgent, setFormUrgent] = useState(false);

  const filtered = announcements.filter((a) => {
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const resetForm = () => { setFormTitle(""); setFormText(""); setFormUrgent(false); };

  const handleCreate = () => {
    if (!formTitle.trim() || !formText.trim()) return;
    createAnnouncement.mutate({ title: formTitle, content: formText, is_urgent: formUrgent });
    setCreateOpen(false);
    resetForm();
  };

  const handleDelete = (id: string) => {
    deleteAnnouncement.mutate(id);
    setDeleteConfirm(null);
  };

  if (isLoading) {
    return (
      <div className="flex-1 px-4 sm:px-8 py-6 min-w-0">
        <CrmHeader title="Объявления" />
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 px-4 sm:px-8 py-6 min-w-0">
      <CrmHeader title="Объявления" />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="text"
              placeholder="Поиск объявлений..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="h-9 w-full sm:w-64 rounded-lg border border-border bg-card pl-9 pr-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setCreateOpen(true); }}
          className="flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-4 text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors shrink-0"
        >
          <Plus className="h-3.5 w-3.5" />
          Новое объявление
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
        {[
          { label: "Всего", value: announcements.length, icon: Megaphone },
          { label: "Важных", value: announcements.filter(a => a.is_urgent).length, icon: AlertTriangle },
          { label: "За этот месяц", value: announcements.filter(a => new Date(a.created_at).getMonth() === new Date().getMonth()).length, icon: CheckCircle2 },
        ].map((stat) => (
          <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-muted">
              <stat.icon className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
            </div>
            <div>
              <p className="text-xl font-semibold tabular-nums text-foreground">{stat.value}</p>
              <p className="text-[11px] text-muted-foreground">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* List */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Нет объявлений"
          description={search ? "Попробуйте изменить поисковый запрос" : "Создайте первое объявление для партнёров"}
          action={{ label: "Создать объявление", onClick: () => { resetForm(); setCreateOpen(true); } }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div key={a.id} className="rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-card-hover">
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {a.is_urgent && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">Важно</span>
                    )}
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-snug mb-1">{a.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{a.content}</p>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <button onClick={() => setViewOpen(a)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors" title="Просмотреть">
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button onClick={() => setDeleteConfirm(a.id)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-colors" title="Удалить">
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <span className="text-[11px] text-muted-foreground tabular-nums">
                  {new Date(a.created_at).toLocaleDateString("ru-RU")}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Create modal */}
      <Modal
        open={createOpen}
        onClose={() => setCreateOpen(false)}
        title="Новое объявление"
        footer={
          <button
            onClick={handleCreate}
            disabled={!formTitle.trim() || !formText.trim()}
            className="h-9 rounded-lg bg-foreground px-4 text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40 disabled:pointer-events-none"
          >
            Опубликовать
          </button>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Заголовок</label>
            <input type="text" value={formTitle} onChange={(e) => setFormTitle(e.target.value)} placeholder="Введите заголовок" className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow" />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Текст объявления</label>
            <textarea value={formText} onChange={(e) => setFormText(e.target.value)} placeholder="Опишите подробности..." rows={4} className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={formUrgent} onChange={(e) => setFormUrgent(e.target.checked)} className="h-4 w-4 rounded border-border text-foreground focus:ring-ring" />
            <span className="text-sm text-foreground">Пометить как важное</span>
          </label>
        </div>
      </Modal>

      {/* View modal */}
      <Modal open={!!viewOpen} onClose={() => setViewOpen(null)} title="Просмотр объявления">
        {viewOpen && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {viewOpen.is_urgent && (
                <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive">Важно</span>
              )}
            </div>
            <h3 className="text-base font-semibold text-foreground">{viewOpen.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{viewOpen.content}</p>
            <div className="pt-3 border-t border-border">
              <span className="text-xs text-muted-foreground tabular-nums">{new Date(viewOpen.created_at).toLocaleDateString("ru-RU")}</span>
            </div>
          </div>
        )}
      </Modal>

      {/* Delete confirmation */}
      <Modal
        open={deleteConfirm !== null}
        onClose={() => setDeleteConfirm(null)}
        title="Удалить объявление?"
        footer={
          <>
            <button onClick={() => setDeleteConfirm(null)} className="h-9 rounded-lg border border-border px-4 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">Отмена</button>
            <button onClick={() => deleteConfirm && handleDelete(deleteConfirm)} className="h-9 rounded-lg bg-destructive px-4 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 active:scale-95 transition-colors">Удалить</button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Это действие нельзя отменить.</p>
      </Modal>
    </div>
  );
}
