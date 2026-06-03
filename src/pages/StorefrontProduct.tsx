import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts } from "@/hooks/useStorefrontData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ChevronLeft, ChevronRight, Ruler, ShoppingCart, Check, Plus, DoorOpen, Lock, CircleDot } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import coatingWood from "@/assets/materials/coating-wood.jpg";
import coatingSoftTouch from "@/assets/materials/coating-softtouch.jpg";
import coatingMetal from "@/assets/materials/coating-metal.jpg";
import coatingEnamel from "@/assets/materials/coating-enamel.jpg";
import glassFrosted from "@/assets/materials/glass-frosted.jpg";
import glassMirror from "@/assets/materials/glass-mirror.jpg";
import glassLacobel from "@/assets/materials/glass-lacobel.jpg";
import trimCasingTele from "@/assets/accessories/trim-casing-telescopic.png";
import trimExtenderTele from "@/assets/accessories/trim-extender-telescopic.png";
import trimCasingStraight from "@/assets/accessories/trim-casing-straight.png";
import trimExtenderStraight from "@/assets/accessories/trim-extender-straight.png";
import handleMorelli from "@/assets/accessories/handle-morelli.png";
import handleRenz from "@/assets/accessories/handle-renz.png";
import lockMagnetic from "@/assets/accessories/lock-magnetic.png";
import lockBathroom from "@/assets/accessories/lock-bathroom.png";
import hingesConcealed from "@/assets/accessories/hinges-concealed.png";

// ── Material textures map ──
type MaterialKey = "wood" | "softtouch" | "metal" | "enamel" | "frosted" | "mirror" | "lacobel" | "none";
const TEXTURE_MAP: Record<Exclude<MaterialKey, "none">, string> = {
  wood: coatingWood,
  softtouch: coatingSoftTouch,
  metal: coatingMetal,
  enamel: coatingEnamel,
  frosted: glassFrosted,
  mirror: glassMirror,
  lacobel: glassLacobel,
};

// Heuristic: pick material texture by color name + hex tone
function pickCoatingMaterial(name: string, hex: string): MaterialKey {
  const n = name.toLowerCase();
  if (/(дуб|орех|венге|wood|oak|walnut|шпон)/.test(n)) return "wood";
  if (/(хром|gold|metal|анодир|al |серебр|медь|латунь)/.test(n)) return "metal";
  if (/(эмаль|глянец|gloss|enamel|лак)/.test(n)) return "enamel";
  // Default: soft-touch matte for neutral/grey/anthracite/blue/green tones
  return "softtouch";
}

function pickGlazingMaterial(name: string, preview: string): MaterialKey {
  const n = name.toLowerCase();
  if (preview === "none") return "none";
  if (/зеркал|mirror/.test(n)) return "mirror";
  if (/мат|frost|сатин/.test(n)) return "frosted";
  return "lacobel";
}

