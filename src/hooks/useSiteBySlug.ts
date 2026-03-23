import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export type StorefrontSite = {
  id: string;
  name: string;
  slug: string;
  domain: string | null;
  city: string;
  district: string | null;
  address: string | null;
  description: string | null;
  logo_url: string | null;
  phone: string | null;
  email: string | null;
  website: string | null;
  latitude: number | null;
  longitude: number | null;
  is_active: boolean | null;
};

export function useSiteBySlug(slug: string | undefined) {
  return useQuery({
    queryKey: ["site", slug],
    queryFn: async () => {
      if (!slug) throw new Error("No slug");
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("slug", slug)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data as StorefrontSite;
    },
    enabled: !!slug,
  });
}

export function useSiteByDomain(domain: string) {
  return useQuery({
    queryKey: ["site-domain", domain],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("sites")
        .select("*")
        .eq("domain", domain)
        .eq("is_active", true)
        .single();
      if (error) throw error;
      return data as StorefrontSite;
    },
    enabled: !!domain,
  });
}
