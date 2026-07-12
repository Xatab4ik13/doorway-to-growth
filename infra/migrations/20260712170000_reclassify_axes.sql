-- Reclassify misplaced axes on product_images (prod one-off).
-- On prod historical import, edges landed in glazing_key and glazings landed
-- in molding_key. Move everything to correct axes in one pass.

BEGIN;

-- 1) All values currently in glazing_key are edges → move to edge_key.
UPDATE product_images
SET edge_key = COALESCE(edge_key, glazing_key),
    glazing_key = NULL
WHERE glazing_key IN ('AL Gold','AL Black','AL Хром','Хром','Ral & Ncs');

-- 2) Edges misplaced in molding_key → move to edge_key.
UPDATE product_images
SET edge_key = COALESCE(edge_key, molding_key),
    molding_key = NULL
WHERE molding_key IN ('AL Gold','AL Black','AL Хром','Хром');

-- 3) True moldings stay in molding_key (Классический / Компланарный) — no-op.

-- 4) Everything else in molding_key is a glazing → move to glazing_key.
UPDATE product_images
SET glazing_key = COALESCE(glazing_key, molding_key),
    molding_key = NULL
WHERE molding_key IS NOT NULL
  AND molding_key NOT IN ('Классический','Компланарный');

COMMIT;

-- Sanity check
SELECT
  COUNT(*) AS total,
  COUNT(variant_key) AS with_color,
  COUNT(glazing_key) AS with_glazing,
  COUNT(molding_key) AS with_molding,
  COUNT(edge_key)    AS with_edge
FROM product_images;
