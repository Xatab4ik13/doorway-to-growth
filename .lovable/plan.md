## Цель

Привести фото и конфигурации дверей в соответствие с эталоном `brandoors.ru`. Начинаем с коллекции **HEAVY**, дальше по одной коллекции за раз. Старые фото не удаляем, а помечаем флагом `is_stale`. Промежуточный экран аудита делаем в CRM.

## Этапы

### Этап 1 — Инфраструктура (одна миграция)

1. `product_images.is_stale BOOLEAN DEFAULT false` — старые фото пометим.
2. Новая таблица `product_variants_staging`:
   - `product_name`, `sku_source_id`, `image_source_url`, `image_source_path`
   - `color_name`, `edge_name`, `glazing_name`, `molding_name`
   - `status` (`new` / `matched` / `imported` / `skipped` / `error`)
   - `matched_image_id UUID NULL` (если совпало со старой фоткой)
   - `notes TEXT`
   - `imported_at TIMESTAMPTZ NULL`
3. GRANT-ы + RLS: read для authenticated, all для service_role.
4. Индексы по `(product_name, status)`.

### Этап 2 — Edge function `audit-brandoors-variants`

Отдельная от `sync-brandoors-skus`. Только читает GraphQL и пишет в `product_variants_staging`. Ничего не заливает в Storage, не трогает `product_images`.

Параметры:
- `?name=HEAVY` — какую коллекцию аудитим (обязательно, чтобы не поплыть)
- `?reset=1` — очистить прошлые записи staging для этих товаров

Логика:
- Тянет все SKU для товаров, чьё имя `ILIKE 'HEAVY%'`.
- Для каждого SKU: пишет строку в staging с осями и source URL.
- Сверяет с текущими `product_images` того же продукта: если найдено фото с таким же source URL → `status='matched'`, ставим `matched_image_id`. Иначе `status='new'`.
- Для существующих `product_images` без совпадений в источнике — отдельный SELECT в CRM (см. этап 3) покажет их как «orphan».

### Этап 3 — CRM: страница «Аудит вариантов»

Новый пункт сайдбара в CRM (только Admin): `/crm` → «Аудит вариантов».

Компонент показывает:
- Селектор коллекции (HEAVY / ESTETICA / …), кнопка «Запустить аудит» → вызывает edge function.
- Сводка по товару: сколько SKU в источнике, сколько уже совпало (`matched`), сколько новых (`new`), сколько orphan-фото в нашей БД.
- Таблица SKU с колонками: превью источника, цвет, кромка, стекло, молдинг, статус.
- Отдельная секция «Orphan-фото» — наши `product_images`, для которых нет соответствующего SKU на источнике. Можно нажать «Пометить как устаревшие» → `is_stale=true`.
- Кнопка «Импортировать выбранные» (пока только UI, действие в этапе 4).

Ничего не удаляем на этом шаге. Все изменения — только пометки.

### Этап 4 — Импорт (после ручной валидации)

Отдельная кнопка «Импортировать выбранные SKU» в CRM вызывает edge function `import-brandoors-variants` (расширение существующей `sync-brandoors-skus`), которая берёт только строки из staging со `status='new'` и выбранным `product_name`, качает картинки в Storage, вставляет в `product_images` с правильными `variant_key/edge_key/glazing_key/molding_key`, ставит `status='imported'`, `imported_at=now()`.

Ключевое отличие от текущего `sync-brandoors-skus`: не грузим всё подряд, а только то, что человек в CRM одобрил.

### Этап 5 — Whitelist опций в конфигураторе

После импорта HEAVY: обновляем `products.specifications` каждого товара, добавляя:
- `allowed_colors: []`
- `allowed_edges: []`
- `allowed_glazings: []`
- `allowed_moldings: []`

значения берём из `DISTINCT` по `product_images` этого товара. Storefront-конфигуратор (`StorefrontProduct.tsx`) в следующем шаге будет показывать только то, что в whitelist. Это отдельный шаг, делаем после того как HEAVY будет полностью зачищен.

### Этап 6 — Прод

После каждого этапа, зеркалирую SQL в `infra/migrations/` и даю команду `psql` для прод-VM.

## Что делаю прямо сейчас

Только **Этап 1 + Этап 2 + Этап 3** для коллекции HEAVY. Никакого автоматического импорта и никаких изменений в текущих `product_images` без явного клика в CRM.

## Технические детали

```text
audit run flow (HEAVY):
  edge fn ──► GraphQL brandoors.ru
          ──► INSERT product_variants_staging (status=new|matched)
  CRM UI ──► SELECT staging WHERE product_name ILIKE 'HEAVY%'
          ──► показывает таблицу + orphan-photos
  user   ──► «Пометить orphan как stale» / «Импортировать выбранные»
```

Никакой автомагии — каждый шаг требует явного клика.

## Открытых вопросов нет

Погнали?