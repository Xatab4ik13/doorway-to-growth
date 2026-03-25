import { createContext, useContext, ReactNode, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useSiteBySlug, useSiteByDomain, StorefrontSite } from "@/hooks/useSiteBySlug";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

interface SiteContextType {
  site: StorefrontSite | null;
  isLoading: boolean;
  error: Error | null;
  isStorefront: boolean;
  siteSlug: string | null;
}

const SiteContext = createContext<SiteContextType>({
  site: null,
  isLoading: false,
  error: null,
  isStorefront: false,
  siteSlug: null,
});

// Known non-storefront hostnames
const CRM_HOSTS = ["crm.brandoors.su", "localhost", "127.0.0.1"];
const MAIN_HOSTS = ["brandoors.su", "www.brandoors.su"];

function isPreviewHost(hostname: string) {
  return hostname.includes("lovable.app") || hostname.includes("lovableproject.com");
}

function extractSlugFromSubdomain(hostname: string): string | null {
  // Handle {slug}.brandoors.su
  const match = hostname.match(/^([a-z0-9-]+)\.brandoors\.su$/i);
  if (match && !CRM_HOSTS.includes(hostname) && !MAIN_HOSTS.includes(hostname)) {
    return match[1];
  }
  return null;
}

export function useSiteFromHostname() {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  // Check if it's a subdomain of brandoors.su
  const subdomainSlug = extractSlugFromSubdomain(hostname);

  // Check if it's a custom domain (not brandoors.ru, not preview, not localhost)
  const isCustomDomain =
    !isPreviewHost(hostname) &&
    !hostname.endsWith("brandoors.ru") &&
    !CRM_HOSTS.includes(hostname) &&
    hostname !== "";

  const customDomainQuery = useQuery({
    queryKey: ["site-by-domain", hostname],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("domain", hostname)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data as StorefrontSite;
    },
    enabled: isCustomDomain,
  });

  const subdomainQuery = useSiteBySlug(subdomainSlug ?? undefined);

  if (isCustomDomain) {
    return {
      site: customDomainQuery.data ?? null,
      isLoading: customDomainQuery.isLoading,
      error: customDomainQuery.error as Error | null,
      isStorefront: true,
      siteSlug: customDomainQuery.data?.slug ?? null,
    };
  }

  if (subdomainSlug) {
    return {
      site: subdomainQuery.data ?? null,
      isLoading: subdomainQuery.isLoading,
      error: subdomainQuery.error as Error | null,
      isStorefront: true,
      siteSlug: subdomainSlug,
    };
  }

  return {
    site: null,
    isLoading: false,
    error: null,
    isStorefront: false,
    siteSlug: null,
  };
}

export function SiteProvider({ children }: { children: ReactNode }) {
  const value = useSiteFromHostname();
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>;
}

export function useSiteContext() {
  return useContext(SiteContext);
}
