/**
 * Единая брендовая сущность Brandoors.
 * brandoors.online — головной сайт бренда: на него ссылаются все остальные
 * витрины и в него «сходится» Organization в разметке Schema.org.
 */

export const BRAND_NAME = "Brandoors";
export const BRAND_HOST = "brandoors.online";
export const BRAND_URL = `https://${BRAND_HOST}`;
export const BRAND_ID = `${BRAND_URL}/#organization`;

/** Все домены сети — используются в sameAs, чтобы связать сайты в один бренд. */
export const BRAND_DOMAINS = [
  "brandoors.online",
  "brandoors.moscow",
  "brandoors.su",
  "brandoors.pro",
  "brandoors.store",
];

export const BRAND_SAME_AS = BRAND_DOMAINS.map((d) => `https://${d}`);

/** true — если текущий сайт и есть головной сайт бренда. */
export function isBrandHost(host?: string) {
  const h = host ?? (typeof window !== "undefined" ? window.location.hostname : "");
  return h.replace(/^www\./, "") === BRAND_HOST;
}
