import { useState, useMemo, useRef, useEffect, ReactNode } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts, useStorefrontCategories } from "@/hooks/useStorefrontData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArrowLeft, ChevronLeft, ChevronRight, ShoppingCart, Check, Plus } from "lucide-react";
import { useCartStore } from "@/stores/useCartStore";
import coatingWood from "@/assets/materials/coating-wood.jpg";
import coatingSoftTouch from "@/assets/materials/coating-softtouch.jpg";
import coatingMetal from "@/assets/materials/coating-metal.jpg";
import coatingEnamel from "@/assets/materials/coating-enamel.jpg";
import glassFrosted from "@/assets/materials/glass-frosted.jpg";
import glassMirror from "@/assets/materials/glass-mirror.jpg";
import glassLacobel from "@/assets/materials/glass-lacobel.jpg";
import OpeningSystems from "@/components/storefront/OpeningSystems";

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
  disabled,
}: {
  name: string;
  hex?: string;
  material: MaterialKey;
  selected: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  const isNone = material === "none";
  // Mirror/frosted/lacobel glass renders the texture as-is (no tint) — they already look like the material.
  const isGlassRaw = material === "mirror" || material === "frosted";
  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      title={disabled ? `${name} — нет такой комбинации` : name}
      aria-pressed={selected}
      aria-disabled={disabled}
      className={`group relative w-16 h-16 rounded-full transition-all duration-300 ease-out will-change-transform ${
        disabled
          ? "opacity-30 cursor-not-allowed grayscale"
          : selected
          ? "scale-[1.08] shadow-[0_0_0_2px_rgba(207,187,150,0.9),0_8px_24px_-4px_rgba(207,187,150,0.45)]"
          : "shadow-[0_6px_18px_-6px_rgba(0,0,0,0.7)] hover:scale-[1.06] hover:shadow-[0_10px_24px_-6px_rgba(0,0,0,0.8)]"
      }`}
      style={{ transform: selected && !disabled ? "translateZ(0) scale(1.08)" : undefined }}
    >
      <span className="absolute inset-0 rounded-full overflow-hidden">
        {isNone ? (
          <span className="block w-full h-full bg-[#0c0e14]">
            <span className="absolute top-1/2 left-1/2 w-8 h-px bg-storefront-gold/60 -translate-x-1/2 -translate-y-1/2 rotate-45" />
          </span>
        ) : isGlassRaw ? (
          <>
            <img
              src={TEXTURE_MAP[material]}
              alt=""
              loading="lazy"
              draggable={false}
              className="absolute inset-0 w-full h-full object-cover"
            />
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/10 via-transparent to-black/10 pointer-events-none" />
          </>
        ) : (
          <>
            <span
              className="absolute inset-0"
              style={{ backgroundColor: hex || "#9C9994" }}
            />
            {/* Very subtle highlight only — no darkening, so the swatch reads as the true color. */}
            <span className="absolute inset-0 rounded-full bg-gradient-to-br from-white/8 via-transparent to-black/5 pointer-events-none" />
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

// ── Coating colors — realistic hex values for ALL known variant_keys.
// Hex is multiplied over a wood/softtouch/enamel/metal texture in MaterialSwatch,
// so the values below approximate the *real* coating tone.
const MOCK_COLORS: { name: string; hex: string }[] = [
  // Neutrals / soft-touch
  { name: "Аляска", hex: "#F5F0E8" },
  { name: "Магнолия", hex: "#F0E6D4" },
  { name: "Манхэттен", hex: "#B8AFA4" },
  { name: "Силк Грей", hex: "#9E9A94" },
  { name: "Силк грей", hex: "#9E9A94" },
  { name: "Варм Грей", hex: "#A89B8C" },
  { name: "Варм грей", hex: "#A89B8C" },
  { name: "Туман", hex: "#A8A5A0" },
  { name: "Милк", hex: "#F2EDE3" },
  { name: "Белый", hex: "#F6F4EE" },
  { name: "Белый жемчуг", hex: "#EFEAE0" },
  { name: "Серый", hex: "#8C8B88" },
  { name: "Графит", hex: "#3F4145" },
  { name: "Антрацит", hex: "#2E3033" },
  { name: "Черный", hex: "#15161A" },
  { name: "Черный глянец", hex: "#0E0F12" },
  { name: "Без цвета", hex: "#9C9994" },
  // Woods — values tuned for multiply over the wood texture
  { name: "Орех Натуральный", hex: "#A47148" },
  { name: "Орех Бохо", hex: "#6E3E22" },
  { name: "Орех Пацифик", hex: "#7A5840" },
  { name: "Дуб Керамика", hex: "#C8B89A" },
  { name: "Дуб Светло-серый", hex: "#B3ADA2" },
  { name: "Обветренный Тик", hex: "#8D7458" },
  { name: "Итальянский тисненый", hex: "#A88563" },
  { name: "Карамельный Мусс", hex: "#B58456" },
  { name: "Кофе", hex: "#5A3A2A" },
  { name: "Кофе глянец", hex: "#4A2E22" },
  // Colored coatings
  { name: "Blue", hex: "#1B3A5C" },
  { name: "Blue Green", hex: "#264C57" },
  { name: "Deep Green", hex: "#1F3A2E" },
  { name: "Green", hex: "#2A4A3E" },
  // RAL / NCS placeholders
  { name: "Ral & Ncs", hex: "#C9C4BB" },
  { name: "NCS S 0502Y", hex: "#EFEAD8" },
  { name: "NCS S 3010 Y30R", hex: "#BFA68C" },
  { name: "NSC S 4050 Y60R", hex: "#A86B3E" },
];

const MOCK_GLAZING: { name: string; preview: string }[] = [
  { name: "Без остекления", preview: "none" },
  { name: "Черный лакобель", preview: "#1A1A1A" },
  { name: "Белый лакобель", preview: "#F5F5F5" },
  { name: "Матовое", preview: "#D4D4D4" },
  { name: "Зеркало", preview: "linear-gradient(135deg, #C0C0C0, #E8E8E8, #A0A0A0)" },
];

const MOCK_EDGE_COLORS: { name: string; hex: string }[] = [
  // Real values from products.specifications.edge_colors
  { name: "AL Gold", hex: "#C9A96E" },
  { name: "AL Black", hex: "#1A1A1A" },
  { name: "AL White", hex: "#F0F0F0" },
  { name: "AL Хром", hex: "#C8CCD0" },
  { name: "AL Chrome", hex: "#C8CCD0" },
  { name: "Хром", hex: "#C8CCD0" },
  { name: "Цветная", hex: "#B07A4A" },
  { name: "Ral & Ncs", hex: "#8A8A8A" },
  // Legacy fallbacks
  { name: "Анодированная AL", hex: "#C0C0C0" },
  { name: "Black Edition", hex: "#1A1A1A" },
  { name: "Gold Edition", hex: "#C9A96E" },
];

const MOCK_MOLDING_COLORS: { name: string; hex: string }[] = [
  { name: "В цвет полотна", hex: "#E8E0D4" },
  { name: "Хром", hex: "#C0C0C0" },
  { name: "Золото", hex: "#C9A96E" },
  { name: "Черный", hex: "#1A1A1A" },
];

type AccessoryItem = { id: string; name: string; rrp: number | null; image: string | null; slug: string };

// Hardware subcategory tabs derived from product name keywords.
const HARDWARE_TABS: { key: string; label: string; match: (n: string) => boolean }[] = [
  { key: "handles", label: "Ручки", match: (n) => /ручк|скоб|кноп/i.test(n) },
  { key: "locks", label: "Защёлки и замки", match: (n) => /защ[её]лк|замк|замок|корпус/i.test(n) },
  { key: "hinges", label: "Петли", match: (n) => /петл/i.test(n) },
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
  rrp: number | null;
  image: string | null;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={active}
      className={`group relative flex flex-col rounded-2xl overflow-hidden text-left transition-[border-color,transform] duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-storefront-gold/60 border ${
        active
          ? "border-storefront-gold bg-[#0e1118]"
          : "border-white/[0.08] bg-[#0b0d12] hover:border-storefront-gold/45"
      }`}
    >
      {/* Photo plate — warm cream so dark hardware reads clearly */}
      <div
        className="relative aspect-square overflow-hidden"
        style={{
          background:
            "radial-gradient(120% 90% at 50% 30%, #f1ece2 0%, #ddd5c6 75%, #c9c0ad 100%)",
        }}
      >
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain p-6 transition-transform duration-500 ease-out group-hover:scale-[1.04]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-[#0c0e14]/15 text-5xl font-bold">B</div>
        )}

        {/* Active indicator — clean gold dot, no glow */}
        {active && (
          <span className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-[#07090d]/85 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-storefront-gold" />
            <span className="text-[9px] uppercase tracking-[0.2em] font-semibold text-storefront-gold">Выбрано</span>
          </span>
        )}

        {/* Add / Check action */}
        <span
          className={`absolute bottom-3 right-3 w-9 h-9 rounded-full flex items-center justify-center transition-colors duration-200 ${
            active
              ? "bg-storefront-gold text-[#07090d]"
              : "bg-[#07090d]/85 text-[#f1ece2] group-hover:bg-storefront-gold group-hover:text-[#07090d]"
          }`}
        >
          {active ? <Check className="w-4 h-4" strokeWidth={3} /> : <Plus className="w-4 h-4" strokeWidth={2.4} />}
        </span>
      </div>

      {/* Footer */}
      <div className="px-4 pt-3.5 pb-4">
        <div className="text-[13px] font-medium leading-snug text-storefront-text/90 line-clamp-2 min-h-[2.6em]">
          {name}
        </div>
        <div className="mt-2 text-[11px] uppercase tracking-[0.18em] text-storefront-gold/90 font-semibold tabular-nums">
          {rrp && rrp > 0 ? `+ ${rrp.toLocaleString("ru-RU")} ₽` : "По запросу"}
        </div>
      </div>
    </button>
  );
}

// Dimension slider — gold tick marks under a continuous track, snaps to discrete values.
function DimensionSlider({
  label,
  values,
  selected,
  onChange,
  labelValues,
}: {
  label: string;
  values: number[];
  selected: number | null;
  onChange: (v: number) => void;
  labelValues?: number[];
}) {
  const idx = selected != null ? Math.max(0, values.indexOf(selected)) : 0;
  const max = Math.max(values.length - 1, 1);
  const pct = (idx / max) * 100;
  const labelSet = labelValues ? new Set(labelValues) : null;

  // Inner track padding equals the thumb radius so tick at 0% and 100%
  // sit exactly under the thumb, and labels at the edges don't clip.
  const THUMB = 28; // px, custom thumb diameter
  const PAD = THUMB / 2; // left/right inset for the track

  return (
    <div>
      {/* Header: label + big current value */}
      <div className="flex items-baseline justify-between mb-10">
        <span className="text-[12px] uppercase tracking-[0.28em] text-storefront-text/55 font-semibold">
          {label}
        </span>
        <span className="flex items-baseline gap-1.5">
          <span
            className="text-[56px] leading-[0.85] font-bold text-storefront-gold tabular-nums tracking-tight"
            style={{ fontFamily: "'Manrope', system-ui, sans-serif" }}
          >
            {selected ?? values[0]}
          </span>
          <span className="text-[14px] font-semibold text-storefront-text/40 tracking-wide">мм</span>
        </span>
      </div>

      {/* Slider area — all marks positioned by percent so ticks, thumb and labels share one axis */}
      <div className="relative h-32" style={{ paddingLeft: PAD, paddingRight: PAD }}>
        {/* Inner positioning context: ticks/thumb/labels are positioned by % within this box */}
        <div className="relative h-full">
          {/* Track */}
          <div className="absolute left-0 right-0 top-[42px] h-[3px] bg-white/[0.07] rounded-full" />
          {/* Filled portion */}
          <div
            className="absolute left-0 top-[42px] h-[3px] bg-gradient-to-r from-storefront-gold/60 to-storefront-gold rounded-full transition-[width] duration-200"
            style={{ width: `${pct}%` }}
          />

          {/* Tick marks — each positioned at its exact percent */}
          {values.map((v, i) => {
            const tickPct = (i / max) * 100;
            const active = i <= idx;
            const isCurrent = i === idx;
            return (
              <span
                key={`tick-${v}`}
                className={`absolute w-[2px] rounded-full transition-all duration-200 pointer-events-none ${
                  isCurrent
                    ? "bg-storefront-gold"
                    : active
                    ? "bg-storefront-gold/60"
                    : "bg-white/20"
                }`}
                style={{
                  left: `${tickPct}%`,
                  top: 43.5 - (isCurrent ? 12 : 7),
                  height: isCurrent ? 24 : 14,
                  transform: "translateX(-50%)",
                }}
              />
            );
          })}

          {/* Custom thumb — perfectly centered over the active tick */}
          <span
            aria-hidden
            className="absolute rounded-full bg-storefront-gold border-[4px] border-[#07090d] pointer-events-none transition-[left] duration-200"
            style={{
              width: THUMB,
              height: THUMB,
              left: `${pct}%`,
              top: 43.5 - THUMB / 2,
              transform: "translateX(-50%)",
              boxShadow:
                "0 0 0 2px rgba(207,187,150,0.55), 0 10px 24px -4px rgba(207,187,150,0.65)",
            }}
          />

          {/* Tick labels — only on anchor values, positioned at their exact percent */}
          {values.map((v, i) => {
            if (labelSet && !labelSet.has(v)) return null;
            const lblPct = (i / max) * 100;
            // Keep first/last labels fully inside the box
            const isFirst = lblPct <= 0.01;
            const isLast = lblPct >= 99.99;
            return (
              <span
                key={`lbl-${v}`}
                className="absolute top-[74px] text-[14px] tabular-nums whitespace-nowrap text-storefront-text/70 pointer-events-none"
                style={{
                  fontFamily: "'Manrope', system-ui, sans-serif",
                  fontWeight: 700,
                  left: `${lblPct}%`,
                  transform: isFirst
                    ? "translateX(0)"
                    : isLast
                    ? "translateX(-100%)"
                    : "translateX(-50%)",
                }}
              >
                {v}
              </span>
            );
          })}

          {/* Native range overlay — invisible, handles drag/keyboard */}
          <input
            type="range"
            min={0}
            max={max}
            step={1}
            value={idx}
            onChange={(e) => onChange(values[Number(e.target.value)])}
            aria-label={label}
            className="absolute left-0 right-0 top-[30px] w-full h-8 appearance-none bg-transparent cursor-pointer opacity-0
              [&::-webkit-slider-thumb]:appearance-none
              [&::-webkit-slider-thumb]:w-8 [&::-webkit-slider-thumb]:h-8
              [&::-moz-range-thumb]:w-8 [&::-moz-range-thumb]:h-8 [&::-moz-range-thumb]:border-0"
          />
        </div>
      </div>
    </div>
  );
}


// Horizontal scroll wrapper with chevron arrows on desktop.
function ScrollCarousel({ children }: { children: ReactNode }) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canPrev, setCanPrev] = useState(false);
  const [canNext, setCanNext] = useState(false);

  const update = () => {
    const el = scrollerRef.current;
    if (!el) return;
    setCanPrev(el.scrollLeft > 4);
    setCanNext(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  };

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    update();
    el.addEventListener("scroll", update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => {
      el.removeEventListener("scroll", update);
      ro.disconnect();
    };
  }, []);

  const scrollBy = (dir: 1 | -1) => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({ left: dir * Math.round(el.clientWidth * 0.85), behavior: "smooth" });
  };

  return (
    <div className="relative group/scroller">
      <div
        ref={scrollerRef}
        className="-mx-4 sm:-mx-6 px-4 sm:px-6 overflow-x-auto scrollbar-hide snap-x"
      >
        <div className="flex gap-3 pb-2">{children}</div>
      </div>

      {canPrev && (
        <button
          type="button"
          aria-label="Назад"
          onClick={() => scrollBy(-1)}
          className="hidden sm:flex absolute left-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#07090d]/90 border border-storefront-gold/30 text-storefront-gold items-center justify-center backdrop-blur-md shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] opacity-0 group-hover/scroller:opacity-100 transition-opacity duration-200 hover:bg-storefront-gold hover:text-[#07090d]"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
      )}
      {canNext && (
        <button
          type="button"
          aria-label="Вперёд"
          onClick={() => scrollBy(1)}
          className="hidden sm:flex absolute right-2 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-[#07090d]/90 border border-storefront-gold/30 text-storefront-gold items-center justify-center backdrop-blur-md shadow-[0_10px_30px_-8px_rgba(0,0,0,0.8)] opacity-0 group-hover/scroller:opacity-100 transition-opacity duration-200 hover:bg-storefront-gold hover:text-[#07090d]"
        >
          <ChevronRight className="w-5 h-5" />
        </button>
      )}
    </div>
  );
}


