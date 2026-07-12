
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS is_stale BOOLEAN NOT NULL DEFAULT false;
CREATE INDEX IF NOT EXISTS idx_product_images_stale ON public.product_images(product_id, is_stale);

CREATE TABLE IF NOT EXISTS public.product_variants_staging (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  sku_source_id BIGINT,
  sku_source_name TEXT,
  image_source_url TEXT,
  image_source_path TEXT,
  color_name TEXT,
  edge_name TEXT,
  glazing_name TEXT,
  molding_name TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  matched_image_id UUID REFERENCES public.product_images(id) ON DELETE SET NULL,
  notes TEXT,
  imported_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.product_variants_staging TO authenticated;
GRANT ALL ON public.product_variants_staging TO service_role;

ALTER TABLE public.product_variants_staging ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view variant staging"
  ON public.product_variants_staging FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert variant staging"
  ON public.product_variants_staging FOR INSERT
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update variant staging"
  ON public.product_variants_staging FOR UPDATE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can delete variant staging"
  ON public.product_variants_staging FOR DELETE
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE INDEX IF NOT EXISTS idx_variants_staging_product_status
  ON public.product_variants_staging(product_name, status);
CREATE INDEX IF NOT EXISTS idx_variants_staging_product_id
  ON public.product_variants_staging(product_id);

CREATE TRIGGER update_product_variants_staging_updated_at
  BEFORE UPDATE ON public.product_variants_staging
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();
