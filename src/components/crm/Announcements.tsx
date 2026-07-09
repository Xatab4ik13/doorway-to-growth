import { Megaphone, ArrowUpRight } from "lucide-react";
import { useCrmNavigation } from "./CrmNavigationContext";
import { useAnnouncements } from "@/hooks/useAnnouncements";

export function Announcements() {
  const { navigate } = useCrmNavigation();
  const { data: announcements = [], isLoading } = useAnnouncements();
  const items = announcements.slice(0, 3);

  return (
    <div className="opacity-0 animate-fade-up" style={{ animationDelay: "500ms" }}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Megaphone className="h-4 w-4 text-muted-foreground" strokeWidth={1.8} />
          <h3 className="text-sm font-semibold text-foreground">Объявления для партнёров</h3>
        </div>
        <button
          onClick={() => navigate("announcements")}
          className="flex items-center gap-1 text-xs font-medium text-muted-foreground hover:text-foreground transition-colors active:scale-95"
        >
          Все
          <ArrowUpRight className="h-3 w-3" />
        </button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="h-[110px] rounded-2xl border border-border bg-card animate-pulse" />
          ))}
        </div>
      ) : items.length === 0 ? (
        <button
          onClick={() => navigate("announcements")}
          className="w-full rounded-2xl border border-dashed border-border bg-card/50 p-6 text-center hover:bg-card transition-colors"
        >
          <p className="text-sm text-muted-foreground">Пока нет объявлений</p>
          <p className="text-xs text-muted-foreground mt-1">Создайте первое объявление для партнёров</p>
        </button>
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {items.map((a) => (
            <button
              key={a.id}
              onClick={() => navigate("announcements")}
              className="text-left rounded-2xl border border-border bg-card p-4 transition-shadow duration-200 hover:shadow-card-hover"
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <h4 className="text-sm font-medium text-foreground leading-snug">{a.title}</h4>
                {a.is_urgent && (
                  <span className="shrink-0 rounded-full bg-destructive/10 px-2 py-0.5 text-[10px] font-medium text-destructive">
                    Важно
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">{a.content}</p>
              <p className="mt-3 text-[10px] text-muted-foreground tabular-nums">
                {new Date(a.created_at).toLocaleDateString("ru-RU")}
              </p>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
