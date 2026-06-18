---
name: Production Supabase Self-Hosted Secrets
description: Generated secrets and JWT keys for prod VM Supabase stack at 51.250.55.193
type: reference
---

# Production VM (Yandex Cloud, 51.250.55.193)

SSH: `ssh brandoors@51.250.55.193`
Supabase docker dir: `~/brandoors-supabase` (cloned from supabase/supabase, docker/ subdir copied)

## Generated secrets (2026-06-18)

```
POSTGRES_PASSWORD=6aa90246362da2d715fe5ad87a5fd2fa218ae86f670bacd9
JWT_SECRET=0fb48b1d4bed42956c85f4a0c74920aa52914046a19abfcac1154f9b722259fc
DASHBOARD_PASSWORD=f222c2077e8327428a23b22a4f012d5e
SECRET_KEY_BASE=a96e2f4ab642ac0efb842e19bc5dbe1e2f9b33363dc334cbe9a4b1897b3afdca
VAULT_ENC_KEY=1f78def0825425ace09e88dd19501cfc
```

## JWT keys (signed with JWT_SECRET, HS256, iat=1750000000, exp=2065360000)

```
ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzUwMDAwMDAwLCJleHAiOjIwNjUzNjAwMDB9.gZS-CFKbTTQGz91hI3iGMU14ckdxE7q4uAyZw5zxo48

SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoic2VydmljZV9yb2xlIiwiaXNzIjoic3VwYWJhc2UiLCJpYXQiOjE3NTAwMDAwMDAsImV4cCI6MjA2NTM2MDAwMH0.FSpONyMDKGXwVlckC2Fuyaau1Il6X_pUumrYvj_d_H0
```

## Dashboard
- URL: http://51.250.55.193:8000 (после старта; потом проксируем через api.brandoors.su)
- User: `supabase`
- Password: `f222c2077e8327428a23b22a4f012d5e`

## API endpoint (production)
- `https://api.brandoors.su` → nginx → Kong (port 8000) → Supabase services
- Все запросы фронта в проде должны идти на `api.brandoors.su` с ANON_KEY выше.
