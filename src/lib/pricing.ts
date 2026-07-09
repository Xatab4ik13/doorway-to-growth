// Centralized pricing helpers for storefront.
// Doors: base `rrp` on product + markups from `specifications` JSONB (color/glazing/molding/edge).
// Furniture/pogonazh: base `rrp` used as-is (per-color variants are separate products).

export type ProductPricingOptions = {
  color?: string;
  glazing?: string;
  molding?: string;
  edge?: string;
};

export function computeProductPrice(
  base: number | null | undefined,
  specs: any,
  opts: ProductPricingOptions = {}
): number | null {
  const b = Number(base) || 0;
  if (b <= 0) return null;
  let markup = 0;
  const pick = (map: any, key?: string) => {
    if (!key || !map || typeof map !== "object") return 0;
    const v = map[key];
    const n = Number(v);
    return Number.isFinite(n) ? n : 0;
  };
  markup += pick(specs?.color_markups, opts.color);
  markup += pick(specs?.glazing_markups, opts.glazing);
  markup += pick(specs?.molding_markups, opts.molding);
  markup += pick(specs?.edge_markups, opts.edge);
  return b + markup;
}

export function formatPriceRUB(price: number | null | undefined): string {
  const n = Number(price);
  if (!Number.isFinite(n) || n <= 0) return "Цена по запросу";
  return `${n.toLocaleString("ru-RU")} ₽`;
}
