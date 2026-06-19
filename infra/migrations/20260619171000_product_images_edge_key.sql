-- Add edge_key axis to product_images and move misclassified edge values
-- (AL Black/Gold/Хром/Ral & Ncs) out of glazing_key for solid-panel collections.

ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS edge_key TEXT;
CREATE INDEX IF NOT EXISTS idx_product_images_edge ON public.product_images(product_id, edge_key);
CREATE INDEX IF NOT EXISTS idx_product_images_full_axes ON public.product_images(product_id, variant_key, edge_key, glazing_key, molding_key);

UPDATE public.product_images AS pi
SET edge_key = pi.glazing_key,
    glazing_key = NULL
FROM public.products p
WHERE pi.product_id = p.id
  AND pi.glazing_key IN ('AL Black','AL Gold','Хром','Ral & Ncs','AL Хром')
  AND (
    p.name ~ '^(ESTETICA|HEAVY) (01|02|03|04|09|10)$'
    OR p.name ~ '^GHOST '
  );
