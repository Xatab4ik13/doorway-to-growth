import { PartnerHeader } from "../PartnerHeader";
import { Megaphone, AlertTriangle, Clock } from "lucide-react";

const mockAnnouncements = [
  { id: 1, title: "Новая коллекция Milano 2026", text: "Уважаемые партнёры! С 1 апреля стартуют продажи новой коллекции Milano 2026. Каталог уже обновлён, промо-материалы доступны для скачивания.", date: "22 марта 2026", urgent: false, read: false },
  { id: 2, title: "Изменение РРЦ с 1 апреля", text: "Обратите внимание: с 1 апреля вступают в силу новые рекомендованные розничные цены на линейку Classic. Актуальные прайсы направлены на почту.", date: "20 марта 2026", urgent: true, read: false },
  { id: 3, title: "Тренинг для менеджеров", text: "25 марта в 14:00 состоится онлайн-тренинг по технике продаж дверей премиум-сегмента. Ссылка для подключения будет отправлена за час до начала.", date: "18 марта 2026", urgent: false, read: true },
  { id: 4, title: "Обновление материалов", text: "Добавлены новые фото и описания для 15 позиций каталога. Проверьте актуальность отображения на вашем сайте.", date: "15 марта 2026", urgent: false, read: true },
];

export function PartnerAnnouncementsPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const unreadCount = mockAnnouncements.filter((a) => !a.read).length;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <PartnerHeader title="Объявления от Brandoors" onNavigate={onNavigate} />

      {unreadCount > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 mb-5">
          <Megaphone className="h-4 w-4 text-foreground shrink-0" />
          <p className="text-sm text-foreground">
            У вас <span className="font-semibold">{unreadCount}</span> непрочитанных объявлений
          </p>
        </div>
      )}

      <div className="space-y-3">
        {mockAnnouncements.map((a) => (
          <div
            key={a.id}
            className={`rounded-2xl border bg-card p-5 transition-shadow hover:shadow-sm cursor-pointer ${
              !a.read ? "border-primary/20 bg-primary/[0.02]" : "border-border"
            }`}
          >
            <div className="flex items-start gap-3">
              {!a.read && <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />}
              {a.read && <span className="mt-1.5 h-2 w-2 shrink-0" />}
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className={`text-sm font-semibold ${!a.read ? "text-foreground" : "text-muted-foreground"}`}>{a.title}</h3>
                  {a.urgent && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-3 w-3" />
                      Важно
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{a.text}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {a.date}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
