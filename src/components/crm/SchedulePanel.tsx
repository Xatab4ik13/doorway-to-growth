import { ChevronLeft, ChevronRight } from "lucide-react";

const days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
const dates = [17, 18, 19, 20, 21, 22, 23];
const today = 21;

const events = [
  {
    time: "10:00",
    title: "Встреча с партнёром Марьино",
    duration: "45 мин",
    color: "hsl(var(--foreground))",
  },
  {
    time: "11:30",
    title: "Обзвон новых лидов",
    duration: "30 мин",
    color: "hsl(var(--success))",
  },
  {
    time: "14:00",
    title: "Проверка каталога",
    duration: "1 час",
    color: "hsl(var(--warning))",
  },
];

export function SchedulePanel() {
  return (
    <div className="rounded-2xl border border-border bg-card opacity-0 animate-fade-up" style={{ animationDelay: "350ms" }}>
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Расписание</h3>
        <button className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Month + nav */}
      <div className="flex items-center justify-between px-5 pt-4 pb-2">
        <span className="text-xs font-medium text-muted-foreground">Март 2026</span>
        <div className="flex items-center gap-1">
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button className="flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Day selector */}
      <div className="flex items-center gap-1 px-5 pb-4">
        {days.map((day, i) => {
          const isToday = dates[i] === today;
          return (
            <button
              key={day}
              className={`flex flex-1 flex-col items-center gap-0.5 rounded-xl py-2 text-[10px] font-medium transition-colors active:scale-95 ${
                isToday
                  ? "bg-foreground text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted"
              }`}
            >
              <span>{day}</span>
              <span className={`text-sm font-semibold tabular-nums ${isToday ? "text-primary-foreground" : "text-foreground"}`}>
                {dates[i]}
              </span>
            </button>
          );
        })}
      </div>

      {/* Events */}
      <div className="border-t border-border">
        {events.map((event, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3 transition-colors hover:bg-muted/40">
            <span className="mt-0.5 text-xs font-medium text-muted-foreground tabular-nums w-10 shrink-0">
              {event.time}
            </span>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span
                  className="h-2 w-2 shrink-0 rounded-full"
                  style={{ backgroundColor: event.color }}
                />
                <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
              </div>
              <p className="mt-0.5 text-[11px] text-muted-foreground ml-4">{event.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
