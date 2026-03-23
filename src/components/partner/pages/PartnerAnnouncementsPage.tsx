import { PartnerHeader } from "../PartnerHeader";
import { Megaphone, AlertTriangle, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { ru } from "date-fns/locale";

export function PartnerAnnouncementsPage({ onNavigate }: { onNavigate: (s: string) => void }) {
  const { data: announcements = [], isLoading } = useQuery({
    queryKey: ["partner-announcements"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("announcements")
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
  });

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      <PartnerHeader title="Объявления от Brandoors" onNavigate={onNavigate} />

      {announcements.length > 0 && (
        <div className="flex items-center gap-2 px-4 py-3 rounded-xl bg-primary/5 border border-primary/10 mb-5">
          <Megaphone className="h-4 w-4 text-foreground shrink-0" />
          <p className="text-sm text-foreground">
            <span className="font-semibold">{announcements.length}</span> объявлений
          </p>
        </div>
      )}

      <div className="space-y-3">
        {isLoading && <div className="text-center py-12 text-sm text-muted-foreground">Загрузка...</div>}
        {!isLoading && announcements.length === 0 && (
          <div className="text-center py-12 text-sm text-muted-foreground">Объявлений пока нет</div>
        )}
        {announcements.map((a: any) => (
          <div key={a.id} className="rounded-2xl border border-border bg-card p-5 transition-shadow hover:shadow-sm cursor-pointer">
            <div className="flex items-start gap-3">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 mb-1.5">
                  <h3 className="text-sm font-semibold text-foreground">{a.title}</h3>
                  {a.is_urgent && (
                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium bg-destructive/10 text-destructive">
                      <AlertTriangle className="h-3 w-3" />Важно
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed mb-2">{a.content}</p>
                <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {formatDistanceToNow(new Date(a.created_at), { addSuffix: true, locale: ru })}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
