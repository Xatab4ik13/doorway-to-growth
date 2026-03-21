import { useState } from "react";
import { CrmHeader } from "@/components/crm/CrmHeader";
import { Modal } from "@/components/crm/Modal";
import { EmptyState } from "@/components/crm/EmptyState";
import { Megaphone, Plus, Search, Filter, Trash2, Edit2, Eye, Users, AlertTriangle, CheckCircle2 } from "lucide-react";

interface Announcement {
  id: number;
  title: string;
  text: string;
  date: string;
  urgent: boolean;
  recipients: string;
  readCount: number;
  totalRecipients: number;
  status: "published" | "draft";
}

const mockAnnouncements: Announcement[] = [
  {
    id: 1,
    title: "Обновление каталога: весенняя коллекция 2026",
    text: "В каталог добавлены 12 новых моделей межкомнатных дверей серии Milano и Torex. Обновите витрину на ваших сайтах для актуального отображения ассортимента.",
    date: "21.03.2026",
    urgent: true,
    recipients: "Все партнёры",
    readCount: 3,
    totalRecipients: 5,
    status: "published",
  },
  {
    id: 2,
    title: "Новые условия по РРЦ с 01.04",
    text: "С 1 апреля вступают в силу обновлённые рекомендованные розничные цены на весь ассортимент. Подробности и новые прайс-листы доступны в разделе каталога.",
    date: "18.03.2026",
    urgent: false,
    recipients: "Все партнёры",
    readCount: 5,
    totalRecipients: 5,
    status: "published",
  },
  {
    id: 3,
    title: "Акция: бесплатные замеры до 30.04",
    text: "Запущена федеральная акция — бесплатные замеры для всех клиентов до конца апреля. Используйте баннеры из маркетинговых материалов на своих сайтах.",
    date: "15.03.2026",
    urgent: false,
    recipients: "Все партнёры",
    readCount: 4,
    totalRecipients: 5,
    status: "published",
  },
  {
    id: 4,
    title: "Обучение: новые стандарты монтажа",
    text: "Вебинар по обновлённым стандартам монтажа входных дверей. Обязателен для всех монтажных бригад партнёров.",
    date: "12.03.2026",
    urgent: false,
    recipients: "Москва Юг",
    readCount: 2,
    totalRecipients: 2,
    status: "published",
  },
  {
    id: 5,
    title: "Чёрная пятница — подготовка",
    text: "Начинаем подготовку к осенней распродаже. Детали условий и скидок будут опубликованы позже.",
    date: "10.03.2026",
    urgent: false,
    recipients: "Все партнёры",
    readCount: 0,
    totalRecipients: 5,
    status: "draft",
  },
];

const partnerGroups = ["Все партнёры", "Москва Юг", "Москва Север", "Москва Запад", "Москва Восток"];

