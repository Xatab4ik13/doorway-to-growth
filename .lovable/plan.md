## Проблема

Сейчас в БД у каждой модели всего 7 фото — по одному на цвет. Привязки к стеклу нет, поэтому смена остекленения не меняет картинку.

Источник `core.brandoors.ru/graphql` отдаёт SKU с уникальным `image.path` для каждой комбинации (color × glass × edge). Но даже там матрица **неполная**: например, у ESTETICA 08 — 9 цветов × 2 стекла = 18 теоретических комбинаций, а реальных SKU всего 10. Значит «все комбинации» физически невозможны — нужно показывать только существующие.

## План

### 1. Скрапер из brandoors.ru → JSON (`/tmp/door_variants.json`)
Через GraphQL `product(id){sKUs{nodes{image{path} propertyValues}}}` для всех моделей коллекций `straight (ESTETICA)`, `prime`, `ghost`, `heavy`, `reflect`, `maze`, `metallicheskie-dveri`. Сохраняем массив вариантов: `{model_name, color, glass|null, edge|null, image_url}`.

### 2. Маппинг и заливка в Storage
- Скачать webp-файлы локально, ужать до 800px высоты (политика проекта), залить в bucket `product-images` под путём `{slug}/{color}__{glass}__{edge}.webp`.
- Сматчить модели по `name` (наши `ESTETICA 08` ↔ их `ESTETICA 08`).

### 3. Схема `product_images`
Расширяем `variant_key` структуру — сейчас там, видимо, только `color_key`. Добавляем:
- `color_key TEXT`
- `glazing_key TEXT NULL`
- `molding_key TEXT NULL` (уже есть)

Очищаем старые записи для дверных моделей, вставляем новые из скрапера. SQL дублируем в `infra/migrations/NNNN_door_variants_full.sql`.

### 4. Хук `useStorefrontData`
Возвращать для каждого товара полную сетку variants `Array<{color, glazing, molding, url}>`.

### 5. UI `StorefrontProduct.tsx`
- При выборе цвета: вычислять `availableGlazings = unique(variants.filter(v=>v.color===selectedColor).map(v=>v.glazing))`. Недоступные стёкла — `disabled` с tooltip «Недоступно для выбранного цвета».
- При клике на стекло: гарантированно существующий вариант — берём `variants.find(v=>v.color===c && v.glazing===g)` → ставим картинку.
- Аналогично симметрично при выборе сначала стекла (фильтр цветов).
- Убрать сложные fallback-ветки из `findImage` — они больше не нужны, т.к. UI не даёт выбрать несуществующую пару.

### 6. Проверка
Открыть Playwright на `/store/scherbinka/products/estetica-08`, кликнуть цвет → проверить, что список стёкол обновился; кликнуть стекло → картинка сменилась на правильный SKU. Скриншот.

## Открытые вопросы
- Если у модели в источнике нет вообще `glass` axis (например, ESTETICA 01) — оставляем шаг «Остекленение» скрытым, как сейчас.
- Для моделей, которых нет на brandoors.ru (если такие найдутся), оставляем текущие фото.

Готов запустить шаги 1–6 в этой же сессии.