import { useState, useMemo, useRef } from "react";
import { useParams, Link } from "react-router-dom";
import { useSiteBySlug } from "@/hooks/useSiteBySlug";
import { useStorefrontProducts, useStorefrontCategories } from "@/hooks/useStorefrontData";
import { useDocumentMeta } from "@/hooks/useDocumentMeta";
import { useSiteSlug } from "@/hooks/useSiteSlug";
import { StorefrontLayout } from "@/components/storefront/StorefrontLayout";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";
import { ArrowLeft, ChevronLeft, ChevronRight, Ruler, ShoppingCart, Check, Plus, DoorOpen, Lock, CircleDot } from "lucide-react";
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
  { key: "all", label: "Все", match: () => true },
  { key: "handles", label: "Ручки", match: (n) => /ручк|скоб|кноп/i.test(n) },
  { key: "locks", label: "Защёлки и замки", match: (n) => /защ[её]лк|замк|замок|корпус/i.test(n) },
  { key: "hinges", label: "Петли", match: (n) => /петл/i.test(n) },
  { key: "systems", label: "Системы", match: (n) => /invisible|compack|magic|пенал|купе|sky/i.test(n) },
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
      className={`group relative flex flex-col rounded-2xl overflow-hidden text-left transition-all duration-300 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-storefront-gold/60 ${
        active
          ? "ring-2 ring-storefront-gold shadow-[0_10px_30px_-8px_rgba(207,187,150,0.35)]"
          : "ring-1 ring-white/10 hover:ring-storefront-gold/40 shadow-[0_6px_18px_-8px_rgba(0,0,0,0.7)]"
      }`}
    >
      {/* Photo */}
      <div className="relative aspect-[5/4] bg-[#0c0e14] overflow-hidden">
        {image ? (
          <img
            src={image}
            alt={name}
            loading="lazy"
            draggable={false}
            className="absolute inset-0 w-full h-full object-contain p-4 transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-storefront-muted/20 text-4xl font-bold">B</div>
        )}
        {/* Add / Check badge */}
        <span
          className={`absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center transition-all duration-200 ${
            active
              ? "bg-storefront-gold text-[#07090d]"
              : "bg-[#07090d]/92 text-storefront-text/80 group-hover:bg-storefront-gold group-hover:text-[#07090d]"
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
          {rrp && rrp > 0 ? `+${rrp.toLocaleString("ru-RU")} ₽` : "По запросу"}
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
  const [selectedTrim, setSelectedTrim] = useState<Set<string>>(new Set());
  const [selectedHardware, setSelectedHardware] = useState<Set<string>>(new Set());
  const [hardwareTab, setHardwareTab] = useState<string>("all");


  const trimScrollRef = useRef<HTMLDivElement>(null);
  const hardwareScrollRef = useRef<HTMLDivElement>(null);

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
    if (tab.key === "all") return realHardware;
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

  const glazingItems = collectFromSpecs("glazing_options", "glazing", "glazing", ["glass", "panelouter"]).map((name) => {
    const mock = MOCK_GLAZING.find((g) => g.name.toLowerCase() === name.toLowerCase());
    return { name, preview: mock?.preview ?? "#2a2a2a" };
  });
  const edgeItems = collectFromSpecs("edge_colors", null, "edge", ["edge"]).map((name) => {

    const mock = MOCK_EDGE_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
    return { name, hex: mock?.hex ?? "#2a2a2a" };
  });
  // Moldings — prefer image-bound molding_key, then specs.moldings, fall back to molding_colors.
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
  const specMoldingNames = collectFromSpecs("moldings", null, "molding", ["casing", "panel"]);
  const moldingItems = imageMoldings.length > 0
    ? imageMoldings
    : (specMoldingNames.length > 0 ? specMoldingNames : collectFromSpecs("molding_colors", null, "molding", ["casing", "panel"])).map((name) => {

        const mock = MOCK_MOLDING_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase())
          || MOCK_EDGE_COLORS.find((c) => c.name.toLowerCase() === name.toLowerCase());
        return { name, hex: mock?.hex ?? "#9C9994" };
      });
  const hasImageBoundMoldings = imageMoldings.length > 0;

  // Set initial selected color/glazing/molding from specs or first image
  useMemo(() => {
    if (specs?.color && !selectedColor) setSelectedColor(specs.color);
    if (specs?.glazing && !selectedGlazing) setSelectedGlazing(specs.glazing);
    const firstImg = (images as any[])[0];
    if (firstImg) {
      if (!selectedColor && firstImg.variant_key) setSelectedColor(firstImg.variant_key);
      if (!selectedGlazing && firstImg.glazing_key) setSelectedGlazing(firstImg.glazing_key);
      if (!selectedMolding && firstImg.molding_key) setSelectedMolding(firstImg.molding_key);
    }
  }, [specs, images]);

  // Find image matching (color, glazing, molding) with graceful fallbacks.
  // `priority` controls which axis must match when an exact combo is missing.
  const findImage = (
    color: string | null,
    glazing: string | null,
    molding: string | null,
    priority: "color" | "glazing" | "molding" = "color",
  ) => {
    const imgs = images as any[];
    const eq = (a: any, b: any) =>
      typeof a === "string" && typeof b === "string" && a.toLowerCase() === b.toLowerCase();
    const matchAxes = (img: any, axes: Array<[string, string | null]>) =>
      axes.every(([k, v]) => v == null || eq(img[k], v));
    const colorAxis: [string, string | null] = ["variant_key", color];
    const glazingAxis: [string, string | null] = ["glazing_key", glazing];
    const moldingAxis: [string, string | null] = ["molding_key", molding];
    // Most-specific first, then fallbacks ordered by the requested priority axis.
    const priorityChain: Array<Array<[string, string | null]>> =
      priority === "glazing"
        ? [[glazingAxis, colorAxis], [glazingAxis, moldingAxis], [glazingAxis], [colorAxis], [moldingAxis]]
        : priority === "molding"
        ? [[moldingAxis, colorAxis], [moldingAxis, glazingAxis], [moldingAxis], [colorAxis], [glazingAxis]]
        : [[colorAxis, glazingAxis], [colorAxis, moldingAxis], [colorAxis], [glazingAxis], [moldingAxis]];
    const candidates: Array<Array<[string, string | null]>> = [
      [colorAxis, glazingAxis, moldingAxis],
      ...priorityChain,
    ];
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
    if (img?.molding_key && img.molding_key !== selectedMolding) setSelectedMolding(img.molding_key);
  };

  const handleSelectColor = (colorName: string) => {
    setSelectedColor(colorName);
    if (!hasImageBoundColors) return;
    const { i, img } = findImage(colorName, selectedGlazing, selectedMolding, "color");
    if (i >= 0) {
      setCurrentImage(i);
      syncFromImage(img);
    }
  };

  const handleSelectGlazing = (glazingName: string) => {
    setSelectedGlazing(glazingName);
    const { i, img } = findImage(selectedColor, glazingName, selectedMolding, "glazing");
    if (i >= 0) {
      setCurrentImage(i);
      syncFromImage(img);
    }
  };

  const handleSelectMolding = (moldingName: string) => {
    setSelectedMolding(moldingName);
    if (!hasImageBoundMoldings) return;
    const { i, img } = findImage(selectedColor, selectedGlazing, moldingName, "molding");
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

                {/* Floating collection badge */}
                {product.categories && (
                  <div className="absolute top-8 left-8">
                    <span className="px-4 py-1.5 rounded-full border border-storefront-gold/30 bg-[#07090d]/85 text-storefront-gold text-[10px] tracking-[0.2em] uppercase">
                      {(product.categories as any)?.name}
                    </span>
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
            <div className="lg:col-span-5 flex flex-col">
              {/* Sticky selection summary — appears once user picks anything */}
              {(() => {
                const pills: { label: string; value: string }[] = [];
                if (selectedColor) pills.push({ label: "Покрытие", value: selectedColor });
                if (selectedGlazing) pills.push({ label: "Стекло", value: selectedGlazing });
                if (selectedEdge) pills.push({ label: "Кромка", value: selectedEdge });
                if (selectedMolding) pills.push({ label: "Молдинг", value: selectedMolding });
                if (selectedTrim.size > 0) pills.push({ label: "Погонаж", value: `${selectedTrim.size} поз.` });
                if (selectedHardware.size > 0) pills.push({ label: "Фурнитура", value: `${selectedHardware.size} поз.` });
                if (pills.length === 0) return null;
                return (
                  <div className="lg:sticky lg:top-4 z-20 mb-6 -mx-2 px-2 py-2.5 rounded-2xl bg-[#0c0e14]/95 border border-storefront-gold/15 shadow-[0_8px_24px_-12px_rgba(0,0,0,0.8)]">
                    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
                      <span className="shrink-0 text-[9px] uppercase tracking-[0.2em] text-storefront-text/40 pl-1">Ваш выбор</span>
                      {pills.map((p) => (
                        <span
                          key={p.label}
                          className="shrink-0 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[11px]"
                        >
                          <span className="text-storefront-text/40">{p.label}:</span>
                          <span className="text-storefront-text/90">{p.value}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                );
              })()}

              {/* Title */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extralight tracking-tight text-storefront-text leading-[1.05] mb-6">
                {product.name}
              </h1>

              {/* Hero price under title */}
              {product.rrp && Number(product.rrp) > 0 && (
                <div className="flex items-baseline gap-4 mb-6">
                  <span className="text-[10px] font-light uppercase tracking-[0.25em] text-storefront-text/40">Стоимость от</span>
                  <span
                    className="text-[44px] leading-none text-storefront-gold tabular-nums"
                    style={{ fontFamily: "'Raleway', system-ui, sans-serif", fontWeight: 300, letterSpacing: "-0.01em" }}
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
                      <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Панель:</span>
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
                      <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">Цвет внутренней панели:</span>
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
                        <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">{axisLabel("color")}:</span>
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
                  )}

                  {/* Glazing */}
                  {glazingItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">{axisLabel("glazing")}:</span>
                        <span className="text-[12px] text-storefront-gold/80">{selectedGlazing || "—"}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {glazingItems.map((g) => {
                          const mat = pickGlazingMaterial(g.name, g.preview);
                          const hex = mat === "lacobel" && g.preview.startsWith("#") ? g.preview : undefined;
                          return (
                            <MaterialSwatch
                              key={g.name}
                              name={g.name}
                              hex={hex}
                              material={mat}
                              selected={selectedGlazing === g.name}
                              onClick={() => handleSelectGlazing(g.name)}
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
                        <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">{axisLabel("edge")}:</span>
                        <span className="text-[12px] text-storefront-gold/80">{selectedEdge || "—"}</span>
                      </div>
                      <div className="flex flex-wrap gap-3">
                        {edgeItems.map((c) => (
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
                  )}

                  {/* Molding color */}
                  {moldingItems.length > 0 && (
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <span className="text-[11px] uppercase tracking-[0.2em] text-storefront-muted font-semibold">{axisLabel("molding")}:</span>
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

              {/* ===== TRIM (ПОГОНАЖ) ===== */}
              {!isEntranceDoor && realTrim.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-storefront-gold/10 flex items-center justify-center">
                        <DoorOpen className="w-4 h-4 text-storefront-gold" />
                      </div>
                      <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text">
                        Погонаж коллекции
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-text/40">
                      {realTrim.length} поз.
                    </span>
                  </div>
                  <div className="relative">
                    <button
                      onClick={() => trimScrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#07090d]/90 border border-white/10 flex items-center justify-center hover:bg-storefront-gold hover:text-[#07090d] hover:border-storefront-gold transition-colors"
                      style={{ color: "rgba(245,245,240,0.5)" }}
                      aria-label="Назад"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div ref={trimScrollRef} className="-mx-2 px-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                      <div className="flex gap-3 pb-2">
                        {realTrim.map((item) => (
                          <div key={item.id} className="snap-start shrink-0 w-[160px]">
                            <AccessoryCard
                              name={item.name}
                              rrp={item.rrp}
                              image={item.image}
                              active={selectedTrim.has(item.id)}
                              onClick={() => toggleTrim(item.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => trimScrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#07090d]/90 border border-white/10 flex items-center justify-center hover:bg-storefront-gold hover:text-[#07090d] hover:border-storefront-gold transition-colors"
                      style={{ color: "rgba(245,245,240,0.5)" }}
                      aria-label="Вперёд"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ===== HARDWARE (ФУРНИТУРА) ===== */}
              {!isEntranceDoor && realHardware.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center justify-between gap-2 mb-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-storefront-gold/10 flex items-center justify-center">
                        <Lock className="w-4 h-4 text-storefront-gold" />
                      </div>
                      <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text">
                        Фурнитура
                      </span>
                    </div>
                    <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-text/40">
                      {filteredHardware.length} из {realHardware.length}
                    </span>
                  </div>

                  {/* Subcategory tabs */}
                  <div className="flex gap-1.5 mb-3 overflow-x-auto scrollbar-hide -mx-2 px-2">
                    {HARDWARE_TABS.map((t) => {
                      const count = t.key === "all" ? realHardware.length : realHardware.filter((h) => t.match(h.name)).length;
                      if (count === 0) return null;
                      const active = hardwareTab === t.key;
                      return (
                        <button
                          key={t.key}
                          onClick={() => setHardwareTab(t.key)}
                          className={`shrink-0 px-3 py-1.5 rounded-full text-[11px] uppercase tracking-[0.15em] transition-colors duration-150 ${
                            active
                              ? "bg-storefront-gold text-[#07090d]"
                              : "bg-white/[0.04] text-storefront-text/70 hover:bg-white/[0.08]"
                          }`}
                        >
                          {t.label}
                          <span className={`ml-1.5 text-[10px] ${active ? "opacity-70" : "opacity-50"}`}>{count}</span>
                        </button>
                      );
                    })}
                  </div>

                  <div className="relative">
                    <button
                      onClick={() => hardwareScrollRef.current?.scrollBy({ left: -340, behavior: "smooth" })}
                      className="absolute left-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#07090d]/90 border border-white/10 flex items-center justify-center hover:bg-storefront-gold hover:text-[#07090d] hover:border-storefront-gold transition-colors"
                      style={{ color: "rgba(245,245,240,0.5)" }}
                      aria-label="Назад"
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <div ref={hardwareScrollRef} className="-mx-2 px-2 overflow-x-auto scrollbar-hide snap-x snap-mandatory">
                      <div className="flex gap-3 pb-2">
                        {filteredHardware.map((item) => (
                          <div key={item.id} className="snap-start shrink-0 w-[160px]">
                            <AccessoryCard
                              name={item.name}
                              rrp={item.rrp}
                              image={item.image}
                              active={selectedHardware.has(item.id)}
                              onClick={() => toggleHardware(item.id)}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                    <button
                      onClick={() => hardwareScrollRef.current?.scrollBy({ left: 340, behavior: "smooth" })}
                      className="absolute right-0 top-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#07090d]/90 border border-white/10 flex items-center justify-center hover:bg-storefront-gold hover:text-[#07090d] hover:border-storefront-gold transition-colors"
                      style={{ color: "rgba(245,245,240,0.5)" }}
                      aria-label="Вперёд"
                    >
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}

              {/* ===== OPENING SYSTEMS — only for interior doors ===== */}
              {isDoorProduct && !isEntranceDoor && <OpeningSystems />}



              {(widths.length > 0 || heights.length > 0) && (
                <div className="mb-8">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-8 h-8 rounded-lg bg-storefront-gold/10 flex items-center justify-center">
                      <Ruler className="w-4 h-4 text-storefront-gold" />
                    </div>
                    <span className="text-[13px] uppercase tracking-[0.15em] font-semibold text-storefront-text">
                      Размер
                    </span>
                  </div>

                  <div className="rounded-2xl overflow-hidden" style={{ background: "linear-gradient(180deg, rgba(207,187,150,0.06) 0%, rgba(207,187,150,0.01) 100%)", border: "1px solid rgba(207,187,150,0.1)" }}>
                    {widths.length > 0 && (
                      <div className="px-5 py-4 border-b border-white/5">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-muted">Ширина, мм</span>
                          <span className="text-[12px] text-storefront-gold/80">{selectedWidth ?? "—"}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {widths.map((w) => (
                            <button
                              key={`w-${w}`}
                              type="button"
                              onClick={() => setSelectedWidth(w)}
                              className={`px-4 py-2 rounded-xl text-[13px] font-medium tabular-nums border transition-colors ${
                                selectedWidth === w
                                  ? "border-storefront-gold text-storefront-gold bg-storefront-gold/10"
                                  : "border-white/[0.06] bg-white/[0.04] text-storefront-text hover:border-storefront-gold/30"
                              }`}
                            >
                              {w}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                    {heights.length > 0 && (
                      <div className="px-5 py-4">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-[10px] uppercase tracking-[0.2em] text-storefront-muted">Высота, мм</span>
                          <span className="text-[12px] text-storefront-gold/80">{selectedHeight ?? "—"}</span>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {heights.map((h) => (
                            <button
                              key={`h-${h}`}
                              type="button"
                              onClick={() => setSelectedHeight(h)}
                              className={`px-4 py-2 rounded-xl text-[13px] font-medium tabular-nums border transition-colors ${
                                selectedHeight === h
                                  ? "border-storefront-gold text-storefront-gold bg-storefront-gold/10"
                                  : "border-white/[0.06] bg-white/[0.04] text-storefront-text hover:border-storefront-gold/30"
                              }`}
                            >
                              {h}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
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

              {/* ===== PRICE SUMMARY (extras only) + CTA ===== */}
              <div className="mt-auto pt-8 border-t border-white/5">
                {(() => {
                  const doorPrice = product.rrp ? Number(product.rrp) : 0;
                  const trimTotal = realTrim.filter((t) => selectedTrim.has(t.id)).reduce((s, t) => s + (t.rrp ?? 0), 0);
                  const hwTotal = realHardware.filter((h) => selectedHardware.has(h.id)).reduce((s, h) => s + (h.rrp ?? 0), 0);
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
                        <span
                          className="text-[30px] leading-none text-storefront-gold tabular-nums"
                          style={{ fontFamily: "'Raleway', system-ui, sans-serif", fontWeight: 300, letterSpacing: "-0.01em" }}
                        >
                          {totalPrice.toLocaleString("ru-RU")} ₽
                        </span>
                      </div>
                    </div>
                  );
                })()}

                <button
                  onClick={handleAddAllToCart}
                  className={`w-full py-5 rounded-full text-xs font-medium uppercase tracking-[0.3em] transition-[transform,filter] duration-200 active:scale-[0.985] flex items-center justify-center gap-3 ${
                    isInCart
                      ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                      : "bg-storefront-gold text-[#07090d] hover:brightness-110 shadow-[0_20px_50px_-10px_rgba(212,175,55,0.3)]"
                  }`}
                >
                  {isInCart ? <Check className="w-4 h-4" /> : <ShoppingCart className="w-4 h-4" />}
                  {isInCart ? "В корзине" : (selectedTrim.size > 0 || selectedHardware.size > 0) ? "Добавить комплект" : "Добавить в корзину"}
                </button>
                <p className="mt-5 text-center text-[10px] text-storefront-text/30 uppercase tracking-[0.3em] font-light">
                  Замер — платная услуга · Срок изготовления 25 рабочих дней
                </p>

              </div>
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
                        {p.rrp && <p className="text-sm font-medium text-storefront-text tabular-nums">{Number(p.rrp).toLocaleString("ru-RU")} ₽</p>}
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
