import { useEffect } from "react";

interface DocumentMetaOptions {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
  noIndex?: boolean;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

function setMeta(name: string, content: string) {
  let el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  if (!el) {
    el = document.createElement("meta");
    if (name.startsWith("og:")) {
      el.setAttribute("property", name);
    } else {
      el.setAttribute("name", name);
    }
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function removeMeta(name: string) {
  const el = document.querySelector(`meta[name="${name}"]`) || document.querySelector(`meta[property="${name}"]`);
  if (el) el.remove();
}

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

function setJsonLd(data?: Record<string, unknown> | Record<string, unknown>[]) {
  // Remove existing JSON-LD scripts added by this hook (tagged with data-managed="seo")
  document.querySelectorAll('script[type="application/ld+json"][data-managed="seo"]').forEach((el) => el.remove());

  if (!data) return;

  const payloads = Array.isArray(data) ? data : [data];
  for (const payload of payloads) {
    const el = document.createElement("script");
    el.setAttribute("type", "application/ld+json");
    el.setAttribute("data-managed", "seo");
    el.textContent = JSON.stringify(payload);
    document.head.appendChild(el);
  }
}

export function useDocumentMeta({
  title,
  description,
  ogTitle,
  ogDescription,
  ogImage,
  ogUrl,
  canonical,
  noIndex,
  jsonLd,
}: DocumentMetaOptions) {
  useEffect(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "https://brandoors.su";
    const path = typeof window !== "undefined" ? window.location.pathname + window.location.search : "/";
    const pageUrl = ogUrl || canonical || origin + path;
    const prevTitle = document.title;

    document.title = title;
    setMeta("description", description || title);
    setMeta("og:title", ogTitle || title);
    setMeta("og:description", ogDescription || description || title);
    setMeta("og:type", "website");
    setMeta("og:url", pageUrl);
    setCanonical(pageUrl);

    if (ogImage) {
      setMeta("og:image", ogImage);
    } else {
      removeMeta("og:image");
    }

    if (noIndex) {
      setMeta("robots", "noindex, nofollow");
    } else {
      removeMeta("robots");
    }

    setJsonLd(jsonLd);

    return () => {
      document.title = prevTitle;
      setJsonLd(undefined);
    };
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, canonical, noIndex, jsonLd]);
}
