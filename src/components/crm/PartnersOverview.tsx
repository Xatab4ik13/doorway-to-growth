import { MapPin, ExternalLink } from "lucide-react";

const partners = [
  { name: "Brandoors Марьино", zone: "Марьино, ЮВАО", leads: 24, status: "active" },
  { name: "Brandoors Тёплый Стан", zone: "Тёплый Стан, ЮЗАО", leads: 18, status: "active" },
  { name: "Brandoors Митино", zone: "Митино, СЗАО", leads: 31, status: "active" },
  { name: "Brandoors Люблино", zone: "Люблино, ЮВАО", leads: 12, status: "active" },
  { name: "Brandoors Сокольники", zone: "Сокольники, ВАО", leads: 9, status: "pending" },
];

export function PartnersOverview() {
  return (
    <div className="rounded-xl border border-border bg-card shadow-card opacity-0 animate-fade-in" style={{ animationDelay: "400ms" }}>
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <h3 className="text-sm font-semibold text-foreground">Партнёры</h3>
        <button className="text-xs font-medium text-primary hover:underline active:scale-[0.97]">
          Все партнёры
        </button>
      </div>
      <div className="divide-y divide-border">
        {partners.map((p, i) => (
          <div
            key={i}
            className="flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-secondary/50"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary">
              <MapPin className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
              <p className="truncate text-xs text-muted-foreground">{p.zone}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold tabular-nums text-foreground">{p.leads}</p>
              <p className="text-xs text-muted-foreground">заявок</p>
            </div>
            <span
              className={`h-2 w-2 shrink-0 rounded-full ${
                p.status === "active" ? "bg-success" : "bg-warning"
              }`}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
