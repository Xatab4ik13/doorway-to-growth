import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type LeadStage = "new" | "consultation" | "quote" | "paid" | "completed" | "cancelled";

export type Lead = {
  id: string;
  name: string;
  phone: string | null;
  email: string | null;
  product_id: string | null;
  partner_id: string | null;
  message: string | null;
  source: string | null;
  stage: LeadStage;
  assigned_to: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
  partner?: { id: string; name: string } | null;
  product?: { id: string; name: string } | null;
};

export function useLeads() {
  return useQuery({
    queryKey: ["leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("leads")
        .select("*, partners(id, name), products(id, name)")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return (data ?? []).map((l: any) => ({
        ...l,
        stage: l.stage as LeadStage,
        partner: l.partners,
        product: l.products,
      })) as Lead[];
    },
  });
}

export function useUpdateLeadStage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, stage }: { id: string; stage: LeadStage }) => {
      const { error } = await supabase.from("leads").update({ stage }).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["leads"] }),
  });
}

export function useDeleteLead() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("leads").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["leads"] });
      toast({ title: "Заявка удалена", variant: "destructive" });
    },
  });
}
