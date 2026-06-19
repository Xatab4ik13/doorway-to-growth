import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { resolveStorageUrl } from "@/lib/storageUrl";

export type Product = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  category_id: string | null;
  rrp: number | null;
  specifications: Record<string, string> | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at: string;
  updated_at: string;
  category?: { id: string; name: string; slug: string } | null;
  primary_image?: string | null;
};

export function useProducts() {
  return useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("products")
        .select("*, categories(id, name, slug), product_images(url, is_primary)")
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []).map((p: any) => ({
        ...p,
        category: p.categories,
        primary_image: p.product_images?.find((i: any) => i.is_primary)?.url ?? p.product_images?.[0]?.url ?? null,
      })) as Product[];
    },
  });
}

export function useCreateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (product: { name: string; slug: string; category_id?: string; rrp?: number; specifications?: Record<string, string>; description?: string }) => {
      const { data, error } = await supabase.from("products").insert(product).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Товар добавлен" });
    },
    onError: (e) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });
}

export function useUpdateProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: { id: string } & Partial<Product>) => {
      const { error } = await supabase.from("products").update(updates).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
    },
  });
}

export function useDeleteProduct() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("products").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Товар удалён", variant: "destructive" });
    },
    onError: (e) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });
}

export function useCategories() {
  return useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase.from("categories").select("*").order("sort_order");
      if (error) throw error;
      return data ?? [];
    },
  });
}

export function useCreateCategory() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (cat: { name: string; slug: string; description?: string; parent_id?: string }) => {
      const { data, error } = await supabase.from("categories").insert(cat).select().single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["categories"] }),
  });
}
