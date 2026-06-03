import { useState, useRef, useCallback } from "react";
import { X, Pencil, Save, Plus, Trash2, Upload, ImageIcon, GripVertical } from "lucide-react";
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

const COMPLEX_KEYS = new Set(["sizes", "variants"]);

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

  const [editing, setEditing] = useState(false);
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
    updateProduct.mutate(
      { id: product.id, name: editName.trim(), rrp: editRrp ? Number(editRrp) : null, description: editDesc.trim() || null, specifications: specsObj, is_active: editActive } as any,
      { onSuccess: () => { toast({ title: "Товар обновлён" }); setEditing(false); onClose(); } }
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
      if (file.type.startsWith("image/")) {
        uploadImage(file);
      }
    });
  }, [uploadImage]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault(); setDragOver(false);
    handleFiles(e.dataTransfer.files);
  }, [handleFiles]);

  const allImages = images.length > 0 ? images : (product.primary_image ? [{ id: "legacy", url: product.primary_image, is_primary: true }] : []);
  const currentImage = allImages[activeImage] ?? allImages[0];

  const inputCls = "h-9 w-full rounded-xl border border-border bg-background px-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/20 transition-shadow";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-foreground/20" onClick={onClose} />
      <div className="relative w-full max-w-3xl max-h-[90vh] rounded-2xl border border-border bg-card shadow-xl overflow-y-auto animate-fade-up">
        <div className="sticky top-0 z-10 flex items-center justify-between px-4 sm:px-6 py-4 border-b border-border bg-card">
          <h3 className="text-sm font-semibold text-foreground truncate mr-2">{product.name}</h3>
          <div className="flex items-center gap-1.5 shrink-0">
            {!editing ? (
              <button onClick={() => setEditing(true)} className="flex h-8 items-center gap-1.5 rounded-lg border border-border px-3 text-xs font-medium text-foreground hover:bg-muted active:scale-95 transition-colors">
                <Pencil className="h-3.5 w-3.5" /> Редактировать
              </button>
            ) : (
              <button onClick={handleSave} disabled={updateProduct.isPending} className="flex h-8 items-center gap-1.5 rounded-lg bg-foreground px-3 text-xs font-medium text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-40">
                <Save className="h-3.5 w-3.5" /> Сохранить
              </button>
            )}
            <button onClick={onClose} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted active:scale-95 transition-colors">
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="p-4 sm:p-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            {/* Gallery + Upload */}
            <div>
              <div
                className={`relative aspect-square rounded-2xl bg-muted flex items-center justify-center overflow-hidden transition-colors ${dragOver ? "ring-2 ring-primary bg-primary/5" : ""}`}
                onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
                onDragLeave={() => setDragOver(false)}
                onDrop={handleDrop}
              >
                {currentImage ? (
                  <img src={currentImage.url} alt={product.name} className="w-full h-full object-cover" />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-muted-foreground">
                    <ImageIcon className="h-10 w-10" />
                    <span className="text-xs">Перетащите фото сюда</span>
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
              </div>

              {/* Thumbnails + upload button */}
              <div className="flex gap-2 mt-3 overflow-x-auto">
                {allImages.map((img, i) => (
                  <div key={img.id} className="relative group shrink-0">
                    <button
                      onClick={() => setActiveImage(i)}
                      className={`h-14 w-14 rounded-xl overflow-hidden transition-all active:scale-95 ${activeImage === i ? "ring-2 ring-foreground" : "hover:ring-1 hover:ring-border"}`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                    {img.id !== "legacy" && (
                      <button
                        onClick={() => deleteImage(img.id)}
                        className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    )}
                  </div>
                ))}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="h-14 w-14 rounded-xl border-2 border-dashed border-border flex items-center justify-center text-muted-foreground hover:border-foreground hover:text-foreground transition-colors active:scale-95 shrink-0"
                >
                  <Plus className="h-5 w-5" />
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={(e) => handleFiles(e.target.files)}
                />
              </div>
            </div>

            {/* Info / Edit */}
            <div>
              <div className="flex items-center gap-2 mb-3 flex-wrap">
                <span className="inline-block rounded-full bg-muted px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                  {product.category?.name ?? "Без категории"}
                </span>
                {editing ? (
                  <label className="flex items-center gap-1.5 cursor-pointer">
                    <input type="checkbox" checked={editActive} onChange={(e) => setEditActive(e.target.checked)} className="h-4 w-4 rounded accent-foreground" />
                    <span className="text-xs text-muted-foreground">Активен</span>
                  </label>
                ) : (
                  <>
                    <span className={`h-2.5 w-2.5 rounded-full ${product.is_active ? "bg-success" : "bg-muted-foreground/30"}`} />
                    <span className="text-xs text-muted-foreground">{product.is_active ? "Активен" : "Неактивен"}</span>
                  </>
                )}
              </div>

              {editing ? (
                <input value={editName} onChange={(e) => setEditName(e.target.value)} className={`${inputCls} mb-2 text-lg font-semibold`} />
              ) : (
                <h2 className="text-xl font-semibold text-foreground mb-1">{product.name}</h2>
              )}

              {editing ? (
                <div className="mb-3">
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">РРЦ (₽)</label>
                  <input value={editRrp} onChange={(e) => setEditRrp(e.target.value.replace(/[^\d.]/g, ""))} placeholder="0" className={`${inputCls} tabular-nums`} />
                </div>
              ) : (
                <p className="text-2xl font-semibold tabular-nums text-foreground mb-2">
                  {product.rrp && product.rrp > 0 ? `${product.rrp.toLocaleString("ru-RU")} ₽` : "Цена по запросу"}
                </p>
              )}

              {editing ? (
                <div className="mb-4">
                  <label className="block text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-1">Описание</label>
                  <textarea value={editDesc} onChange={(e) => setEditDesc(e.target.value)} rows={3} className={`${inputCls} h-auto py-2 resize-none`} />
                </div>
              ) : product.description ? (
                <p className="text-sm text-muted-foreground mb-4 line-clamp-4">{product.description}</p>
              ) : null}

              <h4 className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-2">Характеристики</h4>
              {editing ? (
                <div className="space-y-2 mb-4">
                  {editSpecs.map(([key, val], idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground w-24 shrink-0 capitalize">{SPEC_LABELS[key] || key}</span>
                      <input value={val} onChange={(e) => updateSpecVal(idx, e.target.value)} className={`${inputCls} flex-1`} />
                      <button onClick={() => removeSpec(idx)} className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive hover:bg-muted active:scale-95 transition-colors shrink-0">
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  ))}
                  <div className="flex items-center gap-2 pt-1">
                    <input value={newSpecKey} onChange={(e) => setNewSpecKey(e.target.value)} placeholder="Ключ" className={`${inputCls} w-24 shrink-0`} />
                    <input value={newSpecVal} onChange={(e) => setNewSpecVal(e.target.value)} placeholder="Значение" className={`${inputCls} flex-1`} />
                    <button onClick={addSpec} disabled={!newSpecKey.trim() || !newSpecVal.trim()} className="flex h-8 w-8 items-center justify-center rounded-lg bg-foreground text-primary-foreground hover:bg-foreground/90 active:scale-95 transition-colors disabled:opacity-30 shrink-0">
                      <Plus className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-1 mb-4">
                  {flatSpecs.length > 0 ? flatSpecs.map(([key, value]) => (
                    <div key={key} className="flex items-center justify-between py-1.5 text-sm border-b border-border last:border-0">
                      <span className="text-muted-foreground capitalize">{SPEC_LABELS[key] || key}</span>
                      <span className="font-medium text-foreground">{String(value)}</span>
                    </div>
                  )) : (
                    <p className="text-xs text-muted-foreground">Нет характеристик</p>
                  )}
                </div>
              )}

              {sizes.length > 0 && (
                <>
                  <h4 className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-2">Размеры (мм)</h4>
                  <div className="grid grid-cols-2 gap-1.5">
                    {sizes.map((s: any, i: number) => (
                      <div key={i} className="rounded-lg bg-muted px-3 py-2 text-xs text-foreground">
                        {s.h_from || s.h_to ? <span>В: {s.h_from ?? "—"}–{s.h_to ?? "—"}</span> : null}
                        {s.w_from || s.w_to ? <span className="ml-2">Ш: {s.w_from ?? "—"}–{s.w_to ?? "—"}</span> : null}
                      </div>
                    ))}
                  </div>
                </>
              )}

              {variants.length > 0 && (
                <div className="mt-4">
                  <h4 className="text-[10px] uppercase tracking-wider font-medium text-muted-foreground mb-2">
                    Цвета <span className="text-muted-foreground/60 normal-case tracking-normal">({variants.length})</span>
                  </h4>
                  <div className="grid grid-cols-2 gap-2">
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
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