// Premium photo swatch: texture image + color tint via mix-blend, gold halo when active
function MaterialSwatch({
  name,
  hex,
  material,
  selected,
  onClick,
}: {
  name: string;
  hex?: string;
  material: MaterialKey;
  selected: boolean;
  onClick: () => void;
}) {
  const isNone = material === "none";
  // Mirror/frosted/lacobel glass renders the texture as-is (no tint) — they already look like the material.
  const isGlassRaw = material === "mirror" || material === "frosted";
  return (
    <button
      onClick={onClick}
      title={name}
      aria-pressed={selected}
      className={`group relative w-16 h-16 rounded-full transition-all duration-300 ease-out will-change-transform ${
        selected
          ? "scale-[1.08] shadow-[0_0_0_2px_rgba(207,187,150,0.9),0_8px_24px_-4px_rgba(207,187,150,0.45)]"
          : "shadow-[0_6px_18px_-6px_rgba(0,0,0,0.7)] hover:scale-[1.06] hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.8)]"
      }`}
      style={{ transform: selected ? "translateZ(0) scale(1.08)" : undefined }}
    >
      <span className="absolute inset-0 rounded-full overflow-hidden">
        {isNone ? (
          <span className="block w-full h-full bg-[#0c0e14]">
            <span className="absolute top-1/2 left-1/2 w-8 h-px bg-storefront-gold/60 -translate-x-1/2 -translate-y-1/2 rotate-45" />
          </span>
        ) : (
          <>
            <img
              src={TEXTURE_MAP[material]}
              alt=""
              loading="lazy"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
            {!isGlassRaw && hex && (
              <span
                className="absolute inset-0"
                style={{ backgroundColor: hex, mixBlendMode: "multiply", opacity: 0.78 }}
              />
            )}
            {/* Subtle top highlight for tactile dimension */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/15 via-transparent to-black/20 pointer-events-none" />
          </>
        )}
      </span>
      {selected && (
        <span className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="w-5 h-5 rounded-full bg-storefront-gold/95 flex items-center justify-center shadow-md">
            <Check className="w-3 h-3 text-[#07090d]" strokeWidth={3} />
          </span>
        </span>
      )}
    </button>
  );
}

// ── Mock data for swatches (will be replaced with DB data later) ──
const MOCK_COLORS: { name: string; hex: string }[] = [
  { name: "Аляска", hex: "#F5F0E8" },
  { name: "Магнолия", hex: "#F0E6D4" },
  { name: "Манхэттен", hex: "#B8AFA4" },
  { name: "Blue", hex: "#1B3A5C" },
  { name: "Green", hex: "#2A4A3E" },
  { name: "Антрацит", hex: "#3A3A3A" },
  { name: "Силк грей", hex: "#9E9A94" },
  { name: "Варм грей", hex: "#A89B8C" },
];

const MOCK_GLAZING: { name: string; preview: string }[] = [
  { name: "Без остекления", preview: "none" },
  { name: "Черный лакобель", preview: "#1A1A1A" },
  { name: "Белый лакобель", preview: "#F5F5F5" },
  { name: "Матовое", preview: "#D4D4D4" },
  { name: "Зеркало", preview: "linear-gradient(135deg, #C0C0C0, #E8E8E8, #A0A0A0)" },
];

const MOCK_EDGE_COLORS: { name: string; hex: string }[] = [
  { name: "Анодированная AL", hex: "#C0C0C0" },
  { name: "Al White", hex: "#F0F0F0" },
  { name: "Black Edition", hex: "#1A1A1A" },
  { name: "Gold Edition", hex: "#C9A96E" },
];

const MOCK_MOLDING_COLORS: { name: string; hex: string }[] = [
  { name: "В цвет полотна", hex: "#E8E0D4" },
  { name: "Хром", hex: "#C0C0C0" },
  { name: "Золото", hex: "#C9A96E" },
  { name: "Черный", hex: "#1A1A1A" },
];

type TrimItem = { id: string; name: string; rrp: number; image: string };
type HardwareItem = { id: string; name: string; rrp: number; image: string };

const MOCK_TRIM: TrimItem[] = [
  { id: "trim-1", name: "Наличник телескопический", rrp: 850, image: trimCasingTele },
  { id: "trim-2", name: "Добор телескопический", rrp: 1200, image: trimExtenderTele },
  { id: "trim-3", name: "Наличник прямой", rrp: 600, image: trimCasingStraight },
  { id: "trim-4", name: "Добор прямой", rrp: 950, image: trimExtenderStraight },
];

const MOCK_HARDWARE: HardwareItem[] = [
  { id: "hw-1", name: "Ручка MORELLI", rrp: 2400, image: handleMorelli },
  { id: "hw-2", name: "Замок магнитный", rrp: 1800, image: lockMagnetic },
  { id: "hw-3", name: "Петли скрытые (2 шт)", rrp: 3200, image: hingesConcealed },
  { id: "hw-4", name: "Ручка RENZ", rrp: 1600, image: handleRenz },
  { id: "hw-5", name: "Замок сантехнический", rrp: 1200, image: lockBathroom },
];

// Premium photo card for trim / hardware accessory selection.
// Image fills upper area on a dark backdrop, name + price + add/check sit below.
function AccessoryCard({
  name,
  rrp,
  image,
  active,
  onClick,
}: {
  name: string;
  rrp: number;
  image: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex flex-col rounded-2xl overflow-hidden text-left transition-all duration-300 ease-out ${
        active
          ? "ring-2 ring-storefront-gold shadow-[0_10px_30px_-8px_rgba(207,187,150,0.35)]"
          : "ring-1 ring-white/8 hover:ring-white/20 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.7)]"
      }`}
    >
      {/* Photo */}
      <div className="relative aspect-[5/4] bg-[#0c0e14] overflow-hidden">
        <img
          src={image}
          alt={name}
          loading="lazy"
          draggable={false}
          className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
        />
        {/* Add / Check badge */}
        <span
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            active
              ? "bg-storefront-gold text-[#07090d]"
              : "bg-[#07090d]/70 backdrop-blur-sm text-storefront-text/80 group-hover:bg-storefront-gold group-hover:text-[#07090d]"
          }`}
        >
          {active ? <Check className="w-3.5 h-3.5" strokeWidth={3} /> : <Plus className="w-3.5 h-3.5" />}
        </span>
      </div>
      {/* Footer */}
      <div className={`px-3 py-2.5 transition-colors ${active ? "bg-storefront-gold/[0.08]" : "bg-white/[0.02]"}`}>
        <div className={`text-[12px] font-medium leading-tight line-clamp-2 ${active ? "text-storefront-text" : "text-storefront-text/85"}`}>
          {name}
        </div>
        <div className="text-[11px] text-storefront-gold/80 mt-1 tracking-wide">
          +{rrp.toLocaleString("ru-RU")} ₽
        </div>
      </div>
    </button>
  );
}

