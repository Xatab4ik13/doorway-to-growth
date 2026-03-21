import { Megaphone, ArrowUpRight } from "lucide-react";

const announcements = [
  {
    title: "Обновление каталога: весенняя коллекция 2026",
    text: "В каталог добавлены 12 новых моделей межкомнатных дверей. Обновите витрину на сайтах.",
    date: "21.03.2026",
    urgent: true,
  },
  {
    title: "Новые условия по РРЦ",
    text: "С 01.04 вступают в силу обновлённые рекомендованные розничные цены. Подробности в разделе каталога.",
    date: "18.03.2026",
    urgent: false,
  },
  {
    title: "Акция для партнёров: бесплатные замеры",
    text: "Запущена федеральная акция — бесплатные замеры для всех клиентов до 30.04.",
    date: "15.03.2026",
    urgent: false,
  },
];

export function Announcements() {
  return (
    <div className="opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold text-foreground">Объявления для партнёров</h3>
        </div>
        <button className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors active:scale-95">
          Все
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
        {announcements.map((a, i) => (
          <div
            key={i}
            className="rounded-2xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-card-hover"
          >
            <div className="flex items-start justify-between gap-2 mb-2">
              <h4 className="text-sm font-medium text-foreground leading-snug">{a.title}</h4>
              {a.urgent && (
                <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                  Важно
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{a.text}</p>
            <p className="mt-3 text-[10px] text-muted-foreground tabular-nums">{a.date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
