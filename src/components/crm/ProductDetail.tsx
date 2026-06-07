import { useState, useRef, useCallback } from "react";
import { X, Save, Plus, Trash2, Upload, ImageIcon, Link2, Image as ImageLucide } from "lucide-react";
import { useUpdateProduct, type Product } from "@/hooks/useProducts";
import { useProductImages } from "@/hooks/useProductImages";
import { toast } from "@/hooks/use-toast";

interface ProductDetailProps {
  product: Product;
  onClose: () => void;
}

const SPEC_LABELS: Record<string, string> = {
  color: "Цвет",
  glazing: "Остекление",
  covering: "Покрытие",
  material: "Материал",
  style: "Стиль",
  collection: "Коллекция",
  markup_height: "Наценка за высоту",
  markup_width: "Наценка за ширину",
  glazing_options: "Остекление",
  sizes_stock_note: "Размеры (склад)",
  sizes_order_note: "Размеры (под заказ)",
};

const COMPLEX_KEYS = new Set(["sizes", "variants", "colors"]);

// Палитра покрытий Brandoors — должна совпадать с цветами в карточке товара витрины
const COATING_PALETTE: { name: string; hex: string }[] = [
  // Нейтральные
  { name: "Аляска", hex: "#F5F0E8" },
  { name: "Магнолия", hex: "#F0E6D4" },
  { name: "Манхэттен", hex: "#B8AFA4" },
  { name: "Силк Грей", hex: "#9E9A94" },
  { name: "Варм Грей", hex: "#A89B8C" },
  { name: "Туман", hex: "#A8A5A0" },
  { name: "Милк", hex: "#F2EDE3" },
  { name: "Белый", hex: "#F6F4EE" },
  { name: "Белый жемчуг", hex: "#EFEAE0" },
  { name: "Серый", hex: "#8C8B88" },
  { name: "Графит", hex: "#3F4145" },
  { name: "Антрацит", hex: "#2E3033" },
  { name: "Черный", hex: "#15161A" },
  { name: "Черный глянец", hex: "#0E0F12" },
  // Дерево
  { name: "Орех Натуральный", hex: "#8B5A35" },
  { name: "Орех Бохо", hex: "#5C3520" },
  { name: "Орех Пацифик", hex: "#6B4A35" },
  { name: "Дуб Керамика", hex: "#C8B89A" },
  { name: "Дуб Светло-серый", hex: "#B3ADA2" },
  { name: "Обветренный Тик", hex: "#8D7458" },
  { name: "Итальянский тисненый", hex: "#A88563" },
  { name: "Карамельный Мусс", hex: "#B58456" },
  { name: "Кофе", hex: "#5A3A2A" },
  { name: "Кофе глянец", hex: "#3D2418" },
  // Цветные
  { name: "Blue", hex: "#1B3A5C" },
  { name: "Blue Green", hex: "#264C57" },
  { name: "Deep Green", hex: "#1F3A2E" },
  { name: "Green", hex: "#2A4A3E" },
];

