-- MAZE: fill missing casing (molding_key) values based on filename patterns
UPDATE product_images pi
SET molding_key = 'Классический'
FROM products p
WHERE pi.product_id = p.id
  AND p.name LIKE 'MAZE%'
  AND pi.molding_key IS NULL
  AND pi.url LIKE '%standart%';

UPDATE product_images pi
SET molding_key = 'Компланарный'
FROM products p
WHERE pi.product_id = p.id
  AND p.name = 'MAZE 04'
  AND pi.molding_key IS NULL
  AND pi.url LIKE '%mazekomp%';