export function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState(mockAnnouncements);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "published" | "draft">("all");
  const [createOpen, setCreateOpen] = useState(false);
  const [viewOpen, setViewOpen] = useState<Announcement | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  // Form state
  const [formTitle, setFormTitle] = useState("");
  const [formText, setFormText] = useState("");
  const [formUrgent, setFormUrgent] = useState(false);
  const [formRecipients, setFormRecipients] = useState("Все партнёры");

  const filtered = announcements.filter((a) => {
    if (filterStatus !== "all" && a.status !== filterStatus) return false;
    if (search && !a.title.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const resetForm = () => {
    setFormTitle("");
    setFormText("");
    setFormUrgent(false);
    setFormRecipients("Все партнёры");
  };

  const handleCreate = (asDraft: boolean) => {
    const newAnnouncement: Announcement = {
      id: Date.now(),
      title: formTitle,
      text: formText,
      date: new Date().toLocaleDateString("ru-RU", { day: "2-digit", month: "2-digit", year: "numeric" }),
      urgent: formUrgent,
      recipients: formRecipients,
      readCount: 0,
      totalRecipients: formRecipients === "Все партнёры" ? 5 : 2,
      status: asDraft ? "draft" : "published",
    };
    setAnnouncements([newAnnouncement, ...announcements]);
    setCreateOpen(false);
    resetForm();
  };

  const handleDelete = (id: number) => {
    setAnnouncements(announcements.filter((a) => a.id !== id));
    setDeleteConfirm(null);
  };

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
          <div className="flex items-center rounded-lg border border-border bg-card overflow-hidden shrink-0">
            {(["all", "published", "draft"] as const).map((s) => (
              <button
                key={s}
                onClick={() => setFilterStatus(s)}
                className={`h-9 px-3 text-xs font-medium transition-colors active:scale-95 ${
                  filterStatus === s ? "bg-foreground text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {s === "all" ? "Все" : s === "published" ? "Опубликованные" : "Черновики"}
              </button>
            ))}
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
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
        {[
          { label: "Всего", value: announcements.length, icon: Megaphone },
          { label: "Опубликовано", value: announcements.filter(a => a.status === "published").length, icon: CheckCircle2 },
          { label: "Черновики", value: announcements.filter(a => a.status === "draft").length, icon: Edit2 },
          { label: "Важных", value: announcements.filter(a => a.urgent).length, icon: AlertTriangle },
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

      {/* Announcements list */}
      {filtered.length === 0 ? (
        <EmptyState
          icon={Megaphone}
          title="Нет объявлений"
          description={search ? "Попробуйте изменить поисковый запрос" : "Создайте первое объявление для партнёров"}
          actionLabel="Создать объявление"
          onAction={() => { resetForm(); setCreateOpen(true); }}
        />
      ) : (
        <div className="space-y-3">
          {filtered.map((a) => (
            <div
              key={a.id}
              className="rounded-2xl border border-border bg-card p-5 transition-shadow duration-200 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap mb-1.5">
                    {a.urgent && (
                      <span className="rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                        Важно
                      </span>
                    )}
                    <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${
                      a.status === "published"
                        ? "bg-success/12 text-success"
                        : "bg-muted text-muted-foreground"
                    }`}>
                      {a.status === "published" ? "Опубликовано" : "Черновик"}
                    </span>
                  </div>
                  <h4 className="text-sm font-semibold text-foreground leading-snug mb-1">{a.title}</h4>
                  <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{a.text}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => setViewOpen(a)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors"
                    title="Просмотреть"
                  >
                    <Eye className="h-3.5 w-3.5" />
                  </button>
                  <button
                    onClick={() => setDeleteConfirm(a.id)}
                    className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-destructive/10 hover:text-destructive active:scale-95 transition-colors"
                    title="Удалить"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3 w-3 text-muted-foreground" />
                    <span className="text-[11px] text-muted-foreground">{a.recipients}</span>
                  </div>
                  <span className="text-[11px] text-muted-foreground tabular-nums">
                    Прочитали: {a.readCount}/{a.totalRecipients}
                  </span>
                </div>
                <span className="text-[11px] text-muted-foreground tabular-nums">{a.date}</span>
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
          <>
            <button
              onClick={() => handleCreate(true)}
              disabled={!formTitle.trim()}
              className="h-9 rounded-lg border border-border px-4 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              Сохранить черновик
            </button>
            <button
              onClick={() => handleCreate(false)}
              disabled={!formTitle.trim() || !formText.trim()}
              className="h-9 rounded-lg bg-foreground px-4 text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40 disabled:pointer-events-none"
            >
              Опубликовать
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Заголовок</label>
            <input
              type="text"
              value={formTitle}
              onChange={(e) => setFormTitle(e.target.value)}
              placeholder="Введите заголовок объявления"
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Текст объявления</label>
            <textarea
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              placeholder="Опишите подробности..."
              rows={4}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow resize-none"
            />
          </div>
          <div>
            <label className="text-xs font-medium text-foreground mb-1.5 block">Получатели</label>
            <select
              value={formRecipients}
              onChange={(e) => setFormRecipients(e.target.value)}
              className="h-9 w-full rounded-lg border border-border bg-background px-3 text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-shadow appearance-none"
            >
              {partnerGroups.map((g) => (
                <option key={g} value={g}>{g}</option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={formUrgent}
              onChange={(e) => setFormUrgent(e.target.checked)}
              className="h-4 w-4 rounded border-border text-foreground focus:ring-ring"
            />
            <span className="text-sm text-foreground">Пометить как важное</span>
          </label>
        </div>
      </Modal>

      {/* View modal */}
      <Modal
        open={!!viewOpen}
        onClose={() => setViewOpen(null)}
        title="Просмотр объявления"
      >
        {viewOpen && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 flex-wrap">
              {viewOpen.urgent && (
                <span className="rounded-full bg-destructive/10 px-2.5 py-0.5 text-[11px] font-medium text-destructive">
                  Важно
                </span>
              )}
              <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-medium ${
                viewOpen.status === "published"
                  ? "bg-success/12 text-success"
                  : "bg-muted text-muted-foreground"
              }`}>
                {viewOpen.status === "published" ? "Опубликовано" : "Черновик"}
              </span>
            </div>
            <h3 className="text-base font-semibold text-foreground">{viewOpen.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{viewOpen.text}</p>
            <div className="flex items-center gap-4 pt-3 border-t border-border">
              <div className="flex items-center gap-1.5">
                <Users className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">{viewOpen.recipients}</span>
              </div>
              <span className="text-xs text-muted-foreground tabular-nums">
                Прочитали: {viewOpen.readCount}/{viewOpen.totalRecipients}
              </span>
              <span className="text-xs text-muted-foreground tabular-nums ml-auto">{viewOpen.date}</span>
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
            <button
              onClick={() => setDeleteConfirm(null)}
              className="h-9 rounded-lg border border-border px-4 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors"
            >
              Отмена
            </button>
            <button
              onClick={() => deleteConfirm !== null && handleDelete(deleteConfirm)}
              className="h-9 rounded-lg bg-destructive px-4 text-xs font-medium text-destructive-foreground hover:bg-destructive/90 active:scale-95 transition-colors"
            >
              Удалить
            </button>
          </>
        }
      >
        <p className="text-sm text-muted-foreground">Это действие нельзя отменить. Партнёры больше не увидят это объявление.</p>
      </Modal>
    </div>
  );
}
