import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

/**
 * Resolves site slug from URL param OR hostname.
 * In subdomain mode ({slug}.brandoors.su) or custom domain mode,
 * queries the DB to find the matching slug.
 */
export function useSiteSlug(urlSlug?: string): string | undefined {
  const hostname = typeof window !== "undefined" ? window.location.hostname : "";

  const hostnameSlug = useMemo(() => {
    // If URL slug is provided, use it directly
    if (urlSlug) return null;

    // Preview/localhost → no hostname slug
    if (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.includes("lovable.app") ||
      hostname.includes("lovableproject.com")
    ) {
      return null;
    }

    // Strip leading www. for matching
    const normalized = hostname.replace(/^www\./i, "");

    // brandoors.su itself → resolve via DB by domain (store m2)
    if (normalized === "brandoors.su") {
      return `__domain:brandoors.su`;
    }

    // {slug}.brandoors.su → extract slug from subdomain
    const match = normalized.match(/^([a-z0-9-]+)\.brandoors\.su$/i);
    if (match && match[1] !== "crm") {
      return match[1];
    }

    // Custom domain → we need to query DB
    if (!normalized.endsWith("brandoors.su")) {
      return `__domain:${normalized}`;
    }

    return null;
  }, [urlSlug, hostname]);

  // Query for custom domain resolution
  const isCustomDomain = hostnameSlug?.startsWith("__domain:");
  const customDomain = isCustomDomain ? hostnameSlug!.replace("__domain:", "") : "";

  const { data: domainSite } = useQuery({
    queryKey: ["site-domain-slug", customDomain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("slug")
        .eq("domain", customDomain)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data?.slug;
    },
    enabled: isCustomDomain && !!customDomain,
  });

  if (urlSlug) return urlSlug;
  if (isCustomDomain) return domainSite ?? undefined;
  if (hostnameSlug) return hostnameSlug;
  return undefined;
}
