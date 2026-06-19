-- Furnitura subcategories + reassignment of imported products.
-- Applied on Lovable Cloud (staging) on 2026-06-19. Run on prod VM with:
--   psql "$DATABASE_URL" -f infra/migrations/20260619182000_furnitura_subcategories.sql
-- Requires that the 13 source categoryIds (20..32) on core.brandoors.ru match
-- the slugs/uuids declared below.

BEGIN;

INSERT INTO public.categories (id, name, slug, parent_id, sort_order) VALUES
  ('b0000004-0000-0000-0000-000000000020', 'Система открывания Invisible',           'sistema-otkryvaniya-invisible',           'a0000001-0000-0000-0000-000000000004', 1),
  ('b0000004-0000-0000-0000-000000000021', 'Системы открывания Compack',             'sistemy-otkryvaniya-compack',             'a0000001-0000-0000-0000-000000000004', 2),
  ('b0000004-0000-0000-0000-000000000022', 'Системы открывания Magic',               'sistemy-otkryvaniya-magic',               'a0000001-0000-0000-0000-000000000004', 3),
  ('b0000004-0000-0000-0000-000000000023', 'Системы открывания Пенал',               'sistemy-otkryvaniya-penal',               'a0000001-0000-0000-0000-000000000004', 4),
  ('b0000004-0000-0000-0000-000000000024', 'Системы открывания Купе',                'sistemy-otkryvaniya-kupe',                'a0000001-0000-0000-0000-000000000004', 5),
  ('b0000004-0000-0000-0000-000000000025', 'Защёлки — без ручек в комплекте',        'zashelki-bez-ruchek-v-komplekte',         'a0000001-0000-0000-0000-000000000004', 6),
  ('b0000004-0000-0000-0000-000000000026', 'Петли — накладные (карточные)',          'petli-nakladnye-kartonnye',               'a0000001-0000-0000-0000-000000000004', 7),
  ('b0000004-0000-0000-0000-000000000027', 'Петли — скрытой установки',              'petli-skrytoj-ustanovki',                 'a0000001-0000-0000-0000-000000000004', 8),
  ('b0000004-0000-0000-0000-000000000028', 'Ручки дверные — На планке',              'ruchki-dvernye-na-planke',                'a0000001-0000-0000-0000-000000000004', 9),
  ('b0000004-0000-0000-0000-000000000029', 'Ручки дверные — На раздельном основании','ruchki-dvernye-na-razdelnom-osnovanii',  'a0000001-0000-0000-0000-000000000004',10),
  ('b0000004-0000-0000-0000-000000000030', 'Ручки дверные — Скобы',                  'ruchki-dvernye-skoby',                    'a0000001-0000-0000-0000-000000000004',11),
  ('b0000004-0000-0000-0000-000000000031', 'Ручки дверные — Для раздвижных дверей',  'ruchki-dvernye-dlya-razdvizhnyh-dverej',  'a0000001-0000-0000-0000-000000000004',12),
  ('b0000004-0000-0000-0000-000000000032', 'Ручки дверные — Кнопки',                 'ruchki-dvernye-ruchki-knopki',            'a0000001-0000-0000-0000-000000000004',13)
ON CONFLICT (slug) DO NOTHING;

-- NOTE: this prefix-matching is best-effort. On prod re-run sync-brandoors-furnitura
-- (or equivalent) so source_id is reliable. The eight legacy "* Без цвета" rows are
-- patched explicitly below.
CREATE TEMP TABLE _furnitura_map (src_cat_id INT, src_name TEXT) ON COMMIT DROP;
-- Fill _furnitura_map from a fresh GraphQL dump, then run the same UPDATE used on staging.

-- Explicit patches for legacy aggregate rows:
UPDATE public.products SET category_id = 'b0000004-0000-0000-0000-000000000020' WHERE category_id='a0000001-0000-0000-0000-000000000004' AND name ILIKE 'Invisible%';
UPDATE public.products SET category_id = 'b0000004-0000-0000-0000-000000000021' WHERE category_id='a0000001-0000-0000-0000-000000000004' AND name ILIKE 'Compack%';
UPDATE public.products SET category_id = 'b0000004-0000-0000-0000-000000000024' WHERE category_id='a0000001-0000-0000-0000-000000000004' AND name ILIKE 'Куп%';

COMMIT;
