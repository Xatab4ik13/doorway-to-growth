import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useStorefrontProducts(siteId: string | undefined) {
  return useQuery({
    queryKey: ["storefront-products", siteId],
    queryFn: async () => {
      // Fetch all active products in chunks to bypass PostgREST default 1000-row limit
      const PAGE = 1000;
      const select =
        "id, slug, name, rrp, sort_order, category_id, specifications, categories(name, slug), product_images(url, is_primary, sort_order, variant_key)";
      const all: any[] = [];
      for (let from = 0; ; from += PAGE) {
        const { data, error } = await supabase
          .from("products")
          .select(select)
          .eq("is_active", true)
          .order("sort_order", { ascending: true })
          .order("id", { ascending: true })
          .range(from, from + PAGE - 1);
        if (error) throw error;
        if (!data || data.length === 0) break;
        all.push(...data);
        if (data.length < PAGE) break;
      }
      return all;
    },
    enabled: !!siteId,
    staleTime: 5 * 60 * 1000,
    gcTime: 10 * 60 * 1000,
  });
}


export function useStorefrontBanners(siteId: string | undefined) {
  return useQuery({
    queryKey: ["storefront-banners", siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_banners")
        .select("*")
        .eq("site_id", siteId!)
        .eq("is_active", true)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!siteId,
  });
}

export function useStorefrontStaff(siteId: string | undefined) {
  return useQuery({
    queryKey: ["storefront-staff", siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_staff")
        .select("*")
        .eq("site_id", siteId!)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!siteId,
  });
}

export function useStorefrontReviews(siteId: string | undefined) {
  return useQuery({
    queryKey: ["storefront-reviews", siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("partner_reviews")
        .select("*")
        .eq("site_id", siteId!)
        .eq("is_published", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!siteId,
  });
}

export function useStorefrontPromotions(siteId: string | undefined) {
  return useQuery({
    queryKey: ["storefront-promotions", siteId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("promotions")
        .select("*, promotion_products(product_id, products(name, slug))")
        .eq("site_id", siteId!)
        .eq("is_active", true)
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data ?? [];
    },
    enabled: !!siteId,
  });
}

export function useStorefrontCategories() {
  return useQuery({
    queryKey: ["storefront-categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return data ?? [];
    },
    staleTime: 10 * 60 * 1000,
    gcTime: 30 * 60 * 1000,
  });
}
