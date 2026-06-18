---
name: Domain Assignment Strategy
description: Each store has its own TLD, not subdomain. CRM on crm.brandoors.su
type: feature
---

# Доменная стратегия Brandoors

Каждый магазин-партнёр имеет **собственный домен верхнего уровня** (не сабдомен). Все 5 доменов резолвятся на один SPA-бандл; роутинг по hostname через поле `sites.domain` в БД (`useSiteByDomain`).

## Карта доменов

| Домен              | Магазин          | Адрес                                                                  |
| ------------------ | ---------------- | ---------------------------------------------------------------------- |
| `brandoors.moscow` | Склад            | Москва, Щербинка, квартал 120, д.6                                     |
| `brandoors.online` | Каширский двор   | Каширское ш. 19к1, 4 этаж, пав. А40, ТК «Каширский двор»               |
| `brandoors.store`  | Roomer           | Ленинская слобода 26, Галерея А, подиум 116, ТЦ «ROOMER»               |
| `brandoors.pro`    | Декоратор        | Рязанский пр-т 2к3, павильон 231, ТЦ «Декоратор»                       |
| `brandoors.su`     | Метр квадратный  | Волгоградский пр-т 32, К25, ТЦ «Метр Квадратный»                       |

## CRM

CRM живёт на `crm.brandoors.su` (единственный сабдомен в системе). Корень `brandoors.su` теперь = storefront магазина «Метр квадратный», **а не редирект на CRM**. Поправить логику в `useSiteContext.tsx` / `useSiteSlug.ts`:
- `brandoors.su` больше не должен попадать в `MAIN_HOSTS` как «не-storefront»
- Все 5 доменов → storefront через `sites.domain` lookup
- Только `crm.brandoors.su` → CRM

## DNS на проде (Yandex Cloud VM)

Для каждого из 5 доменов:
- A `@` → IP VM
- A `www` → IP VM

Плюс:
- A `crm.brandoors.su` → IP VM
- A `api.brandoors.su` → IP VM (Supabase Kong gateway)

Wildcard `*.brandoors.su` больше **не нужен** (мы не используем сабдомены под магазины).

## Nginx

Один `server` блок с `server_name` перечисляющим все 5 доменов + `www.*` варианты → отдаёт `dist/index.html` и статику SPA. Отдельный server для `crm.brandoors.su`. Отдельный для `api.brandoors.su` → proxy_pass на Supabase Kong.

## SSL

Certbot выпускает сертификаты на каждый домен отдельно (5 сертификатов для storefront + 1 для crm + 1 для api). Wildcard не нужен → можно обычный HTTP-01 challenge, без DNS-01.

## База данных

В таблице `sites` поле `domain` для каждого магазина заполнено соответствующим TLD (без `https://`, без `www.`). Например:
```
UPDATE sites SET domain = 'brandoors.moscow' WHERE slug = 'sklad';
UPDATE sites SET domain = 'brandoors.online' WHERE slug = 'kashirsky';
-- и т.д.
```
