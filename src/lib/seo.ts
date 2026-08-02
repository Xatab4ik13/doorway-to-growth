/**
 * Schema.org JSON-LD helpers for Brandoors storefront.
 * All URLs are built from window.location.origin so they stay correct
 * for each custom domain (brandoors.moscow, brandoors.online, etc.).
 */

export function getOrigin() {
  if (typeof window !== "undefined") return window.location.origin;
  return "https://brandoors.su";
}

export function getPageUrl(path?: string) {
  const origin = getOrigin();
  if (path) return `${origin}${path}`;
  if (typeof window !== "undefined") return origin + window.location.pathname + window.location.search;
  return origin;
}

export function buildOrganizationSchema() {
  const origin = getOrigin();
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    "@id": `${origin}/#organization`,
    name: "Brandoors",
    url: origin,
    logo: `${origin}/favicon.png`,
    description: "Производитель межкомнатных и входных дверей премиум-класса",
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "sales",
      areaServed: "RU",
      availableLanguage: "Russian",
    },
  };
}

interface LocalBusinessSite {
  name: string;
  city: string;
  district?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  latitude?: number | null;
  longitude?: number | null;
}

/** Часы работы салонов — единый график торговых центров. */
export const SALON_HOURS = [
  { days: "Пн — Вс", time: "10:00 — 20:00" },
];

export function buildLocalBusinessSchema(site: LocalBusinessSite) {
  const origin = getOrigin();
  const geo =
    site.latitude != null && site.longitude != null
      ? {
          "@type": "GeoCoordinates",
          latitude: site.latitude,
          longitude: site.longitude,
        }
      : undefined;

  return {
    "@context": "https://schema.org",
    "@type": "Store",
    "@id": `${origin}/#store`,
    name: site.name,
    description: `Салон дверей Brandoors в ${site.district || site.city}`,
    url: origin,
    image: `${origin}/og-image.png`,
    telephone: site.phone,
    email: site.email,
    priceRange: "₽₽₽",
    currenciesAccepted: "RUB",
    areaServed: {
      "@type": "City",
      name: site.city,
    },
    parentOrganization: { "@id": `${origin}/#organization` },
    address: {
      "@type": "PostalAddress",
      addressLocality: site.city,
      streetAddress: site.address || `${site.district || site.city}`,
      addressCountry: "RU",
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: "10:00",
        closes: "20:00",
      },
    ],
    ...(geo ? { geo } : {}),
  };
}


interface ProductData {
  slug: string;
  name: string;
  description?: string | null;
  rrp?: number | null;
  image?: string | null;
  categoryName?: string | null;
  collectionName?: string | null;
  sku?: string | null;
}

export function buildProductSchema(product: ProductData) {
  const pageUrl = getPageUrl(`/product/${product.slug}`);
  const image = product.image
    ? product.image.startsWith("http")
      ? product.image
      : `${getOrigin()}${product.image}`
    : `${getOrigin()}/favicon.png`;

  const price = product.rrp && product.rrp > 0 ? product.rrp : null;

  const offer = price
    ? {
        "@type": "Offer",
        price,
        priceCurrency: "RUB",
        availability: "https://schema.org/InStock",
        url: pageUrl,
      }
    : {
        "@type": "Offer",
        price: "0",
        priceCurrency: "RUB",
        availability: "https://schema.org/InStock",
        url: pageUrl,
        priceSpecification: {
          "@type": "PriceSpecification",
          price: "0",
          priceCurrency: "RUB",
          description: "Цена по запросу",
        },
      };

  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description || `Дверь ${product.name} от Brandoors`,
    image,
    url: pageUrl,
    brand: {
      "@type": "Brand",
      name: "Brandoors",
    },
    category: product.categoryName || "Двери",
    sku: product.sku || product.slug,
    mpn: product.sku || product.slug,
    itemCondition: "https://schema.org/NewCondition",
    ...(product.collectionName
      ? {
          additionalProperty: [
            {
              "@type": "PropertyValue",
              name: "Коллекция",
              value: product.collectionName,
            },
          ],
        }
      : {}),
    offers: offer,
  };
}

interface BreadcrumbItem {
  name: string;
  path?: string;
}

export function buildBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.path ? getPageUrl(item.path) : undefined,
    })),
  };
}
