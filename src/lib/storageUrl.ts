// Rewrites Lovable Cloud (staging) Supabase Storage URLs to the self-hosted
// production storage at api.brandoors.su when the app is served from a
// production domain. On Lovable preview / localhost the original URL is kept
// so editing inside Lovable continues to work against the staging bucket.

const STAGING_HOST = "xhhxxmrhrvodybqcdcml.supabase.co";
const PROD_STORAGE_ORIGIN = "https://api.brandoors.su";

function isProdHost(host: string): boolean {
  if (!host) return false;
  if (host === "localhost" || host === "127.0.0.1") return false;
  if (host.endsWith(".lovable.app") || host.endsWith(".lovableproject.com")) return false;
  return true;
}

export function resolveStorageUrl<T extends string | null | undefined>(url: T): T {
  if (!url) return url;
  if (typeof window === "undefined") return url;
  if (!isProdHost(window.location.hostname)) return url;
  if (typeof url !== "string") return url;
  if (url.includes(STAGING_HOST)) {
    return url.replace(`https://${STAGING_HOST}`, PROD_STORAGE_ORIGIN) as T;
  }
  return url;
}
