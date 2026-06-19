// Build storefront URLs that adapt to hosting mode.
// On a custom domain (each store has its own TLD) the base is "",
// so links are clean (/catalog, /product/x, /cart, /brand).
// On dev/preview the base is "/store/<slug>".

export function isStorefrontHost(): boolean {
  if (typeof window === "undefined") return false;
  const h = window.location.hostname;
  if (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h.includes("lovable.app") ||
    h.includes("lovableproject.com")
  ) return false;
  if (h === "crm.brandoors.su") return false;
  if (h === "brandoors.su" || h === "www.brandoors.su") return false;
  return true;
}

export function storeBase(slug?: string | null): string {
  if (isStorefrontHost()) return "";
  return slug ? `/store/${slug}` : "";
}

// path may start with "/" or not; both work.
export function storeHref(slug: string | null | undefined, path: string = ""): string {
  const base = storeBase(slug);
  if (!path) return base || "/";
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${base}${p}`;
}
