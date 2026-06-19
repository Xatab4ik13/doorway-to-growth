ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS molding_key TEXT;
CREATE INDEX IF NOT EXISTS idx_product_images_full_variant ON public.product_images(product_id, variant_key, glazing_key, molding_key);