export function ProductDetail({ product, onClose }: ProductDetailProps) {
  const [activeImage, setActiveImage] = useState(0);
  const updateProduct = useUpdateProduct();
  const { images, uploading, uploadImage, deleteImage, setVariantKey } = useProductImages(product.id);

  const rawSpecs = (product.specifications ?? {}) as Record<string, any>;
  const sizes: any[] = Array.isArray(rawSpecs.sizes) ? rawSpecs.sizes : [];
  const variants: any[] = Array.isArray(rawSpecs.variants) ? rawSpecs.variants : [];
  const flatSpecs = Object.entries(rawSpecs).filter(
    ([k, v]) => !COMPLEX_KEYS.has(k) && v != null && v !== "" && typeof v !== "object"
  );

  const [editName, setEditName] = useState(product.name);
  const [editRrp, setEditRrp] = useState(String(product.rrp ?? ""));
  const [editDesc, setEditDesc] = useState(product.description ?? "");
  const [editSpecs, setEditSpecs] = useState<[string, string][]>(
    flatSpecs.map(([k, v]) => [k, String(v)])
  );
  const [editActive, setEditActive] = useState(product.is_active ?? true);
  const [newSpecKey, setNewSpecKey] = useState("");
  const [newSpecVal, setNewSpecVal] = useState("");
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSave = () => {
    const specsObj: Record<string, any> = {};
    editSpecs.forEach(([k, v]) => { if (k && v) specsObj[k] = v; });
    if (sizes.length > 0) specsObj.sizes = sizes;
    if (variants.length > 0) specsObj.variants = variants;
    updateProduct.mutate(
      { id: product.id, name: editName.trim(), rrp: editRrp ? Number(editRrp) : null, description: editDesc.trim() || null, specifications: specsObj, is_active: editActive } as any,
      { onSuccess: () => { toast({ title: "Товар сохранён" }); onClose(); } }
    );
  };

  const addSpec = () => {
    if (newSpecKey.trim() && newSpecVal.trim()) {
      setEditSpecs([...editSpecs, [newSpecKey.trim(), newSpecVal.trim()]]);
      setNewSpecKey(""); setNewSpecVal("");
    }
  };

  const removeSpec = (idx: number) => setEditSpecs(editSpecs.filter((_, i) => i !== idx));
  const updateSpecVal = (idx: number, val: string) => {
    const next = [...editSpecs];
    next[idx] = [next[idx][0], val];
    setEditSpecs(next);
  };

  const handleFiles = useCallback((files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (file.type.startsWith("image/")) uploadImage(file);
    });
  }, [uploadImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const allImages = images.length > 0 ? images : (product.primary_image ? [{ id: "legacy", url: product.primary_image, is_primary: true }] : []);
  const currentImage = allImages[activeImage] ?? allImages[0];
  const currentVariantKey: string | null = currentImage ? ((currentImage as any).variant_key ?? null) : null;
  const currentSwatch = currentVariantKey ? COATING_PALETTE.find((c) => c.name.toLowerCase() === currentVariantKey.toLowerCase()) : null;

  const inputCls = "h-9 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow";

  // Сколько фото уже привязаны к цветам
  const boundCount = allImages.filter((img) => (img as any).variant_key).length;

  return (
    <div className="fixed inset-0 z-50 bg-background flex flex-col animate-fade-in">
      {/* Sticky header */}
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 px-4 sm:px-8 py-3 border-b border-border bg-card">
        <div className="flex items-center gap-3 min-w-0 flex-1">
          <button
            onClick={onClose}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors shrink-0"
            aria-label="Закрыть"
          >
            <X className="h-4 w-4" />
          </button>
          <div className="min-w-0">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">
              {product.category?.name ?? "Без категории"} · Редактирование товара
            </div>
            <h3 className="text-sm font-semibold text-foreground truncate">{product.name}</h3>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <label className="hidden sm:flex items-center gap-1.5 cursor-pointer text-xs text-muted-foreground">
            <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="h-4 w-4 rounded accent-foreground" />
            <span>{editActive ? "Активен" : "Скрыт"}</span>
          </label>
          <button
            onClick={handleSave}
            disabled={updateProduct.isPending}
            className="flex h-9 items-center gap-1.5 rounded-lg bg-foreground px-4 text-xs font-semibold text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40"
          >
            <Save className="h-3.5 w-3.5" /> Сохранить
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto">
        <div className="mx-auto max-w-[1400px] px-4 sm:px-8 py-6 grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)] gap-8">
          {/* ===== LEFT: Gallery & color binding ===== */}
          <div className="space-y-4">
            {/* Active image */}
            <div
              className={`relative aspect-[4/5] rounded-2xl bg-muted flex items-center justify-center overflow-hidden transition-colors ${dragOver ? "ring-2 ring-primary bg-primary/5" : "border border-border"}`}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={handleDrop}
            >
              {currentImage ? (
                <img src={currentImage.url} alt={product.name} className="w-full h-full object-contain" />
              ) : (
                <div className="flex flex-col items-center gap-2 text-muted-foreground">
                  <ImageIcon className="h-10 w-10" />
                  <span className="text-xs">Перетащите фото сюда или нажмите «Загрузить»</span>
                </div>
              )}
              {uploading && (
                <div className="absolute inset-0 bg-background/60 flex items-center justify-center">
                  <div className="h-6 w-6 border-2 border-foreground/20 border-t-foreground rounded-full animate-spin" />
                </div>
              )}
              {dragOver && (
                <div className="absolute inset-0 bg-primary/10 flex items-center justify-center">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
              )}

              {/* Бейдж привязанного цвета */}
              {currentSwatch && (
                <div className="absolute top-3 left-3 flex items-center gap-1.5 rounded-full bg-background/95 backdrop-blur border border-border pl-1 pr-3 py-1 shadow-sm">
                  <span className="h-4 w-4 rounded-full border border-black/10" style={{ backgroundColor: currentSwatch.hex }} />
                  <span className="text-[11px] font-medium text-foreground">{currentSwatch.name}</span>
                </div>
              )}
            </div>

            {/* Thumbnails + загрузка */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground">
                  Фото товара <span className="normal-case tracking-normal">({allImages.length})</span>
                </h4>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center gap-1.5 text-[11px] font-medium text-foreground hover:underline"
                >
                  <Upload className="h-3 w-3" /> Загрузить
                </button>
                <input ref={fileInputRef} type="file" accept="image/*" multiple className="hidden" onChange={(e) => handleFiles(e.target.files)} />
              </div>
              <div className="grid grid-cols-5 sm:grid-cols-6 gap-2">
                {allImages.map((img, i) => {
                  const vk = (img as any).variant_key as string | undefined;
                  const swatch = vk ? COATING_PALETTE.find((c) => c.name.toLowerCase() === vk.toLowerCase()) : null;
                  return (
                    <div key={img.id} className="relative group">
                      <button
                        onClick={() => setActiveImage(i)}
                        className={`block w-full aspect-square rounded-xl overflow-hidden transition-all active:scale-95 bg-muted ${activeImage === i ? "ring-2 ring-foreground" : "ring-1 ring-border hover:ring-foreground/40"}`}
                      >
                        <img src={img.url} alt="" className="w-full h-full object-cover" />
                      </button>
                      {vk && (
                        <span
                          title={`Привязано к: ${vk}`}
                          className="absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-2 border-card shadow"
                          style={{ backgroundColor: swatch?.hex ?? "#999" }}
                        />
                      )}
                      {img.id !== "legacy" && (
                        <button
                          onClick={() => deleteImage(img.id)}
                          className="absolute -top-1.5 -right-1.5 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Удалить фото"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      )}
                    </div>
                  );
                })}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors active:scale-95"
                  title="Добавить фото"
                >
                  <Plus className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Привязка фото к цвету — крупная панель */}
            <div className="rounded-2xl border border-border bg-muted/30 p-4">
              <div className="flex items-start gap-2 mb-3">
                <Link2 className="h-4 w-4 text-foreground mt-0.5 shrink-0" />
                <div className="min-w-0">
                  <h4 className="text-xs font-semibold text-foreground">Привязка фото к цвету покрытия</h4>
                  <p className="text-[11px] text-muted-foreground mt-0.5">
                    Выберите цвет — текущее фото будет показываться на витрине, когда покупатель выберет этот оттенок. Привязано: <span className="font-semibold text-foreground">{boundCount}</span> из {allImages.length}.
                  </p>
                </div>
              </div>

              {!currentImage || currentImage.id === "legacy" ? (
                <p className="text-[11px] text-muted-foreground italic">
                  {currentImage ? "Это устаревшее фото. Загрузите новое, чтобы привязать к цвету." : "Сначала загрузите хотя бы одно фото."}
                </p>
              ) : (
                <>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[11px] uppercase tracking-wider text-muted-foreground">
                      Текущее фото #{activeImage + 1}
                    </span>
                    {currentVariantKey && (
                      <button
                        onClick={() => setVariantKey(currentImage.id, null)}
                        className="text-[11px] text-muted-foreground hover:text-destructive transition-colors"
                      >
                        Снять привязку
                      </button>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {COATING_PALETTE.map((c) => {
                      const active = (currentVariantKey ?? "").toLowerCase() === c.name.toLowerCase();
                      return (
                        <button
                          key={c.name}
                          onClick={() => setVariantKey(currentImage.id, active ? null : c.name)}
                          className={`flex items-center gap-1.5 rounded-full border pl-1 pr-2.5 py-1 text-[11px] font-medium transition-all active:scale-95 ${
                            active
                              ? "border-foreground bg-foreground text-primary-foreground"
                              : "border-border bg-background text-foreground hover:border-foreground/40"
                          }`}
                        >
                          <span className="h-4 w-4 rounded-full border border-black/10 shrink-0" style={{ backgroundColor: c.hex }} />
                          {c.name}
                        </button>
                      );
                    })}
                  </div>
                  {currentVariantKey && !currentSwatch && (
                    <div className="mt-2 text-[11px] text-muted-foreground">
                      Своё значение: <span className="font-medium text-foreground">{currentVariantKey}</span>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>

          {/* ===== RIGHT: editable fields ===== */}
          <div className="space-y-5">
            {/* Базовое */}
            <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Основное</h4>
              <div className="space-y-3">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Название</label>
                  <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`${inputCls} text-base font-semibold`} />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">РРЦ (₽)</label>
                    <input value={editRrp} onChange={(e) => setEditRrp(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0 — цена по запросу" className={`${inputCls} tabular-nums`} />
                  </div>
                  <div className="sm:hidden">
                    <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Статус</label>
                    <label className="flex items-center gap-2 h-9 px-3 rounded-xl border border-border cursor-pointer">
                      <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="h-4 w-4 rounded accent-foreground" />
                      <span className="text-xs">{editActive ? "Активен" : "Скрыт"}</span>
                    </label>
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Описание</label>
                  <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={4} className={`${inputCls} h-auto py-2 resize-none`} placeholder="Краткое описание товара для витрины" />
                </div>
              </div>
            </section>

            {/* Характеристики */}
            <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
              <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">Характеристики</h4>
              <div className="space-y-2">
                {editSpecs.length === 0 && (
                  <p className="text-xs text-muted-foreground italic">Характеристик пока нет — добавьте ниже.</p>
                )}
                {editSpecs.map(([key, val], idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground w-32 shrink-0 truncate">{SPEC_LABELS[key] || key}</span>
                    <input value={val} onChange={(e) => updateSpecVal(idx, e.target.value)} className={`${inputCls} flex-1`} />
                    <button onClick={() => removeSpec(idx)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted active:scale-95 transition-colors shrink-0">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                ))}
                <div className="flex items-center gap-2 pt-2 border-t border-border mt-3">
                  <input value={newSpecKey} onChange={(e) => setNewSpecKey(e.target.value)} placeholder="Ключ (color, material…)" className={`${inputCls} w-40 shrink-0`} />
                  <input value={newSpecVal} onChange={(e) => setNewSpecVal(e.target.value)} placeholder="Значение" className={`${inputCls} flex-1`} onKeyDown={(e) => e.key === "Enter" && addSpec()} />
                  <button onClick={addSpec} disabled={!newSpecKey.trim() || !newSpecVal.trim()} className="flex h-9 items-center gap-1.5 px-3 rounded-lg bg-foreground text-primary-foreground text-xs font-medium hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-30 shrink-0">
                    <Plus className="h-3.5 w-3.5" /> Добавить
                  </button>
                </div>
              </div>
            </section>

            {/* Размеры (read-only — задаются массовым импортом) */}
            {sizes.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3">
                  Размеры (мм) <span className="normal-case tracking-normal">· {sizes.length}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                  {sizes.map((s: any, i: number) => (
                    <div key={i} className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground tabular-nums">
                      {s.h_from || s.h_to ? <span>В: {s.h_from ?? "—"}–{s.h_to ?? "—"}</span> : null}
                      {s.w_from || s.w_to ? <span className="ml-2">Ш: {s.w_from ?? "—"}–{s.w_to ?? "—"}</span> : null}
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* Варианты-цвета из JSONB (если есть) */}
            {variants.length > 0 && (
              <section className="rounded-2xl border border-border bg-card p-4 sm:p-5">
                <h4 className="text-[10px] uppercase tracking-wider font-semibold text-muted-foreground mb-3 flex items-center gap-2">
                  <ImageLucide className="h-3.5 w-3.5" />
                  Цвета из спецификации <span className="normal-case tracking-normal">· {variants.length}</span>
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {variants.map((v: any, i: number) => (
                    <div key={i} className="flex items-center gap-2 rounded-xl border border-border bg-muted/40 p-2">
                      {v.image_url ? (
                        <img src={v.image_url} alt={v.color} loading="lazy" className="h-12 w-12 rounded-lg object-cover shrink-0 bg-background" />
                      ) : (
                        <div className="h-12 w-12 rounded-lg bg-background shrink-0 flex items-center justify-center text-muted-foreground">
                          <ImageIcon className="h-4 w-4" />
                        </div>
                      )}
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-medium text-foreground truncate">{v.color || "—"}</div>
                        <div className="text-[11px] text-muted-foreground tabular-nums">
                          {v.price && v.price > 0 ? `${Number(v.price).toLocaleString("ru-RU")} ₽` : "по запросу"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
