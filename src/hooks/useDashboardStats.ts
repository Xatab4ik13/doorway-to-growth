import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export function useDashboardStats() {
  return useQuery({
    queryKey: ["dashboard-stats"],
    queryFn: async () => {
      const now = new Date();
      const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate()).toISOString();
      const weekStart = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 7).toISOString();

      const [
        { count: leadsToday },
        { count: leadsWeek },
        { count: activePartners },
        { count: totalPartners },
        { count: totalProducts },
        { count: activeSites },
        { data: recentLeads },
      ] = await Promise.all([
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", todayStart),
        supabase.from("leads").select("*", { count: "exact", head: true }).gte("created_at", weekStart),
        supabase.from("partners").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("partners").select("*", { count: "exact", head: true }),
        supabase.from("products").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase.from("sites").select("*", { count: "exact", head: true }).eq("is_active", true),
        supabase
          .from("leads")
          .select("*, partners(id, name), products(id, name)")
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      return {
        leadsToday: leadsToday ?? 0,
        leadsWeek: leadsWeek ?? 0,
        activePartners: activePartners ?? 0,
        totalPartners: totalPartners ?? 0,
        totalProducts: totalProducts ?? 0,
        activeSites: activeSites ?? 0,
        recentLeads: (recentLeads ?? []).map((l: any) => ({
          ...l,
          partner: l.partners,
          product: l.products,
        })),
      };
    },
    refetchInterval: 30000,
  });
}
