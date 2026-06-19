## Проблема

Сейчас в БД у `product_images` три ключа: `variant_key` (цвет), `glazing_key` (стекло) и `molding_key` (наличник/молдинг). Колонки `edge_key` (кромка) нет вообще. При импорте с brandoors.ru значения кромки (AL Black, AL Gold, Хром, Ral & Ncs) были ошибочно записаны в `glazing_key` для коллекций ESTETICA 01–04/09/10 и HEAVY 01–04/09/10.

В UI же есть 4 отдельных селектора: Цвет, Остекление, Кромка, Молдинг. Кнопка «Кромка» (`selectedEdge`) живёт сама по себе — она не привязана к ключу изображения, поэтому фотография не меняется. То же самое с молдингом для HEAVY: молдинг в UI не привязан к изображению.

## Что сделаю

### 1. Схема БД: добавить `edge_key`

Миграция: `infra/migrations/20260619170000_product_images_edge_key.sql`

```sql
ALTER TABLE public.product_images ADD COLUMN IF NOT EXISTS edge_key TEXT;
CREATE INDEX IF NOT EXISTS idx_product_images_edge ON public.product_images(product_id, edge_key);
```

### 2. Перенос данных glazing_key → edge_key для глухих коллекций

Для ESTETICA 01/02/03/04/09/10 и HEAVY 01/02/03/04/09/10 (где `glazing_key ∈ {AL Black, AL Gold, Хром, Ral & Ncs}`):

```sql
UPDATE product_images
SET edge_key = glazing_key, glazing_key = NULL
WHERE glazing_key IN ('AL Black','AL Gold','Хром','Ral & Ncs')
  AND product_id IN (SELECT id FROM products WHERE name ~ '^(ESTETICA|HEAVY) (01|02|03|04|09|10)$');
```

GHOST Avers — починю отдельно: `AL Black/Gold/Хром` → `edge_key`, `Белый abc/Черный abc` остаются в `glazing_key`.

ESTETICA 07/08 и HEAVY 07/08 — `glazing_key` (Лакобель, Зеркало) реально стекло, не трогаем.

MAZE — стекло реальное, не трогаем.

### 3. Дозагрузка изображений кромок и молдингов с brandoors.ru

Через edge function `migrate-brandoors-images` (уже существует) дополнительно подтянуть варианты, которых не хватает: для HEAVY должен быть полный набор (цвет × кромка × молдинг), для ESTETICA — (цвет × кромка). Если на источнике для какой-то комбинации фото нет — используется fallback в коде (см. п.5).

### 4. Фронтенд: useStorefrontData

`src/hooks/useStorefrontData.ts` — добавить `edge_key` в select-список `product_images`.

### 5. Фронтенд: StorefrontProduct.tsx

- В типе/выборке изображений: учитывать новый `edge_key`.
- `imageEdges` (как `imageGlazings`) — реальные кромки из БД, источник для кнопок «Кромка».
- `findImage` расширить с осью `edge_key` (4-я ось), приоритет цвет → кромка → молдинг → стекло.
- `handleSelectEdge` — новый: ставит `selectedEdge`, ищет картинку, переключает `currentImage`.
- `handleSelectMolding` — реально привязать к `molding_key` для HEAVY.
- Матрицы совместимости расширить: `edgesByColor`, `colorsByEdge` и т.п., чтобы недоступные комбинации dimmed.
- Сводка «Ваша конфигурация» уже выводит кромку/молдинг — оставить как есть.

### 6. Каталог

`src/pages/StorefrontCatalog.tsx` — фильтр по цвету уже работает на `variant_key`, не ломаем. Если в будущем нужно фильтровать по кромке — добавим, сейчас не трогаю.

### 7. Sync на прод

После применения через Lovable Cloud — выдам пользователю команду `psql` для прод-VM (по правилу Option A).

## Технические заметки

- Все обновления делаются миграциями в `infra/migrations/`, mirror в Lovable Cloud через `supabase--migration`.
- GRANT-ы на `product_images` уже выставлены — новая колонка автоматически наследует.
- Типы `src/integrations/supabase/types.ts` обновятся автоматически после миграции.

## Открытый вопрос

Загружать ли недостающие комбинации фото с brandoors.ru прямо сейчас (это +N сетевых запросов и обработка) — или сначала включить логику и убедиться, что переключение работает на текущих данных, а догрузку фото сделать вторым шагом?
