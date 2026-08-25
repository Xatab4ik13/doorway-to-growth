-- Подкатегория «Термо» внутри раздела «Входные двери»
INSERT INTO public.categories (id, name, slug, parent_id, sort_order)
VALUES (gen_random_uuid(), 'Термо', 'termo', '8720cb10-7262-416b-a2d9-8ccff8ecf4a1', 1)
ON CONFLICT (slug) DO NOTHING;