export default function StorefrontProduct() {
  const { slug: urlSlug, productSlug } = useParams<{ slug: string; productSlug: string }>();
  const slug = useSiteSlug(urlSlug);
  const { data: site, isLoading: siteLoading } = useSiteBySlug(slug);
  const { data: products = [], isLoading: productsLoading } = useStorefrontProducts(site?.id);

  const product = (products as any[]).find((p) => p.slug === productSlug);

  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedGlazing, setSelectedGlazing] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [selectedMolding, setSelectedMolding] = useState<string | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<Set<string>>(new Set());
  const [selectedHardware, setSelectedHardware] = useState<Set<string>>(new Set());

  const primaryImg = product?.product_images?.find((i: any) => i.is_primary)?.url || product?.product_images?.[0]?.url;
  useDocumentMeta({
    title: product ? `${product.name} — Brandoors ${site?.city ?? ""}` : "Товар — Brandoors",
    description: product?.description || `Дверь ${product?.name ?? ""} от Brandoors. Характеристики, фото, цены.`,
    ogImage: primaryImg,
    ogUrl: site ? `https://${site.slug}.brandoors.su/product/${productSlug}` : undefined,
  });

  const images = product?.product_images
    ?.sort((a: any, b: any) => (a.sort_order || 0) - (b.sort_order || 0)) || [];

  const specs = product?.specifications as Record<string, any> | null;

  // Colors derived from images that have a variant_key — these are real, image-bound colors.
  // Fall back to MOCK_COLORS when no images are tagged, so legacy products still render swatches.
  const imageColors = useMemo(() => {
    const seen = new Set<string>();
    const out: { name: string; hex: string }[] = [];
    for (const img of images as any[]) {
      const key = img.variant_key?.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const mock = MOCK_COLORS.find((c) => c.name.toLowerCase() === key.toLowerCase());
      out.push({ name: key, hex: mock?.hex ?? "#2a2a2a" });
    }
    return out;
  }, [images]);

  const colorSwatches = imageColors.length > 0 ? imageColors : MOCK_COLORS;
  const hasImageBoundColors = imageColors.length > 0;

  // Set initial selected color/glazing from specs
  useMemo(() => {
    if (specs?.color && !selectedColor) setSelectedColor(specs.color);
    if (specs?.glazing && !selectedGlazing) setSelectedGlazing(specs.glazing);
  }, [specs]);

  // When user picks a color that is bound to an image, switch the gallery to it.
  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    if (!hasImageBoundColors) return;
    const idx = (images as any[]).findIndex(
      (img) => img.variant_key && img.variant_key.toLowerCase() === colorName.toLowerCase()
    );
    if (idx >= 0) setCurrentImage(idx);
  };

  const similar = useMemo(() => {
    if (!product) return [];
    return (products as any[])
      .filter((p) => p.category_id === product.category_id && p.id !== product.id)
      .slice(0, 8);
  }, [products, product]);

  const getPrimaryImage = (p: any) => {
    const primary = p.product_images?.find((i: any) => i.is_primary);
    return primary?.url || p.product_images?.[0]?.url;
  };

  const addItem = useCartStore((s) => s.addItem);
  const cartItems = useCartStore((s) => s.items);
  const isInCart = cartItems.some((i) => i.id === product?.id);

  const handleAddToCart = () => {
    if (!product || !site) return;
    const primary = product.product_images?.find((i: any) => i.is_primary);
    const imgUrl = primary?.url || product.product_images?.[0]?.url || null;
    addItem({
      id: product.id,
      name: product.name,
      slug: product.slug,
      rrp: product.rrp ? Number(product.rrp) : null,
      imageUrl: imgUrl,
      siteId: site.id,
      type: "door",
    });
  };

  const toggleTrim = (id: string) => {
    setSelectedTrim((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleHardware = (id: string) => {
    setSelectedHardware((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const handleAddAllToCart = () => {
    if (!product || !site) return;
    handleAddToCart();
    // Add selected trim items
    selectedTrim.forEach((id) => {
      const item = MOCK_TRIM.find((t) => t.id === id);
      if (item) {
        addItem({
          id: `${product.id}-${item.id}`,
          name: item.name,
          slug: item.id,
          rrp: item.rrp,
          imageUrl: null,
          siteId: site.id,
          type: "trim",
          parentProductId: product.id,
        });
      }
    });
    // Add selected hardware items
    selectedHardware.forEach((id) => {
      const item = MOCK_HARDWARE.find((h) => h.id === id);
      if (item) {
        addItem({
          id: `${product.id}-${item.id}`,
          name: item.name,
          slug: item.id,
          rrp: item.rrp,
          imageUrl: null,
          siteId: site.id,
          type: "hardware",
          parentProductId: product.id,
        });
      }
    });
  };

  const nextImage = () => setCurrentImage((prev) => (prev + 1) % images.length);
  const prevImage = () => setCurrentImage((prev) => (prev - 1 + images.length) % images.length);

  if (siteLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center">
        <div className="h-8 w-8 border-2 border-storefront-gold/20 border-t-storefront-gold rounded-full animate-spin" />
      </div>
    );
  }

  if (!site || !product) {
    return (
      <div className="min-h-screen bg-[#07090d] flex items-center justify-center text-storefront-text">
        <div className="text-center">
          <h1 className="text-2xl mb-4">Товар не найден</h1>
          <Link to={`/store/${slug}/catalog`} className="text-storefront-gold hover:opacity-80 transition-opacity">
            Вернуться в каталог
          </Link>
        </div>
      </div>
    );
  }

  const sizes = specs?.sizes as Array<{ h_from?: number; h_to?: number; w_from?: number; w_to?: number }> | undefined;
  const heightSizes = sizes?.filter(s => s.h_from !== undefined);
  const widthSizes = sizes?.filter(s => s.w_from !== undefined);

  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-14 md:pt-0 bg-[#07090d]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-14">

          {/* Breadcrumbs */}
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center gap-4 mb-10 text-[10px] uppercase tracking-[0.2em] font-light"
          >
            <Link to={`/store/${slug}`} className="text-storefront-text/30 hover:text-storefront-gold transition-colors">
              Каталог
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link to={`/store/${slug}/catalog`} className="text-storefront-text/30 hover:text-storefront-gold transition-colors">
              Двери
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-storefront-text/60">{product.name}</span>
          </motion.div>

          {/* ===== MAIN: HERO IMAGE + CONFIG ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

            {/* Hero image — 7/12 columns, dramatic shadow, floating collection badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-7 lg:sticky lg:top-12 lg:self-start"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0d0f14] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] group">
                <AnimatePresence mode="wait">
                  {images.length > 0 ? (
                    <motion.img
                      key={currentImage}
                      initial={{ opacity: 0, scale: 1.03 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.4 }}
                      src={images[currentImage]?.url}
                      alt={images[currentImage]?.alt || product.name}
                      className="w-full h-full object-contain p-8 transform transition-transform duration-[1000ms] group-hover:scale-[1.03]"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <span className="text-storefront-muted/15 text-9xl font-bold">B</span>
                    </div>
                  )}
                </AnimatePresence>

                {/* Soft bottom gradient for badge legibility */}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07090d] via-transparent to-transparent opacity-40" />

                {/* Floating collection badge */}
                {product.categories && (
                  <div className="absolute top-8 left-8">
                    <span className="px-4 py-1.5 rounded-full border border-storefront-gold/30 bg-[#07090d]/60 backdrop-blur-md text-storefront-gold text-[10px] tracking-[0.2em] uppercase">
                      {(product.categories as any)?.name}
                    </span>
                  </div>
                )}

                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#07090d]/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-storefront-gold hover:text-[#07090d] text-storefront-text">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextImage} className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#07090d]/70 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-storefront-gold hover:text-[#07090d] text-storefront-text">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-5 right-5 bg-[#07090d]/60 backdrop-blur-sm px-3 py-1 rounded-full text-[10px] text-storefront-text/70 tracking-wider">
                      {currentImage + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`relative shrink-0 w-[72px] aspect-square overflow-hidden bg-[#0c0e14] rounded-xl transition-all duration-300 ${
                        idx === currentImage
                          ? "ring-2 ring-storefront-gold ring-offset-2 ring-offset-[#07090d]"
                          : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img src={img.url} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Product Info — 5/12 columns */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="lg:col-span-5 flex flex-col"
            >
              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-storefront-text leading-[1.05] mb-6">
                {product.name}
              </h1>

              {/* Hero price under title */}
              {product.rrp && Number(product.rrp) > 0 && (
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-[10px] font-light uppercase tracking-[0.25em] text-storefront-text/40">Стоимость от</span>
                  <span className="text-5xl font-light text-storefront-gold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                    {Number(product.rrp).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              )}

              {product.description && (
                <p className="text-sm font-light leading-relaxed text-storefront-text/50 max-w-md mb-10">
                  {product.description}
                </p>
              )}



              {/* ===== COLOR SWATCHES ===== */}
              <div className="space-y-5 mb-8">
                {/* Coating color */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Цвет покрытия:</span>
                    <span className="text-[12px] text-storefront-gold/80">{selectedColor || "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {colorSwatches.map((c) => (
                      <MaterialSwatch
                        key={c.name}
                        name={c.name}
                        hex={c.hex}
                        material={pickCoatingMaterial(c.name, c.hex)}
                        selected={selectedColor === c.name}
                        onClick={() => handleSelectColor(c.name)}
                      />
                    ))}
                  </div>
                </div>

                {/* Glazing */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Остекление:</span>
                    <span className="text-[12px] text-storefront-gold/80">{selectedGlazing || "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {MOCK_GLAZING.map((g) => {
                      const mat = pickGlazingMaterial(g.name, g.preview);
                      // For lacobel (solid coloured glass), pass hex for tinting
                      const hex = mat === "lacobel" && g.preview.startsWith("#") ? g.preview : undefined;
                      return (
                        <MaterialSwatch
                          key={g.name}
                          name={g.name}
                          hex={hex}
                          material={mat}
                          selected={selectedGlazing === g.name}
                          onClick={() => setSelectedGlazing(g.name)}
                        />
                      );
                    })}
                  </div>
                </div>

                {/* Edge color */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Цвет кромки:</span>
                    <span className="text-[12px] text-storefront-gold/80">{selectedEdge || "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {MOCK_EDGE_COLORS.map((c) => (
                      <MaterialSwatch
                        key={c.name}
                        name={c.name}
                        hex={c.hex}
                        material="metal"
                        selected={selectedEdge === c.name}
                        onClick={() => setSelectedEdge(c.name)}
                      />
                    ))}
                  </div>
                </div>

                {/* Molding color */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Цвет молдингов:</span>
                    <span className="text-[12px] text-storefront-gold/80">{selectedMolding || "—"}</span>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {MOCK_MOLDING_COLORS.map((c) => (
                      <MaterialSwatch
                        key={c.name}
                        name={c.name}
                        hex={c.hex}
                        material={pickCoatingMaterial(c.name, c.hex) === "wood" ? "wood" : "metal"}
                        selected={selectedMolding === c.name}
                        onClick={() => setSelectedMolding(c.name)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* ===== TRIM (ПОГОНАЖ) ===== */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-storefront-gold/10 flex items-center justify-center">
                    <DoorOpen className="w-4 h-4 text-storefront-gold" />
                  </div>
                  <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text">
                    Погонаж коллекции
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MOCK_TRIM.map((item) => (
                    <AccessoryCard
                      key={item.id}
                      name={item.name}
                      rrp={item.rrp}
                      image={item.image}
                      active={selectedTrim.has(item.id)}
                      onClick={() => toggleTrim(item.id)}
                    />
                  ))}
                </div>
              </div>

              {/* ===== HARDWARE (ФУРНИТУРА) ===== */}
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 rounded-lg bg-storefront-gold/10 flex items-center justify-center">
                    <Lock className="w-4 h-4 text-storefront-gold" />
                  </div>
                  <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text">
                    Фурнитура
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  {MOCK_HARDWARE.map((item) => (
                    <AccessoryCard
                      key={item.id}
                      name={item.name}
                      rrp={item.rrp}
                      image={item.image}
                      active={selectedHardware.has(item.id)}
                      onClick={() => toggleHardware(item.id)}
                    />
                  ))}
                </div>
              </div>

              {sizes && sizes.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.35 }}
                  className="mb-8"
                >
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-storefront-gold/10 flex items-center justify-center">
                      <Ruler className="w-4 h-4 text-storefront-gold" />
                    </div>
                    <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text">
                      Доступные размеры
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(207,187,150,0.06) 0%, rgba(207,187,150,0.01) 100%)", border: "1px solid rgba(207,187,150,0.1)" }}>
                    {heightSizes && heightSizes.length > 0 && (
                      <div className="px-5 py-4 border-b border-white/5">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-muted block mb-3">Высота, мм</span>
                        <div className="flex flex-wrap gap-2">
                          {heightSizes.map((s, i) => (
                            <span key={`h-${i}`} className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-[14px] font-medium text-storefront-text hover:border-storefront-gold/30 transition-colors">
                              {s.h_from}—{s.h_to}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                    {widthSizes && widthSizes.length > 0 && (
                      <div className="px-5 py-4">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-muted block mb-3">Ширина, мм</span>
                        <div className="flex flex-wrap gap-2">
                          {widthSizes.map((s, i) => (
                            <span key={`w-${i}`} className="px-4 py-2 bg-white/[0.04] border border-white/[0.06] rounded-xl text-[14px] font-medium text-storefront-text hover:border-storefront-gold/30 transition-colors">
                              {s.w_from}—{s.w_to}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* ===== PRICE SUMMARY (extras only) + CTA ===== */}
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.45 }}
                className="mt-auto pt-8 border-t border-white/5"
              >
                {(() => {
                  const doorPrice = product.rrp ? Number(product.rrp) : 0;
                  const trimTotal = MOCK_TRIM.filter((t) => selectedTrim.has(t.id)).reduce((s, t) => s + t.rrp, 0);
                  const hwTotal = MOCK_HARDWARE.filter((h) => selectedHardware.has(h.id)).reduce((s, h) => s + h.rrp, 0);
                  const totalPrice = doorPrice + trimTotal + hwTotal;
                  const hasExtras = selectedTrim.size > 0 || selectedHardware.size > 0;

                  if (!hasExtras || totalPrice <= 0) return null;

                  return (
                    <div className="mb-6 flex items-baseline justify-between gap-4">
                      <div className="text-[10px] text-storefront-text/40 font-light leading-relaxed">
                        Дверь {doorPrice.toLocaleString("ru-RU")} ₽
                        {trimTotal > 0 && <> + погонаж {trimTotal.toLocaleString("ru-RU")} ₽</>}
                        {hwTotal > 0 && <> + фурнитура {hwTotal.toLocaleString("ru-RU")} ₽</>}
                      </div>
                      <div className="flex items-baseline gap-2 shrink-0">
                        <span className="text-[10px] uppercase tracking-[0.25em] text-storefront-text/40">Итого</span>
                        <span className="text-3xl font-light text-storefront-gold" style={{ fontFamily: "'Cormorant Garamond', serif" }}>
                          {totalPrice.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <motion.button
                  onClick={handleAddAllToCart}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.98 }}
                  className={`w-full py-5 rounded-full text-xs font-medium uppercase tracking-[0.3em] transition-all relative overflow-hidden group flex items-center justify-center gap-3 ${
                    isInCart
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-storefront-gold text-[#07090d] hover:brightness-110 shadow-[0_20px_50px_-10px_rgba(212,175,55,0.3)]"
                  }`}
                >
                  {!isInCart && (
                    <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                  )}
                  <span className="relative z-10 flex items-center gap-3">
                    {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                    {isInCart ? "В корзине" : (selectedTrim.size > 0 || selectedHardware.size > 0) ? "Добавить комплект" : "Добавить в корзину"}
                  </span>
                </motion.button>
                <p className="mt-5 text-center text-[10px] text-storefront-text/30 uppercase tracking-[0.3em] font-light">
                  Персональный расчёт и замер — бесплатно
                </p>
              </motion.div>
            </motion.div>
          </div>


          {/* ===== SIMILAR PRODUCTS ===== */}
          {similar.length > 0 && (
            <motion.section
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="mt-20"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-[1px] bg-storefront-gold/40" />
                <h2 className="text-xl sm:text-2xl font-bold text-storefront-text uppercase tracking-wide">
                  Похожие модели
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {similar.map((p: any, i: number) => {
                  const img = getPrimaryImage(p);
                  return (
                    <motion.div key={p.id} initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.65 + i * 0.05 }}>
                      <Link
                        to={`/store/${slug}/product/${p.slug}`}
                        className="group block"
                        onClick={() => { setCurrentImage(0); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                      >
                        <div className="relative overflow-hidden bg-[#0c0e14] flex items-center justify-center rounded-2xl" style={{ minHeight: "250px" }}>
                          {img ? (
                            <img src={img} alt={p.name} loading="lazy" className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-500" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <span className="text-storefront-muted/15 text-5xl font-bold">B</span>
                            </div>
                          )}
                        </div>
                        <div className="pt-3">
                          <h3 className="text-xs font-semibold text-storefront-text uppercase tracking-wider leading-snug mb-1 line-clamp-2">{p.name}</h3>
                          {p.rrp && <p className="text-sm font-medium text-storefront-text">{Number(p.rrp).toLocaleString("ru-RU")} ₽</p>}
                        </div>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            </motion.section>
          )}

          {/* Back to catalog */}
          <div className="mt-14">
            <Link to={`/store/${slug}/catalog`} className="inline-flex items-center gap-2 text-[11px] uppercase tracking-wider text-storefront-muted hover:text-storefront-gold transition-colors">
              <ArrowLeft className="w-4 h-4" />
              Вернуться в каталог
            </Link>
          </div>
        </div>
      </div>
    </StorefrontLayout>
  );
}