export default function StorefrontProduct() {
  const { slug: urlSlug, productSlug } = useParams<{ slug: string; productSlug: string }>();
  const slug = useSiteSlug(urlSlug);
  const { data: site, isLoading: siteLoading } = useSiteBySlug(slug);
  const { data: products = [], isLoading: productsLoading } = useStorefrontProducts(site?.id);
  const { data: allCategories = [] } = useStorefrontCategories();

  const product = (products as any[]).find((p) => p.slug === productSlug);

  // Determine the root category slug for the current product (walk up parent_id chain).
  // Used to gate door-only UI (color/glazing configurator, OpeningSystems) so it does
  // not appear on Погонаж / Фурнитура / other non-door categories.
  const rootCategorySlug = useMemo(() => {
    if (!product?.category_id || !allCategories.length) return null;
    const byId = new Map((allCategories as any[]).map((c) => [c.id, c]));
    let cur: any = byId.get(product.category_id);
    while (cur?.parent_id) cur = byId.get(cur.parent_id);
    return cur?.slug ?? null;
  }, [product, allCategories]);

  const isDoorProduct =
    rootCategorySlug === "mezhkomnatnye-dveri" || rootCategorySlug === "entrance-doors";
  const isEntranceDoor = rootCategorySlug === "entrance-doors";


  const [currentImage, setCurrentImage] = useState(0);
  const [selectedColor, setSelectedColor] = useState<string | null>(null);
  const [selectedPanel, setSelectedPanel] = useState<string | null>(null);
  const [selectedGlazing, setSelectedGlazing] = useState<string | null>(null);
  const [selectedEdge, setSelectedEdge] = useState<string | null>(null);
  const [selectedMolding, setSelectedMolding] = useState<string | null>(null);
  const [selectedWidth, setSelectedWidth] = useState<number | null>(null);
  const [selectedHeight, setSelectedHeight] = useState<number | null>(null);
  const [selectedOpeningSystem, setSelectedOpeningSystem] = useState<string | null>(null);
  const [selectedTrim, setSelectedTrim] = useState<Set<string>>(new Set());
  const [selectedHardware, setSelectedHardware] = useState<Set<string>>(new Set());
  const [hardwareTab, setHardwareTab] = useState<string>("handles");



  // ── Build real Погонаж / Фурнитура lists from DB ──
  // Walk parent_id chain to find each product's root category, then pick those
  // rooted in 'pogonazh' / 'furnitura'.
  const rootSlugById = useMemo(() => {
    const byId = new Map((allCategories as any[]).map((c) => [c.id, c]));
    const cache = new Map<string, string | null>();
    const resolve = (id: string | null | undefined): string | null => {
      if (!id) return null;
      if (cache.has(id)) return cache.get(id)!;
      let cur: any = byId.get(id);
      while (cur?.parent_id) cur = byId.get(cur.parent_id);
      const slug = cur?.slug ?? null;
      cache.set(id, slug);
      return slug;
    };
    const map = new Map<string, string | null>();
    for (const p of products as any[]) map.set(p.id, resolve(p.category_id));
    return map;
  }, [products, allCategories]);

  const toAccessoryItem = (p: any): AccessoryItem => {
    const primary = p.product_images?.find((i: any) => i.is_primary);
    const img = primary?.url || p.product_images?.[0]?.url || null;
    return {
      id: p.id,
      name: p.name,
      rrp: p.rrp ? Number(p.rrp) : null,
      image: img,
      slug: p.slug,
    };
  };

  const realTrim = useMemo<AccessoryItem[]>(() => {
    return (products as any[])
      .filter((p) => rootSlugById.get(p.id) === "pogonazh")
      .map(toAccessoryItem);
  }, [products, rootSlugById]);

  const realHardware = useMemo<AccessoryItem[]>(() => {
    return (products as any[])
      .filter((p) => rootSlugById.get(p.id) === "furnitura")
      .map(toAccessoryItem);
  }, [products, rootSlugById]);

  const filteredHardware = useMemo<AccessoryItem[]>(() => {
    const tab = HARDWARE_TABS.find((t) => t.key === hardwareTab) || HARDWARE_TABS[0];
    return realHardware.filter((h) => tab.match(h.name));
  }, [realHardware, hardwareTab]);

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

  // Per-collection axis labels (e.g. MAZE: molding="Наличник", HEAVY: edge="Кромка")
  // Source: specs.axes scraped from brandoors.ru
  const axes = (specs?.axes ?? {}) as Record<string, { name: string; values: string[] }>;
  const axisLabel = (uiAxis: "color" | "glazing" | "edge" | "molding"): string => {
    if (uiAxis === "color") return axes.color?.name || "Цвет покрытия";
    if (uiAxis === "glazing") return axes.glass?.name || axes.panelouter?.name || "Остекление";
    if (uiAxis === "edge") return axes.edge?.name || "Кромка";
    if (uiAxis === "molding") return axes.casing?.name || axes.panel?.name || "Молдинг";
    return uiAxis;
  };

  const widths: number[] = Array.isArray(specs?.widths) ? (specs!.widths as number[]) : [];
  const heights: number[] = Array.isArray(specs?.heights) ? (specs!.heights as number[]) : [];
  const characteristics = (specs?.characteristics ?? null) as Record<string, string> | null;
  const charLabels: Record<string, string> = {
    type: "Тип",
    style: "Стиль",
    material: "Материал",
    finishing: "Покрытие",
    thickness: "Толщина полотна",
  };


  // ── Extract real configurator options from product data ──
  // Show a section only when the product actually declares its options
  // (via specs.{colors|glazing_options|edge_colors|molding_colors},
  //  scalar specs.{color|glazing}, or nested variants[].{color|glazing|edge|molding}).
  const variants: any[] = Array.isArray(specs?.variants) ? specs!.variants : [];
  const collectFromSpecs = (
    arrKey: string,
    scalarKey: string | null,
    variantKey: string,
    axisKeys: string[] = [],
  ): string[] => {
    const seen = new Set<string>();
    const push = (v: any) => {
      if (!v) return;
      const s = typeof v === "string" ? v : v.name;
      if (typeof s === "string" && s.trim()) seen.add(s.trim());
    };
    const arr = specs?.[arrKey];
    if (Array.isArray(arr)) arr.forEach(push);
    if (scalarKey && specs?.[scalarKey]) push(specs[scalarKey]);
    variants.forEach((v) => push(v?.[variantKey]));
    // Fallback: per-collection axis values scraped from brandoors.ru
    for (const ak of axisKeys) {
      const vals = axes[ak]?.values;
      if (Array.isArray(vals)) vals.forEach(push);
    }
    return Array.from(seen);
  };


  // Colors derived from images that have a variant_key — these are real, image-bound colors.
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

  const specColorNames = collectFromSpecs("colors", "color", "color", ["color"]);
  const colorSwatches: { name: string; hex: string }[] = imageColors.length > 0
    ? imageColors
    : specColorNames.map((name) => {
        const mock = MOCK_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
        return { name, hex: mock?.hex ?? "#2a2a2a" };
      });
  const hasImageBoundColors = imageColors.length > 0;

  // Glazings derived from images that have a glazing_key — these are real, image-bound glazings.
  const imageGlazings = useMemo(() => {
    const seen = new Set<string>();
    const out: { name: string; preview: string }[] = [];
    for (const img of images as any[]) {
      const key = img.glazing_key?.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const mock = MOCK_GLAZING.find((g) => g.name.toLowerCase() === key.toLowerCase());
      out.push({ name: key, preview: mock?.preview ?? "#2a2a2a" });
    }
    return out;
  }, [images]);
  const specGlazingItems = collectFromSpecs("glazing_options", "glazing", "glazing", ["glass", "panelouter"]).map((name) => {
    const mock = MOCK_GLAZING.find((g) => g.name.toLowerCase() === name.toLowerCase());
    return { name, preview: mock?.preview ?? "#2a2a2a" };
  });
  // Show union of image-bound + spec-declared glazings so the customer sees
  // the full assortment from brandoors.ru even when no photo is loaded.
  const glazingItems = useMemo(() => {
    const seen = new Set(imageGlazings.map((g) => g.name.toLowerCase()));
    const extra = specGlazingItems.filter((g) => !seen.has(g.name.toLowerCase()));
    return [...imageGlazings, ...extra];
  }, [imageGlazings, specGlazingItems]);
  const hasImageBoundGlazings = imageGlazings.length > 0;
  const imageGlazingSet = useMemo(
    () => new Set(imageGlazings.map((g) => g.name.toLowerCase())),
    [imageGlazings],
  );

  // Build (color, glazing) availability matrix from images.
  const glazingsByColor = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const img of images as any[]) {
      const c = img.variant_key?.trim();
      const g = img.glazing_key?.trim();
      if (!c) continue;
      if (!map.has(c)) map.set(c, new Set());
      if (g) map.get(c)!.add(g);
    }
    return map;
  }, [images]);
  const colorsByGlazing = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const img of images as any[]) {
      const c = img.variant_key?.trim();
      const g = img.glazing_key?.trim();
      if (!g) continue;
      if (!map.has(g)) map.set(g, new Set());
      if (c) map.get(g)!.add(c);
    }
    return map;
  }, [images]);

  // Edges derived from images that have an edge_key — image-bound edge colors.
  const imageEdges = useMemo(() => {
    const seen = new Set<string>();
    const out: { name: string; hex: string }[] = [];
    for (const img of images as any[]) {
      const key = img.edge_key?.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const mock = MOCK_EDGE_COLORS.find((c) => c.name.toLowerCase() === key.toLowerCase());
      out.push({ name: key, hex: mock?.hex ?? "#9C9994" });
    }
    return out;
  }, [images]);
  // Same union pattern for edges: image-bound items first, spec-only appended.
  const specEdgeItems = collectFromSpecs("edge_colors", null, "edge", ["edge"]).map((name) => {
    const mock = MOCK_EDGE_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return { name, hex: mock?.hex ?? "#9C9994" };
  });
  const edgeItems = useMemo(() => {
    const seen = new Set(imageEdges.map((e) => e.name.toLowerCase()));
    const extra = specEdgeItems.filter((e) => !seen.has(e.name.toLowerCase()));
    return [...imageEdges, ...extra];
  }, [imageEdges, specEdgeItems]);
  const hasImageBoundEdges = imageEdges.length > 0;
  const imageEdgeSet = useMemo(
    () => new Set(imageEdges.map((e) => e.name.toLowerCase())),
    [imageEdges],
  );
  const edgesByColor = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const img of images as any[]) {
      const c = img.variant_key?.trim();
      const e = img.edge_key?.trim();
      if (!c) continue;
      if (!map.has(c)) map.set(c, new Set());
      if (e) map.get(c)!.add(e);
    }
    return map;
  }, [images]);
  const colorsByEdge = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const img of images as any[]) {
      const c = img.variant_key?.trim();
      const e = img.edge_key?.trim();
      if (!e) continue;
      if (!map.has(e)) map.set(e, new Set());
      if (c) map.get(e)!.add(c);
    }
    return map;
  }, [images]);

  // Moldings: image-bound + spec-declared union.
  const imageMoldings = useMemo(() => {
    const seen = new Set<string>();
    const out: { name: string; hex: string }[] = [];
    for (const img of images as any[]) {
      const key = img.molding_key?.trim();
      if (!key || seen.has(key)) continue;
      seen.add(key);
      const mock = MOCK_MOLDING_COLORS.find((c) => c.name.toLowerCase() === key.toLowerCase())
        || MOCK_EDGE_COLORS.find((c) => c.name.toLowerCase() === key.toLowerCase());
      out.push({ name: key, hex: mock?.hex ?? "#9C9994" });
    }
    return out;
  }, [images]);
  const specMoldingItems = collectFromSpecs("molding_colors", null, "molding", ["casing", "panel"]).map((name) => {
    const mock = MOCK_MOLDING_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase())
      || MOCK_EDGE_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return { name, hex: mock?.hex ?? "#9C9994" };
  });
  const moldingItems = useMemo(() => {
    const seen = new Set(imageMoldings.map((m) => m.name.toLowerCase()));
    const extra = specMoldingItems.filter((m) => !seen.has(m.name.toLowerCase()));
    return [...imageMoldings, ...extra];
  }, [imageMoldings, specMoldingItems]);
  const hasImageBoundMoldings = imageMoldings.length > 0;
  const imageMoldingSet = useMemo(
    () => new Set(imageMoldings.map((m) => m.name.toLowerCase())),
    [imageMoldings],
  );
  const moldingsByColor = useMemo(() => {
    const map = new Map<string, Set<string>>();
    for (const img of images as any[]) {
      const c = img.variant_key?.trim();
      const m = img.molding_key?.trim();
      if (!c) continue;
      if (!map.has(c)) map.set(c, new Set());
      if (m) map.get(c)!.add(m);
    }
    return map;
  }, [images]);


  // Set initial selected color/glazing/edge/molding from specs or first image
  useMemo(() => {
    if (specs?.color && !selectedColor) setSelectedColor(specs.color);
    // Only seed glazing from specs when the product really has image-bound glazings,
    // otherwise the stale value blocks later image matches (e.g. ESTETICA 04 edges).
    if (specs?.glazing && !selectedGlazing && imageGlazings.length > 0) setSelectedGlazing(specs.glazing);
    const firstImg = (images as any[])[0];
    if (firstImg) {
      if (!selectedColor && firstImg.variant_key) setSelectedColor(firstImg.variant_key);
      if (!selectedGlazing && firstImg.glazing_key) setSelectedGlazing(firstImg.glazing_key);
      if (!selectedEdge && firstImg.edge_key) setSelectedEdge(firstImg.edge_key);
      if (!selectedMolding && firstImg.molding_key) setSelectedMolding(firstImg.molding_key);
    }
  }, [specs, images]);

  // Find image matching (color, glazing, edge, molding) with graceful fallbacks.
  // `priority` controls which axis must match when an exact combo is missing.
  const findImage = (
    color: string | null,
    glazing: string | null,
    edge: string | null,
    molding: string | null,
    priority: "color" | "glazing" | "edge" | "molding" = "color",
  ) => {
    const imgs = images as any[];
    const eq = (a: any, b: any) =>
      typeof a === "string" && typeof b === "string" && a.toLowerCase() === b.toLowerCase();
    const matchAxes = (img: any, axes: Array<[string, string | null]>) =>
      axes.every(([k, v]) => v == null || eq(img[k], v));
    const colorAxis: [string, string | null] = ["variant_key", color];
    const glazingAxis: [string, string | null] = ["glazing_key", glazing];
    const edgeAxis: [string, string | null] = ["edge_key", edge];
    const moldingAxis: [string, string | null] = ["molding_key", molding];

    // Most specific → progressively relaxed.
    const all: Array<[string, string | null]> = [colorAxis, glazingAxis, edgeAxis, moldingAxis];
    // Build candidates: full combo first, then drop axes one at a time,
    // keeping the priority axis pinned as long as possible.
    const axisByPriority: Array<[string, string | null]> =
      priority === "glazing" ? [glazingAxis, colorAxis, edgeAxis, moldingAxis]
      : priority === "edge"  ? [edgeAxis, colorAxis, glazingAxis, moldingAxis]
      : priority === "molding" ? [moldingAxis, colorAxis, edgeAxis, glazingAxis]
      : [colorAxis, edgeAxis, glazingAxis, moldingAxis];

    const candidates: Array<Array<[string, string | null]>> = [all];
    // Pinned priority + each other axis individually
    for (let i = 1; i < axisByPriority.length; i++) {
      candidates.push([axisByPriority[0], axisByPriority[i]]);
    }
    // Pinned priority alone
    candidates.push([axisByPriority[0]]);
    // Then each remaining axis on its own (fallback by importance)
    for (let i = 1; i < axisByPriority.length; i++) {
      candidates.push([axisByPriority[i]]);
    }

    for (const axes of candidates) {
      if (axes.every(([_k, v]) => v == null)) continue;
      const i = imgs.findIndex((img) => matchAxes(img, axes));
      if (i >= 0) return { i, img: imgs[i] };
    }
    return { i: -1, img: null as any };
  };

  const syncFromImage = (img: any) => {
    if (img?.variant_key && img.variant_key !== selectedColor) setSelectedColor(img.variant_key);
    if (img?.glazing_key && img.glazing_key !== selectedGlazing) setSelectedGlazing(img.glazing_key);
    if (img?.edge_key && img.edge_key !== selectedEdge) setSelectedEdge(img.edge_key);
    if (img?.molding_key && img.molding_key !== selectedMolding) setSelectedMolding(img.molding_key);
  };

  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    if (!hasImageBoundColors) return;
    let glazing = selectedGlazing;
    // Only auto-switch image-bound selections; spec-only choices stay as-is.
    if (hasImageBoundGlazings && (!glazing || imageGlazingSet.has(glazing.toLowerCase()))) {
      const avail = glazingsByColor.get(colorName);
      if (avail && avail.size > 0 && (!glazing || !avail.has(glazing))) {
        glazing = Array.from(avail)[0];
        setSelectedGlazing(glazing);
      }
    }
    let edge = selectedEdge;
    if (hasImageBoundEdges && (!edge || imageEdgeSet.has(edge.toLowerCase()))) {
      const avail = edgesByColor.get(colorName);
      if (avail && avail.size > 0 && (!edge || !avail.has(edge))) {
        edge = Array.from(avail)[0];
        setSelectedEdge(edge);
      }
    }
    let molding = selectedMolding;
    if (hasImageBoundMoldings && (!molding || imageMoldingSet.has(molding.toLowerCase()))) {
      const avail = moldingsByColor.get(colorName);
      if (avail && avail.size > 0 && (!molding || !avail.has(molding))) {
        molding = Array.from(avail)[0];
        setSelectedMolding(molding);
      }
    }
    const { i, img } = findImage(colorName, glazing, edge, molding, "color");
    if (i >= 0) {
      setCurrentImage(i);
      syncFromImage(img);
    }
  };

  const handleSelectGlazing = (glazingName: string) => {
    setSelectedGlazing(glazingName);
    // Spec-only variant (no photo) — keep current image.
    if (!imageGlazingSet.has(glazingName.toLowerCase())) return;
    let color = selectedColor;
    if (hasImageBoundColors) {
      const avail = colorsByGlazing.get(glazingName);
      if (avail && avail.size > 0 && (!color || !avail.has(color))) {
        color = Array.from(avail)[0];
        setSelectedColor(color);
      }
    }
    const { i, img } = findImage(color, glazingName, selectedEdge, selectedMolding, "glazing");
    if (i >= 0) {
      setCurrentImage(i);
      syncFromImage(img);
    }
  };

  const handleSelectEdge = (edgeName: string) => {
    // Toggle off when re-clicking the same edge.
    const next = selectedEdge === edgeName ? null : edgeName;
    setSelectedEdge(next);
    if (!hasImageBoundEdges || next == null) {
      // Fall back to current image search without edge constraint.
      const { i, img } = findImage(selectedColor, selectedGlazing, next, selectedMolding, "color");
      if (i >= 0) { setCurrentImage(i); syncFromImage(img); }
      return;
    }
    // Spec-only edge — keep current image.
    if (!imageEdgeSet.has(next.toLowerCase())) return;
    let color = selectedColor;
    if (hasImageBoundColors) {
      const avail = colorsByEdge.get(next);
      if (avail && avail.size > 0 && (!color || !avail.has(color))) {
        color = Array.from(avail)[0];
        setSelectedColor(color);
      }
    }
    const { i, img } = findImage(color, selectedGlazing, next, selectedMolding, "edge");
    if (i >= 0) {
      setCurrentImage(i);
      syncFromImage(img);
    }
  };

  const handleSelectMolding = (moldingName: string) => {
    const next = selectedMolding === moldingName ? null : moldingName;
    setSelectedMolding(next);
    if (!hasImageBoundMoldings || next == null) return;
    // Spec-only molding — keep current image.
    if (!imageMoldingSet.has(next.toLowerCase())) return;
    const { i, img } = findImage(selectedColor, selectedGlazing, selectedEdge, next, "molding");
    if (i >= 0) {
      setCurrentImage(i);
      syncFromImage(img);
    }
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
      options: {
        ...(selectedWidth ? { width: selectedWidth } : {}),
        ...(selectedHeight ? { height: selectedHeight } : {}),
        ...(selectedColor ? { color: selectedColor } : {}),
        ...(selectedGlazing ? { glazing: selectedGlazing } : {}),
        ...(selectedEdge ? { edge: selectedEdge } : {}),
        ...(selectedMolding ? { molding: selectedMolding } : {}),
      },
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
    // Add selected trim items (real Погонаж products)
    selectedTrim.forEach((id) => {
      const item = realTrim.find((t) => t.id === id);
      if (item) {
        addItem({
          id: `${product.id}-${item.id}`,
          name: item.name,
          slug: item.slug,
          rrp: item.rrp,
          imageUrl: item.image,
          siteId: site.id,
          type: "trim",
          parentProductId: product.id,
        });
      }
    });
    // Add selected hardware items (real Фурнитура products)
    selectedHardware.forEach((id) => {
      const item = realHardware.find((h) => h.id === id);
      if (item) {
        addItem({
          id: `${product.id}-${item.id}`,
          name: item.name,
          slug: item.slug,
          rrp: item.rrp,
          imageUrl: item.image,
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




  return (
    <StorefrontLayout site={site}>
      <div className="min-h-screen pt-[68px] md:pt-0 bg-[#07090d]">
        <div className="max-w-[1440px] mx-auto px-4 sm:px-6 lg:px-12 py-8 md:py-14">

          {/* Breadcrumbs */}
          <div className="flex items-center gap-4 mb-10 text-[10px] uppercase tracking-[0.2em] font-light">
            <Link to={`/store/${slug}`} className="text-storefront-text/30 hover:text-storefront-gold transition-colors">
              Каталог
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <Link to={`/store/${slug}/catalog`} className="text-storefront-text/30 hover:text-storefront-gold transition-colors">
              Двери
            </Link>
            <span className="w-1 h-1 rounded-full bg-white/20" />
            <span className="text-storefront-text/60">{product.name}</span>
          </div>

          {/* ===== MAIN: HERO IMAGE + CONFIG ===== */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-24 items-start">

            {/* Hero image — 7/12 columns */}
            <div className="lg:col-span-7 lg:sticky lg:top-12 lg:self-start">
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden bg-[#0d0f14] border border-white/5 shadow-[0_40px_100px_-20px_rgba(0,0,0,0.8)] group">
                {images.length > 0 ? (
                  <img
                    key={currentImage}
                    src={images[currentImage]?.url}
                    alt={images[currentImage]?.alt || product.name}
                    className="w-full h-full object-contain p-8 animate-fade-in"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-storefront-muted/15 text-9xl font-bold">B</span>
                  </div>
                )}


                {images.length > 1 && (
                  <>
                    <button onClick={prevImage} aria-label="Предыдущее" className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#07090d]/92 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-storefront-gold hover:text-[#07090d] text-storefront-text">
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={nextImage} aria-label="Следующее" className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 bg-[#07090d]/92 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:bg-storefront-gold hover:text-[#07090d] text-storefront-text">
                      <ChevronRight className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-5 right-5 bg-[#07090d]/85 px-3 py-1 rounded-full text-[10px] text-storefront-text/70 tracking-wider tabular-nums">
                      {currentImage + 1} / {images.length}
                    </div>
                  </>
                )}
              </div>

              {/* Thumbnails */}
              {images.length > 1 && (
                <div className="flex gap-2 mt-4 overflow-x-auto scrollbar-hide">
                  {images.map((img: any, idx: number) => (
                    <button
                      key={img.id || idx}
                      onClick={() => setCurrentImage(idx)}
                      className={`relative shrink-0 w-[72px] aspect-square overflow-hidden bg-[#0c0e14] rounded-xl transition-opacity duration-200 ${
                        idx === currentImage
                          ? "ring-2 ring-storefront-gold ring-offset-2 ring-offset-[#07090d]"
                          : "opacity-50 hover:opacity-80"
                      }`}
                    >
                      <img src={img.url} alt="" loading="lazy" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info — 5/12 columns */}
            <div className="lg:col-span-5 min-w-0 flex flex-col pb-12 lg:pb-0">



              {/* Title */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl text-storefront-text leading-[1.0] mb-6 uppercase"
                style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 500, letterSpacing: "0.06em" }}
              >
                {product.name}
              </h1>

              {/* Hero price under title */}
              {Number(product.rrp) > 0 && (
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-[10px] font-light uppercase tracking-[0.25em] text-storefront-text/40">Стоимость от</span>
                  <span
                    className="text-[44px] leading-none text-storefront-gold tabular-nums"
                    style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 700, letterSpacing: "-0.02em" }}
                  >
                    {Number(product.rrp).toLocaleString("ru-RU")} ₽
                  </span>
                </div>
              )}

              {product.description && (
                <div
                  className="mb-10 rounded-2xl px-5 py-4 border border-storefront-gold/15 max-w-md"
                  style={{ background: "linear-gradient(180deg, rgba(207,187,150,0.06) 0%, rgba(255,255,255,0.02) 100%)" }}
                >
                  <p className="text-[15px] font-light leading-[1.65] text-storefront-text/85">
                    {product.description}
                  </p>
                </div>
              )}



              {/* ===== ENTRANCE DOOR PANEL + COLOR PICKER ===== */}
              {isEntranceDoor && Array.isArray(specs?.panels) && Array.isArray(specs?.colors) && Array.isArray(specs?.skus) && (
                <div className="space-y-5 mb-8">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[13px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Панель:</span>
                      <span className="text-[12px] text-storefront-gold/80">{selectedPanel || "—"}</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {(specs!.panels as string[]).map((p) => (
                        <button
                          key={p}
                          type="button"
                          onClick={() => {
                            setSelectedPanel(p);
                            const sku = (specs!.skus as any[]).find((s) => s.panel === p && (!selectedColor || s.color === selectedColor))
                              || (specs!.skus as any[]).find((s) => s.panel === p);
                            if (sku?.color) setSelectedColor(sku.color);
                            const idx = (images as any[]).findIndex(
                              (img) => img.variant_key && sku && img.variant_key.toLowerCase() === `${sku.panel}|${sku.color}`.toLowerCase()
                            );
                            if (idx >= 0) setCurrentImage(idx);
                          }}
                          className={`px-3 py-2 text-[12px] tracking-[0.1em] border transition-colors ${
                            selectedPanel === p
                              ? "border-storefront-gold text-storefront-gold bg-storefront-gold/5"
                              : "border-white/10 text-storefront-text/70 hover:border-storefront-gold/40"
                          }`}
                        >
                          {p}
                        </button>
                      ))}
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <span className="text-[13px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Цвет внутренней панели:</span>
                      <span className="text-[12px] text-storefront-gold/80">{selectedColor || "—"}</span>
                    </div>
                    <div className="flex flex-wrap gap-3">
                      {(specs!.colors as string[]).map((c) => {
                        const mock = MOCK_COLORS.find((m) => m.name.toLowerCase() === c.toLowerCase());
                        return (
                          <MaterialSwatch
                            key={c}
                            name={c}
                            hex={mock?.hex ?? "#2a2a2a"}
                            material={pickCoatingMaterial(c, mock?.hex ?? "#2a2a2a")}
                            selected={selectedColor === c}
                            onClick={() => {
                              setSelectedColor(c);
                              const sku = (specs!.skus as any[]).find((s) => s.color === c && (!selectedPanel || s.panel === selectedPanel))
                                || (specs!.skus as any[]).find((s) => s.color === c);
                              if (sku?.panel) setSelectedPanel(sku.panel);
                              const idx = (images as any[]).findIndex(
                                (img) => img.variant_key && sku && img.variant_key.toLowerCase() === `${sku.panel}|${sku.color}`.toLowerCase()
                              );
                              if (idx >= 0) setCurrentImage(idx);
                            }}
                          />
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ===== COLOR SWATCHES (only when product declares them) ===== */}
              {!isEntranceDoor && (colorSwatches.length > 0 || glazingItems.length > 0 || edgeItems.length > 0 || moldingItems.length > 0) && (
                <div className="space-y-5 mb-8">
                  {/* Coating color */}
                  {colorSwatches.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[13px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">{axisLabel("color")}:</span>
                        <span className="text-[12px] text-storefront-gold/80">{selectedColor || "—"}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {colorSwatches.map((c) => {
                          const disabled =
                            hasImageBoundColors &&
                            hasImageBoundGlazings &&
                            !!selectedGlazing &&
                            !(colorsByGlazing.get(selectedGlazing)?.has(c.name) ?? true);
                          return (
                            <MaterialSwatch
                              key={c.name}
                              name={c.name}
                              hex={c.hex}
                              material={pickCoatingMaterial(c.name, c.hex)}
                              selected={selectedColor === c.name}
                              onClick={() => handleSelectColor(c.name)}
                              disabled={disabled}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Glazing */}
                  {glazingItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[13px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">{axisLabel("glazing")}:</span>
                        <span className="text-[12px] text-storefront-gold/80">{selectedGlazing || "—"}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {glazingItems.map((g) => {
                          const mat = pickGlazingMaterial(g.name, g.preview);
                          const hex = mat === "lacobel" && g.preview.startsWith("#") ? g.preview : undefined;
                          const disabled =
                            imageGlazingSet.has(g.name.toLowerCase()) &&
                            hasImageBoundColors &&
                            !!selectedColor &&
                            imageGlazingSet.size > 0 &&
                            !(glazingsByColor.get(selectedColor)?.has(g.name) ?? true);
                          return (
                            <MaterialSwatch
                              key={g.name}
                              name={g.name}
                              hex={hex}
                              material={mat}
                              selected={selectedGlazing === g.name}
                              onClick={() => handleSelectGlazing(g.name)}
                              disabled={disabled}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Edge color */}
                  {edgeItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[13px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">{axisLabel("edge")}:</span>
                        <span className="text-[12px] text-storefront-gold/80">{selectedEdge || "—"}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {edgeItems.map((c) => {
                          const disabled =
                            imageEdgeSet.has(c.name.toLowerCase()) &&
                            hasImageBoundColors &&
                            !!selectedColor &&
                            !(edgesByColor.get(selectedColor)?.has(c.name) ?? true);
                          return (
                            <MaterialSwatch
                              key={c.name}
                              name={c.name}
                              hex={c.hex}
                              material="metal"
                              selected={selectedEdge === c.name}
                              onClick={() => handleSelectEdge(c.name)}
                              disabled={disabled}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Molding color */}
                  {moldingItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[13px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">{axisLabel("molding")}:</span>
                        <span className="text-[12px] text-storefront-gold/80">{selectedMolding || "—"}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {moldingItems.map((c) => (
                          <MaterialSwatch
                            key={c.name}
                            name={c.name}
                            hex={c.hex}
                            material={pickCoatingMaterial(c.name, c.hex) === "wood" ? "wood" : "metal"}
                            selected={selectedMolding === c.name}
                            onClick={() => handleSelectMolding(c.name)}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* ===== SIZE CALCULATOR ===== */}
              {(widths.length > 0 || heights.length > 0) && (
                <div className="mb-10">
                  <div className="mb-5 pb-3 border-b border-white/5">
                    <h2 className="text-[13px] uppercase tracking-[0.22em] font-light text-storefront-text/85">
                      Размер
                    </h2>
                  </div>

                  <div
                    className="rounded-2xl px-7 sm:px-9 py-9 space-y-12"
                    style={{
                      background: "linear-gradient(180deg, rgba(207,187,150,0.06) 0%, rgba(207,187,150,0.01) 100%)",
                      border: "1px solid rgba(207,187,150,0.1)",
                    }}
                  >
                    {widths.length > 0 && (
                      <DimensionSlider
                        label="Ширина"
                        values={widths}
                        selected={selectedWidth}
                        onChange={setSelectedWidth}
                        labelValues={[400, 600, 800, 1000]}
                      />
                    )}
                    {heights.length > 0 && (
                      <DimensionSlider
                        label="Высота"
                        values={heights.filter((h) => h !== 2400)}
                        selected={selectedHeight && selectedHeight !== 2400 ? selectedHeight : null}
                        onChange={setSelectedHeight}
                        labelValues={[1600, 1900, 2200, 2500]}
                      />
                    )}
                  </div>
                </div>
              )}

              {/* ===== OPENING SYSTEMS — only for interior doors ===== */}
              {isDoorProduct && !isEntranceDoor && (
                <OpeningSystems
                  value={selectedOpeningSystem}
                  onChange={setSelectedOpeningSystem}
                />
              )}

              {/* ===== TRIM (ПОГОНАЖ) ===== */}
              {!isEntranceDoor && realTrim.length > 0 && (
                <div className="mb-10">
                  <div className="mb-5 pb-3 border-b border-white/5">
                    <h2 className="text-[13px] uppercase tracking-[0.22em] font-light text-storefront-text/85">
                      Погонаж коллекции
                    </h2>
                  </div>
                  <ScrollCarousel>
                    {realTrim.map((item) => (
                      <div key={item.id} className="snap-start shrink-0 w-[230px] sm:w-[250px]">
                        <AccessoryCard
                          name={item.name}
                          rrp={item.rrp}
                          image={item.image}
                          active={selectedTrim.has(item.id)}
                          onClick={() => toggleTrim(item.id)}
                        />
                      </div>
                    ))}
                  </ScrollCarousel>
                </div>
              )}


              {/* ===== HARDWARE (ФУРНИТУРА) ===== */}
              {!isEntranceDoor && realHardware.length > 0 && (
                <div className="mb-10">


                  {/* Subcategory tabs */}
                  <div className="flex flex-wrap gap-2.5 mb-6">
                    {HARDWARE_TABS.map((t) => {
                      const count = t.key === "all" ? realHardware.length : realHardware.filter((h) => t.match(h.name)).length;
                      if (count === 0) return null;
                      const active = hardwareTab === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setHardwareTab(t.key)}
                          className={`shrink-0 px-5 py-3 rounded-full text-[12px] uppercase tracking-[0.18em] font-medium transition-all duration-200 border ${
                            active
                              ? "bg-storefront-gold text-[#07090d] border-storefront-gold shadow-[0_6px_20px_-8px_rgba(207,187,150,0.6)]"
                              : "bg-white/[0.03] text-storefront-text/65 border-white/10 hover:border-storefront-gold/50 hover:text-storefront-text"
                          }`}
                        >
                          {t.label}
                        </button>
                      );
                    })}
                  </div>

                  <ScrollCarousel>
                    {filteredHardware.map((item) => (
                      <div key={item.id} className="snap-start shrink-0 w-[230px] sm:w-[250px]">
                        <AccessoryCard
                          name={item.name}
                          rrp={item.rrp}
                          image={item.image}
                          active={selectedHardware.has(item.id)}
                          onClick={() => toggleHardware(item.id)}
                        />
                      </div>
                    ))}
                  </ScrollCarousel>
                </div>
              )}




              {/* ===== INFO ACCORDION ===== */}
              <div className="mb-8">
                <Accordion type="single" collapsible className="border-y border-white/5">
                  {(() => {
                    // Structured characteristics from brandoors.ru (type/style/material/finishing/thickness)
                    const charEntries = characteristics
                      ? Object.entries(characteristics).filter(([_, v]) => typeof v === "string" && v.trim() !== "")
                      : [];
                    // Plus any extra primitive specs we should expose
                    const reserved = new Set([
                      "color", "glazing", "sizes", "collection", "axes", "characteristics",
                      "widths", "heights",
                      "markup_height", "markup_width", "markup_h", "markup_w",
                      "sizes_order_note", "sizes_stock_note",
                    ]);
                    const extraEntries = specs
                      ? Object.entries(specs).filter(([k, v]) => !reserved.has(k) && v != null && typeof v !== "object")
                      : [];
                    const allEntries: [string, string][] = [
                      ...charEntries.map(([k, v]) => [charLabels[k] || k, String(v)] as [string, string]),
                      ...extraEntries.map(([k, v]) => [k, String(v)] as [string, string]),
                    ];
                    return allEntries.length > 0 ? (
                      <AccordionItem value="specs" className="border-b border-white/5">
                        <AccordionTrigger className="text-[12px] uppercase tracking-[0.2em] text-storefront-text/80 hover:no-underline font-medium">
                          Характеристики
                        </AccordionTrigger>
                        <AccordionContent>
                          <dl className="grid grid-cols-1 gap-y-2.5 text-[13px] font-light">
                            {allEntries.map(([k, v]) => (
                              <div key={k} className="flex justify-between gap-4 border-b border-white/[0.04] pb-2 last:border-0">
                                <dt className="text-storefront-text/50 capitalize">{k}</dt>
                                <dd className="text-storefront-text/90 text-right">{v}</dd>
                              </div>
                            ))}
                          </dl>
                        </AccordionContent>
                      </AccordionItem>
                    ) : null;
                  })()}


                  <AccordionItem value="construction" className="border-b border-white/5">
                    <AccordionTrigger className="text-[12px] uppercase tracking-[0.2em] text-storefront-text/80 hover:no-underline font-medium">
                      Конструкция и материалы
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-[13px] font-light leading-relaxed text-storefront-text/70">
                        Каркас из массива хвойных пород, заполнение — экологичный сотовый наполнитель.
                        Облицовка — экошпон премиум-класса с микротекстурой. Кромка алюминиевая по периметру,
                        скрытые петли, магнитный замок в стандартной комплектации.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="care" className="border-b border-white/5">
                    <AccordionTrigger className="text-[12px] uppercase tracking-[0.2em] text-storefront-text/80 hover:no-underline font-medium">
                      Уход
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="text-[13px] font-light leading-relaxed text-storefront-text/70 space-y-1.5 list-disc list-inside marker:text-storefront-gold/60">
                        <li>Протирайте мягкой влажной тканью без абразивов</li>
                        <li>Избегайте растворителей и спиртосодержащих средств</li>
                        <li>Поддерживайте влажность в помещении 40–60%</li>
                      </ul>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="delivery" className="border-b border-white/5">
                    <AccordionTrigger className="text-[12px] uppercase tracking-[0.2em] text-storefront-text/80 hover:no-underline font-medium">
                      Доставка и оплата
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-[13px] font-light leading-relaxed text-storefront-text/70">
                        Срок изготовления — 25 рабочих дней. Доставка по Москве — 3 500 ₽.
                        Оплата при получении или по счёту.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="warranty" className="border-b-0">
                    <AccordionTrigger className="text-[12px] uppercase tracking-[0.2em] text-storefront-text/80 hover:no-underline font-medium">
                      Гарантия
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-[13px] font-light leading-relaxed text-storefront-text/70">
                        1 год на изделие. Сервисный выезд в течение гарантийного срока.
                      </p>
                    </AccordionContent>
                  </AccordionItem>

                </Accordion>
              </div>

              {/* ===== ORDER SUMMARY (calculator-style) ===== */}
              {(() => {
                const doorPrice = product.rrp ? Number(product.rrp) : 0;
                const trimItems = realTrim.filter((t) => selectedTrim.has(t.id));
                const hwItems = realHardware.filter((h) => selectedHardware.has(h.id));
                const trimTotal = trimItems.reduce((s, t) => s + (t.rrp ?? 0), 0);
                const hwTotal = hwItems.reduce((s, h) => s + (h.rrp ?? 0), 0);
                const totalPrice = doorPrice + trimTotal + hwTotal;
                const hasExtras = selectedTrim.size > 0 || selectedHardware.size > 0;

                const rows: { label: string; value: string }[] = [];
                if (selectedColor) rows.push({ label: "Цвет", value: selectedColor });
                if (selectedGlazing) rows.push({ label: "Остекление", value: selectedGlazing });
                if (selectedEdge) rows.push({ label: "Кромка", value: selectedEdge });
                if (selectedMolding) rows.push({ label: "Наличник", value: selectedMolding });
                if (selectedWidth || selectedHeight)
                  rows.push({
                    label: "Размер",
                    value: `${selectedWidth ?? "—"} × ${selectedHeight ?? "—"} мм`,
                  });
                if (selectedOpeningSystem) {
                  const osName =
                    {
                      invisible: "Invisible (скрытая)",
                      compact: "Compact 180° (распашная)",
                      magic: "Magic (реверсивная)",
                      penal: "Пенал (откатная)",
                      "cupe-one": "Купе (одностворчатая)",
                      "cupe-two": "Купе 2 (двустворчатая)",
                    }[selectedOpeningSystem] ?? selectedOpeningSystem;
                  rows.push({ label: "Система открывания", value: osName });
                }
                if (trimItems.length > 0)
                  rows.push({ label: "Погонаж", value: `${trimItems.length} поз.` });
                if (hwItems.length > 0)
                  rows.push({ label: "Фурнитура", value: `${hwItems.length} поз.` });

                return (
                  <div className="mt-10">
                    <div className="mb-5 pb-3 border-b border-white/5">
                      <h2 className="text-[13px] uppercase tracking-[0.22em] font-light text-storefront-text/85">
                        Ваша конфигурация
                      </h2>
                    </div>

                    <div
                      className="rounded-2xl px-7 sm:px-9 py-7"
                      style={{
                        background:
                          "linear-gradient(180deg, rgba(207,187,150,0.06) 0%, rgba(207,187,150,0.01) 100%)",
                        border: "1px solid rgba(207,187,150,0.1)",
                      }}
                    >
                      {rows.length > 0 ? (
                        <dl className="grid grid-cols-1 gap-y-3 mb-7">
                          {rows.map((r) => (
                            <div
                              key={r.label}
                              className="flex justify-between gap-4 border-b border-white/[0.05] pb-2.5 last:border-0"
                            >
                              <dt
                                className="text-[13px] uppercase tracking-[0.18em] text-storefront-text/55"
                                style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 500 }}
                              >
                                {r.label}
                              </dt>
                              <dd
                                className="text-[15px] text-storefront-text text-right tabular-nums"
                                style={{ fontFamily: "'Manrope', system-ui, sans-serif", fontWeight: 600 }}
                              >
                                {r.value}
                              </dd>
                            </div>
                          ))}
                        </dl>
                      ) : (
                        <p className="text-[13px] text-storefront-text/50 font-light mb-7">
                          Выберите параметры выше — итог появится здесь.
                        </p>
                      )}

                      <div className="flex items-end justify-between gap-4 flex-wrap pt-2">
                        <div className="min-w-0">
                          {totalPrice > 0 ? (
                            <>
                              <div className="text-[10px] uppercase tracking-[0.25em] text-storefront-text/45 mb-1.5">
                                {hasExtras ? "Итого" : "Стоимость"}
                              </div>
                              <div
                                className="text-[34px] leading-none text-storefront-gold tabular-nums"
                                style={{
                                  fontFamily: "'Manrope', system-ui, sans-serif",
                                  fontWeight: 700,
                                  letterSpacing: "-0.02em",
                                }}
                              >
                                {totalPrice.toLocaleString("ru-RU")} ₽
                              </div>
                            </>
                          ) : (
                            <div className="text-[12px] uppercase tracking-[0.22em] text-storefront-text/55 font-semibold">
                              Цена по запросу
                            </div>
                          )}
                        </div>
                        <button
                          onClick={handleAddAllToCart}
                          className={`shrink-0 px-9 py-4 rounded-full text-[11px] font-medium uppercase tracking-[0.25em] transition-[transform,filter] duration-200 active:scale-[0.985] flex items-center justify-center gap-2 ${
                            isInCart
                              ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                              : "bg-storefront-gold text-[#07090d] hover:brightness-110 shadow-[0_12px_30px_-8px_rgba(212,175,55,0.4)]"
                          }`}
                        >
                          {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                          <span>{isInCart ? "В корзине" : "В корзину"}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })()}

            </div>

          </div>


          {/* ===== SIMILAR PRODUCTS ===== */}
          {similar.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-[1px] bg-storefront-gold/40" />
                <h2 className="text-xl sm:text-2xl font-bold text-storefront-text uppercase tracking-wide">
                  Похожие модели
                </h2>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                {similar.map((p: any) => {
                  const img = getPrimaryImage(p);
                  return (
                    <Link
                      key={p.id}
                      to={`/store/${slug}/product/${p.slug}`}
                      className="group block"
                      onClick={() => { setCurrentImage(0); window.scrollTo({ top: 0, behavior: "smooth" }); }}
                    >
                      <div className="relative overflow-hidden bg-[#0c0e14] flex items-center justify-center rounded-2xl" style={{ minHeight: "250px" }}>
                        {img ? (
                          <img src={img} alt={p.name} loading="lazy" className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-105" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <span className="text-storefront-muted/15 text-5xl font-bold">B</span>
                          </div>
                        )}
                      </div>
                      <div className="pt-3">
                        <h3 className="text-xs font-semibold text-storefront-text uppercase tracking-wider leading-snug mb-1 line-clamp-2">{p.name}</h3>
                        {Number(p.rrp) > 0 && <p className="text-sm font-medium text-storefront-text tabular-nums">{Number(p.rrp).toLocaleString("ru-RU")} ₽</p>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </section>
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
