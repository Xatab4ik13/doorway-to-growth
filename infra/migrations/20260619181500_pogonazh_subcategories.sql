-- Pogonazh subcategories + reassignment of imported pogonazh products.
-- Applied on Lovable Cloud (staging) on 2026-06-19. Run on prod VM with:
--   psql "$DATABASE_URL" -f infra/migrations/20260619181500_pogonazh_subcategories.sql

BEGIN;

INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
  ('b0000003-0000-0000-0000-000000000001', 'Наличники',          'nalichniki',         'a0000001-0000-0000-0000-000000000003', 1),
  ('b0000003-0000-0000-0000-000000000002', 'Плинтус',            'plintus',            'a0000001-0000-0000-0000-000000000003', 2),
  ('b0000003-0000-0000-0000-000000000003', 'Короб',              'korob',              'a0000001-0000-0000-0000-000000000003', 3),
  ('b0000003-0000-0000-0000-000000000004', 'Добор',              'dobor',              'a0000001-0000-0000-0000-000000000003', 4),
  ('b0000003-0000-0000-0000-000000000005', 'Притворная планка', 'pritvornaya-planka', 'a0000001-0000-0000-0000-000000000003', 5)
ON CONFLICT (slug) DO NOTHING;

UPDATE public.products SET category_id = 'b0000003-0000-0000-0000-000000000001' WHERE specifications->>'subcategory' = 'nalichniki';
UPDATE public.products SET category_id = 'b0000003-0000-0000-0000-000000000002' WHERE specifications->>'subcategory' = 'plintus';
UPDATE public.products SET category_id = 'b0000003-0000-0000-0000-000000000003' WHERE specifications->>'subcategory' = 'korob';
UPDATE public.products SET category_id = 'b0000003-0000-0000-0000-000000000004' WHERE specifications->>'subcategory' = 'dobor';
UPDATE public.products SET category_id = 'b0000003-0000-0000-0000-000000000005' WHERE specifications->>'subcategory' = 'pritvornaya-planka';

COMMIT;
