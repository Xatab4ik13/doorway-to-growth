import { useState, useCallback } from "react";
import { useQueryClient, useQuery, useMutation } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export type ProductImage = {
  id: string;
  product_id: string;
  url: string;
  is_primary: boolean | null;
  sort_order: number | null;
  alt: string | null;
};

export function useProductImages(productId: string) {
  const qc = useQueryClient();

  const { data: images = [] } = useQuery({
    queryKey: ["product_images", productId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("product_images")
        .select("*")
        .eq("product_id", productId)
        .order("sort_order", { ascending: true });
      if (error) throw error;
      return (data ?? []) as ProductImage[];
    },
  });

  const [uploading, setUploading] = useState(false);

  const uploadImage = useCallback(async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split(".").pop() || "jpg";
      const path = `${productId}/${Date.now()}.${ext}`;

      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(path, file, { contentType: file.type, upsert: false });

      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("product-images")
        .getPublicUrl(path);

      const isPrimary = images.length === 0;

      const { error: insertError } = await supabase
        .from("product_images")
        .insert({
          product_id: productId,
          url: urlData.publicUrl,
          is_primary: isPrimary,
          sort_order: images.length,
        });

      if (insertError) throw insertError;

      qc.invalidateQueries({ queryKey: ["product_images", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });
      toast({ title: "Фото загружено" });
    } catch (e: any) {
      toast({ title: "Ошибка загрузки", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  }, [productId, images.length, qc]);

  const deleteImageMut = useMutation({
    mutationFn: async (imageId: string) => {
      const img = images.find((i) => i.id === imageId);
      if (!img) return;

      // Delete from storage
      const path = img.url.split("/product-images/").pop();
      if (path) {
        await supabase.storage.from("product-images").remove([path]);
      }

      const { error } = await supabase.from("product_images").delete().eq("id", imageId);
      if (error) throw error;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["product_images", productId] });
      qc.invalidateQueries({ queryKey: ["products"] });
    },
    onError: (e) => toast({ title: "Ошибка", description: e.message, variant: "destructive" }),
  });

  return {
    images,
    uploading,
    uploadImage,
    deleteImage: (id: string) => deleteImageMut.mutate(id),
  };
}
