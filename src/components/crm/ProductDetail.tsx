import { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import type { Product } from "@/hooks/useProducts";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const configurations = [
  { label: "Полотно", options: ["600 мм", "700 мм", "800 мм", "900 мм"] },
  { label: "Покрытие", options: ["Экошпон", "ПВХ", "Эмаль", "Массив"] },
  { label: "Стекло", options: ["Без стекла", "Матовое", "Прозрачное", "С рисунком"] },
  { label: "Фурнитура", options: ["Стандарт", "Премиум", "Без фурнитуры"] },
];

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const images = [1, 2, 3, 4]; // placeholder gallery

  const specs = product.specifications as Record<string, string> | null;
  const specEntries = specs ? Object.entries(specs) : [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[85vh] rounded-2xl border border-border bg-card shadow-xl overflow-y-auto animate-fade-up">
        <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground">{product.name}</h3>
          <button onClick={onClose} className="flex h-7 w-7 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 gap-8 md:grid-cols-2">
            {/* Gallery */}
            <div>
              <div className="relative aspect-square rounded-2xl bg-muted flex items-center justify-center text-sm text-muted-foreground font-medium overflow-hidden">
                {product.primary_image ? (
                  <img src={product.primary_image} alt={product.name} className="w-full h-full object-cover" />
                ) : `Фото ${activeImage + 1}`}
                <button onClick={() => setActiveImage(Math.max(0, activeImage - 1))} className="absolute left-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm hover:bg-card active:scale-95 transition-all">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button onClick={() => setActiveImage(Math.min(images.length - 1, activeImage + 1))} className="absolute right-2 top-1/2 -translate-y-1/2 flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-foreground shadow-sm hover:bg-card active:scale-95 transition-all">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
              <div className="flex gap-2 mt-3">
                {images.map((_, i) => (
                  <button key={i} onClick={() => setActiveImage(i)} className={`h-14 w-14 rounded-xl bg-muted flex items-center justify-center text-[10px] text-muted-foreground transition-all active:scale-95 ${activeImage === i ? "ring-2 ring-foreground" : "hover:ring-1 hover:ring-border"}`}>
                    {i + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Info */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {product.category?.name ?? "Без категории"}
                </span>
                <span className={`h-2.5 w-2.5 rounded-full ${product.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
                <span className="text-xs text-muted-foreground">{product.is_active ? "Активен" : "Неактивен"}</span>
              </div>

              <h2 className="text-xl font-semibold text-foreground mb-1">{product.name}</h2>
              <p className="text-2xl font-semibold tabular-nums text-foreground mb-2">
                {product.rrp ? `${product.rrp.toLocaleString("ru-RU")} ₽` : "Цена не указана"}
              </p>
              {product.description && (
                <p className="text-sm text-muted-foreground mb-6">{product.description}</p>
              )}

              {/* Specs from JSONB */}
              {specEntries.length > 0 && (
                <>
                  <h4 className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-2">Характеристики</h4>
                  <div className="space-y-1.5 mb-6">
                    {specEntries.map(([key, value]) => (
                      <div key={key} className="flex items-center justify-between py-1.5 text-sm border-b border-border last:border-0">
                        <span className="text-muted-foreground capitalize">{key}</span>
                        <span className="font-medium text-foreground">{value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {/* Configurations */}
              <h4 className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-3">Комплектация</h4>
              <div className="space-y-3">
                {configurations.map((c) => (
                  <div key={c.label}>
                    <p className="text-xs font-medium text-foreground mb-1.5">{c.label}</p>
                    <div className="flex flex-wrap gap-1.5">
                      {c.options.map((opt, i) => (
                        <button key={opt} className={`h-7 px-2.5 rounded-lg text-[11px] font-medium transition-colors active:scale-95 ${i === 0 ? "bg-foreground text-primary-foreground" : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"}`}>
                          {opt}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
