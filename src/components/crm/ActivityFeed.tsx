import { FileText, Users, Package, Bell, UserPlus, Edit } from "lucide-react";

const activities = [
  { icon: FileText, text: "Новая заявка от Алексея Петрова", partner: "Марьино", time: "5 мин назад", color: "text-[hsl(210_80%_52%)]" },
  { icon: UserPlus, text: "Новый партнёр подключён", partner: "Сокольники", time: "1 час назад", color: "text-success" },
  { icon: Edit, text: "Каталог обновлён: +3 товара", partner: "", time: "2 часа назад", color: "text-foreground" },
  { icon: FileText, text: "Заявка завершена", partner: "Митино", time: "3 часа назад", color: "text-success" },
  { icon: Package, text: "Цена изменена: Milano Premium", partner: "", time: "4 часа назад", color: "text-warning" },
  { icon: Users, text: "Партнёр обновил контент", partner: "Тёплый Стан", time: "5 часов назад", color: "text-foreground" },
];

export function ActivityFeed() {
  return (
    <div className="rounded-2xl border border-border bg-card opacity-0 animate-fade-up" style={{ animationDelay: "450ms" }}>
      <div className="flex items-center justify-between px-5 py-4 border-b border-border">
        <h3 className="text-sm font-semibold text-foreground">Активность</h3>
      </div>
      <div className="divide-y divide-border max-h-[340px] overflow-y-auto">
        {activities.map((a, i) => (
          <div key={i} className="flex items-start gap-3 px-5 py-3 hover:bg-muted/40 transition-colors">
            <div className={`mt-0.5 ${a.color}`}>
              <a.icon className="h-3.5 w-3.5" strokeWidth={2} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-foreground leading-snug">{a.text}</p>
              <div className="flex items-center gap-2 mt-0.5">
                {a.partner && (
                  <span className="text-[10px] font-medium text-muted-foreground">{a.partner}</span>
                )}
                <span className="text-[10px] text-muted-foreground">{a.time}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
