-- 1) product_images: добавляем ключ варианта остекления
ALTER TABLE public.product_images
  ADD COLUMN IF NOT EXISTS glazing_key text;

CREATE INDEX IF NOT EXISTS idx_product_images_variant
  ON public.product_images (product_id, variant_key, glazing_key);

-- 2) products: внешний ID с brandoors.ru для идемпотентного импорта
ALTER TABLE public.products
  ADD COLUMN IF NOT EXISTS source_id text;

CREATE UNIQUE INDEX IF NOT EXISTS idx_products_source_id
  ON public.products (source_id)
  WHERE source_id IS NOT NULL;

-- 3) Справочник вариантов остекления
CREATE TABLE IF NOT EXISTS public.glazing_options (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text NOT NULL UNIQUE,
  name text NOT NULL,
  swatch_url text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.glazing_options TO anon, authenticated;
GRANT ALL ON public.glazing_options TO service_role;
GRANT INSERT, UPDATE, DELETE ON public.glazing_options TO authenticated;

ALTER TABLE public.glazing_options ENABLE ROW LEVEL SECURITY;

CREATE POLICY "glazing_options_select_all"
  ON public.glazing_options FOR SELECT
  USING (true);

CREATE POLICY "glazing_options_admin_write"
  ON public.glazing_options FOR ALL
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_glazing_options_updated_at
  BEFORE UPDATE ON public.glazing_options
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();