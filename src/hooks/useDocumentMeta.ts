import { useEffect } from "react";

interface DocumentMetaOptions {
  title: string;
  description?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  canonical?: string;
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

function setCanonical(url: string) {
  let el = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", url);
}

export function useDocumentMeta({ title, description, ogTitle, ogDescription, ogImage, ogUrl, canonical }: DocumentMetaOptions) {
  useEffect(() => {
    const prevTitle = document.title;
    document.title = title;

    if (description) setMeta("description", description);
    if (ogTitle || title) setMeta("og:title", ogTitle || title);
    if (ogDescription || description) setMeta("og:description", (ogDescription || description)!);
    if (ogImage) setMeta("og:image", ogImage);
    if (ogUrl) setMeta("og:url", ogUrl);
    setMeta("og:type", "website");
    if (canonical) setCanonical(canonical);

    return () => {
      document.title = prevTitle;
    };
  }, [title, description, ogTitle, ogDescription, ogImage, ogUrl, canonical]);
}
