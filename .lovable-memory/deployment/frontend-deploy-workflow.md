---
name: Frontend Deploy Workflow
description: Single command to rebuild SPA on prod VM and serve to all 5 store domains
type: feature
---

# Деплой фронта на прод-VM (один dist на все 5 доменов)

Фронт собирается **прямо на прод-VM** (`brandoors@brandoors-prod`, 51.250.55.193). Все 5 TLD (`brandoors.moscow/.online/.store/.pro/.su` + `crm.brandoors.su`) обслуживаются из одной папки `dist` — определение магазина идёт по hostname через `sites.domain`.

## Канонические пути

- Репозиторий: `/home/brandoors/doorway-to-growth` (git remote → Lovable/GitHub)
- Пакетник: **bun** (не npm; `bun install`, `bun run build`)
- Build output: `./dist`
- Nginx serve root: `/var/www/brandoors-su/dist/` (один для всех доменов)
- Node: v20.20.2, git: 2.43, bun установлен в `~/.bun`

## Одна команда для деплоя (выполнять на прод-VM)

```bash
cd ~/doorway-to-growth && \
  git pull && \
  bun install && \
  bun run build && \
  sudo rsync -av --delete dist/ /var/www/brandoors-su/dist/ && \
  sudo nginx -t && \
  sudo systemctl reload nginx
```

Если зависимости не менялись, можно опустить `bun install`:

```bash
cd ~/doorway-to-growth && git pull && bun run build && \
  sudo rsync -av --delete dist/ /var/www/brandoors-su/dist/ && \
  sudo systemctl reload nginx
```

## Чего НЕ делать

- Не использовать `npm ci` / `npm run build` — lockfile bun-овый, упадёт с EUSAGE.
- Не путать с `/var/www/brandoors/dist` — это старая/неиспользуемая папка (артефакт первой настройки `brandoors.moscow`). Реальный nginx root — `/var/www/brandoors-su/dist`.
- Не пытаться собирать на ноуте и слать `rsync` извне — git remote и `.env.production` уже на VM.
- На локальной машине пользователя репо нет.

## Проверка после деплоя

```bash
stat /var/www/brandoors-su/dist | grep Modify   # время должно стать «сейчас»
curl -sI https://brandoors.su | head -1          # 200 OK
```

Hard-refresh в браузере (Ctrl+Shift+R) для каждого домена, чтобы сбросить кэш SPA.
