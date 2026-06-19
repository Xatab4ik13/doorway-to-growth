-- MAZE collection: replace product images for MAZE 01/02/03 with locally-hosted webp files
-- Variation axis: molding_key = casing type (Классический / Ступенчатый / Компланарный)
-- MAZE 02 has an extra color variant (NCS S 0502Y)

DELETE FROM product_images WHERE product_id IN (
  'd902bd4b-eeae-47b9-9635-1dcdc5abafbc',
  '1c20024b-5919-4634-ab5e-bdbde1c82b92',
  '8e1679f1-6e2e-4454-9ea3-003e3f13a7c1'
);

INSERT INTO product_images (product_id,url,alt,sort_order,is_primary,variant_key,glazing_key,molding_key) VALUES
('d902bd4b-eeae-47b9-9635-1dcdc5abafbc','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/01mazestandart.webp','MAZE 01 Классический Ral & Ncs',0,true,'Ral & Ncs',NULL,'Классический'),
('d902bd4b-eeae-47b9-9635-1dcdc5abafbc','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/01mazestupench.webp','MAZE 01 Ступенчатый Ral & Ncs',1,false,'Ral & Ncs',NULL,'Ступенчатый'),
('d902bd4b-eeae-47b9-9635-1dcdc5abafbc','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/01mazekomp.webp','MAZE 01 Компланарный Ral & Ncs',2,false,'Ral & Ncs',NULL,'Компланарный'),
('1c20024b-5919-4634-ab5e-bdbde1c82b92','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/02mazestandart.webp','MAZE 02 Классический Ral & Ncs',3,true,'Ral & Ncs',NULL,'Классический'),
('1c20024b-5919-4634-ab5e-bdbde1c82b92','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/02mazestupench.webp','MAZE 02 Ступенчатый Ral & Ncs',4,false,'Ral & Ncs',NULL,'Ступенчатый'),
('1c20024b-5919-4634-ab5e-bdbde1c82b92','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/02mazekomp.webp','MAZE 02 Компланарный Ral & Ncs',5,false,'Ral & Ncs',NULL,'Компланарный'),
('1c20024b-5919-4634-ab5e-bdbde1c82b92','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/02mazestandartncs0502y.webp','MAZE 02 Классический NCS S 0502Y',6,false,'NCS S 0502Y',NULL,'Классический'),
('1c20024b-5919-4634-ab5e-bdbde1c82b92','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/02mazestupenchncs0502y.webp','MAZE 02 Ступенчатый NCS S 0502Y',7,false,'NCS S 0502Y',NULL,'Ступенчатый'),
('1c20024b-5919-4634-ab5e-bdbde1c82b92','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/02mazekompncs0502y.webp','MAZE 02 Компланарный NCS S 0502Y',8,false,'NCS S 0502Y',NULL,'Компланарный'),
('8e1679f1-6e2e-4454-9ea3-003e3f13a7c1','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/03mazestandart.webp','MAZE 03 Классический Ral & Ncs',9,true,'Ral & Ncs',NULL,'Классический'),
('8e1679f1-6e2e-4454-9ea3-003e3f13a7c1','https://xhhxxmrhrvodybqcdcml.supabase.co/storage/v1/object/public/product-images/maze/03mazestupench.webp','MAZE 03 Ступенчатый Ral & Ncs',10,false,'Ral & Ncs',NULL,'Ступенчатый');

UPDATE products SET specifications = COALESCE(specifications,'{}'::jsonb) || jsonb_build_object(
  'collection','MAZE',
  'colors', jsonb_build_array('Ral & Ncs','NCS S 0502Y'),
  'molding_options', jsonb_build_array('Классический','Ступенчатый','Компланарный'),
  'molding_markups', jsonb_build_object('Классический',0,'Ступенчатый',0,'Компланарный',0)
) WHERE id IN (
  'd902bd4b-eeae-47b9-9635-1dcdc5abafbc',
  '1c20024b-5919-4634-ab5e-bdbde1c82b92',
  '8e1679f1-6e2e-4454-9ea3-003e3f13a7c1'
);
