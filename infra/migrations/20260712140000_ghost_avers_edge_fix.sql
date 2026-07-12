UPDATE product_images pi
SET edge_key = pi.glazing_key, glazing_key = NULL
FROM products p
WHERE pi.product_id = p.id
  AND p.name = 'GHOST Avers'
  AND pi.edge_key IS NULL
  AND pi.glazing_key IN ('Белый abc','Черный abc');
