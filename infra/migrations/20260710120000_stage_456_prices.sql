-- Stage 4-6: prices from BRANDOORS pricelist
-- Fittings + Погонаж + Системы открывания
-- Total updates: 206

BEGIN;

-- Короб | Коробочный брус 38/75/2100 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [Maze NEW Эмаль] Коробочный брус телескоп 36/75/2100 мм. Комплект 2,5 шт.
UPDATE products SET rrp = 5248, updated_at = now() WHERE id = '394872ee-5dda-4cb1-8aee-d964613fcded';

-- Короб | Коробочный брус под покраску 38/75/2500 мм. телескоп с упл. Комплект 2
-- src: [Maze NEW Эмаль] Коробочный брус телескоп 36/75/2400 мм. Комплект 2,5 шт.
UPDATE products SET rrp = 6298, updated_at = now() WHERE id = 'a6b65a38-f67b-4f4c-b89b-6b1785824560';

-- Короб | Коробочный брус 38/75/2800 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [Maze NEW Эмаль] Коробочный брус телескоп 36/75/2750 мм. Комплект 2,5 шт.
UPDATE products SET rrp = 7872, updated_at = now() WHERE id = 'd2bf293f-d2b6-4991-91cb-bd4c7bb05941';

-- Короб | Коробочный брус 38/75/2200 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [Maze NEW Эмаль] Коробочный брус телескоп 36/75/3000 мм. Комплект 2,5 шт.
UPDATE products SET rrp = 10497, updated_at = now() WHERE id = '3b3c7dba-91a8-46d6-8363-3f40c0c4b30d';

-- Наличники | Наличник телескопический прямой под покраску 10/70/2750 мм
-- src: [Maze NEW Эмаль] Наличник телескопический прямой  10/80/2200 мм.
UPDATE products SET rrp = 1745, updated_at = now() WHERE id = '919b6ba8-87dc-4354-b470-e1dc410a72e4';

-- Наличники | Наличник телескопический прямой 16/80/2500 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический прямой  10/80/2500 мм.
UPDATE products SET rrp = 2094, updated_at = now() WHERE id = '50f1f66f-debe-42fc-a04f-4343ebd98a9a';

-- Наличники | Наличник телескопический прямой 16/80/2750 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический прямой  10/80/2750 мм.
UPDATE products SET rrp = 2618, updated_at = now() WHERE id = 'ddf4ce2d-d536-4fe8-ab98-ed244b743600';

-- Наличники | Наличник телескопический прямой 16/80/2150 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический прямой  10/80/3000 мм.
UPDATE products SET rrp = 3491, updated_at = now() WHERE id = '87598087-d70f-49c0-ad37-9de261ec2d22';

-- Наличники | Наличник телескопический прямой   10/ 100/ 2150 мм
-- src: [Maze NEW Эмаль] Наличник телескопический прямой  10/ 100/ 2200 мм. Аляска,Ми
UPDATE products SET rrp = 1975, updated_at = now() WHERE id = '0ba523e9-f684-49ac-bafd-90c1978e9a05';

-- Наличники | Наличник телескопический прямой   10/ 100 / 2500 мм
-- src: [Maze NEW Эмаль] Наличник телескопический прямой  10/ 100 / 2500 мм.
UPDATE products SET rrp = 2370, updated_at = now() WHERE id = '345e6292-57bc-41dd-be2d-3e52d1788ede';

-- Наличники | Наличник телескопический прямой   10/ 100 / 2750 мм
-- src: [Maze NEW Эмаль] Наличник телескопический прямой  10/ 100 / 2750 мм.
UPDATE products SET rrp = 2962, updated_at = now() WHERE id = 'dbc20fde-438d-4109-981f-abdbd7f1abc0';

-- Наличники | Наличник телескопический  10/100/2750 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический прямой  10/ 100 / 3000 мм.
UPDATE products SET rrp = 3949, updated_at = now() WHERE id = 'eb7c1ea7-a715-4313-8a80-19075598048f';

-- Наличники | Наличник телескопический прямой под покраску 16/80/2750 мм
-- src: [Maze NEW Эмаль] Наличник телескопический  прямой 16/80/2200 мм.
UPDATE products SET rrp = 1975, updated_at = now() WHERE id = '926c2cf2-b5a9-4c87-b3b1-4b68a30c8d74';

-- Наличники | Наличник телескопический прямой под покраску 16/80/2500 мм
-- src: [Maze NEW Эмаль] Наличник телескопический  прямой 16/80/2500 мм.
UPDATE products SET rrp = 2370, updated_at = now() WHERE id = '3bfc42bc-680b-40e0-8c55-86b969919ccb';

-- Наличники | Наличник телескопический  16/80/2750 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический прямой 16/80/2750 мм.
UPDATE products SET rrp = 2962, updated_at = now() WHERE id = 'ba56ee08-e758-4428-a336-3ef24dedbfc2';

-- Наличники | Наличник телескопический прямой под покраску 16/80/2150 мм
-- src: [Maze NEW Эмаль] Наличник телескопический прямой 16/80/3000 мм.
UPDATE products SET rrp = 3949, updated_at = now() WHERE id = 'da1cd24c-9d5a-4a73-80e8-8e10117caad7';

-- Наличники | Наличник телескопический  фигурный 16/80/2500 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический  фигурный  16/90/2200 мм.
UPDATE products SET rrp = 2835, updated_at = now() WHERE id = '552754f5-6123-4dd5-96af-d1116559c7aa';

-- Наличники | Наличник телескопический 16/80/2500 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический  фигурный  16/90/2500 мм.
UPDATE products SET rrp = 3402, updated_at = now() WHERE id = '3866eb07-9ec1-4d07-ba6e-88c427a3bc14';

-- Наличники | Наличник телескопический  фигурный 16/80/2750 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический  фигурный  16/90/2750 мм.
UPDATE products SET rrp = 4252, updated_at = now() WHERE id = 'b57cd7b8-429a-4d9f-b8d2-0cfccddf0e94';

-- Наличники | Наличник телескопический  10/100/2500 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический  Ступенчатый  16/100/2200 мм.
UPDATE products SET rrp = 2835, updated_at = now() WHERE id = '82316629-a442-4d3a-b7b2-8ecf55998e18';

-- Наличники | Наличник телескопический ступенчатый 16/80/2500 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический  Ступенчатый 16/100/2500 мм.
UPDATE products SET rrp = 3402, updated_at = now() WHERE id = '187c7faa-bdab-4038-8186-8e4d6a1b1747';

-- Наличники | Наличник телескопический ступенчатый 16/80/2750 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический  Ступенчатый 16/100/2750 мм.
UPDATE products SET rrp = 4252, updated_at = now() WHERE id = '0d957784-7cb3-451d-83be-d9c94ea085a1';

-- Наличники | Наличник телескопический  10/100/2150 мм.
-- src: [Maze NEW Эмаль] Наличник телескопический  Ступенчатый 16/100/3000 мм.
UPDATE products SET rrp = 5670, updated_at = now() WHERE id = '53f5b30e-e604-4c12-9eae-91a7ad9c7ea8';

-- Добор | Добор телескопический/прямой 10/100/2070 мм.
-- src: [Maze NEW Эмаль] Добор телескопический 10/100/2070 мм.
UPDATE products SET rrp = 1841, updated_at = now() WHERE id = '091bf3d3-463b-4d37-bc70-35cb369bb540';

-- Добор | Добор телескопический /прямой 10/100/2500 мм.
-- src: [Maze NEW Эмаль] Добор телескопический  10/100/2400 мм.
UPDATE products SET rrp = 2210, updated_at = now() WHERE id = 'b61f60cb-3f9a-40b7-a81a-cf6fa272008b';

-- Добор | Добор телескопический 10/100/2800 мм.
-- src: [Maze NEW Эмаль] Добор телескопический 10/100/2800 мм.
UPDATE products SET rrp = 2762, updated_at = now() WHERE id = '5e6087ca-2263-4971-a8f1-dc7b3cd821ef';

-- Добор | Добор телескопический 10/150/2070 мм.
-- src: [Maze NEW Эмаль] Добор телескопический 10/150/2070 мм.
UPDATE products SET rrp = 2302, updated_at = now() WHERE id = 'b9293eda-f451-4639-aab4-2e4194fc7b13';

-- Добор | Добор телескопический/прямой 10/150/2500 мм.
-- src: [Maze NEW Эмаль] Добор телескопический 10/150/2400 мм.
UPDATE products SET rrp = 2762, updated_at = now() WHERE id = 'a50763f2-e251-406b-a8ad-b101faacc51c';

-- Добор | Добор телескопический / прямой 10/150/2800 мм
-- src: [Maze NEW Эмаль] Добор телескопический 10/150/2800 мм.
UPDATE products SET rrp = 3453, updated_at = now() WHERE id = '6c21d510-6a09-4119-8fdb-0fbd7be53fb1';

-- Добор | Добор телескопический/прямой 10/200/2070 мм.
-- src: [Maze NEW Эмаль] Добор телескопический 10/200/2070 мм.
UPDATE products SET rrp = 2728, updated_at = now() WHERE id = '40506474-d86e-4059-bd9a-b579672be3ba';

-- Добор | Добор телескопический/прямой 10/200/2500 мм.
-- src: [Maze NEW Эмаль] Добор телескопический 10/200/2400 мм.
UPDATE products SET rrp = 3274, updated_at = now() WHERE id = '04557596-21f5-4dc3-a87f-ff65f8c66adf';

-- Добор | Добор телескопический / прямой 10/200/2800 мм
-- src: [Maze NEW Эмаль] Добор телескопический 10/200/2800 мм.
UPDATE products SET rrp = 4092, updated_at = now() WHERE id = '44e9c475-2ea5-4585-a392-49bd5dc8de21';

-- Притворная планка | Притворная планка 10/38/2070
-- src: [Maze NEW Эмаль] Притворная планка 10/30/2070 мм.
UPDATE products SET rrp = 1674, updated_at = now() WHERE id = '0e4a0106-b768-476b-9134-efc8e2a596ca';

-- Плинтус | Плинтус 16/80/2070 мм
-- src: [Maze NEW Эмаль] Плинтус 16/80/2070 мм.
UPDATE products SET rrp = 1674, updated_at = now() WHERE id = '14f57980-ae2a-48a5-b86c-4828aa4cce44';

-- Плинтус | Плинтус   16/80/2070 мм.
-- src: [Maze NEW Эмаль] Плинтус 10/80/2070 мм.
UPDATE products SET rrp = 1311, updated_at = now() WHERE id = '3c58f104-2f62-433e-9740-81a4c1402f12';

-- Короб | Коробочный брус под покраску 38/75/2100 мм. телескоп с упл. Комплект 2
-- src: [Maze NEW Эмаль] EST Короб компланарный  38 мм 36*80*2100 комплект 2.5
UPDATE products SET rrp = 7097, updated_at = now() WHERE id = 'c886fd8e-ef19-475f-9a58-e313fb19fdd8';

-- Наличники | Наличник телескопический  16/80/2750 мм. (к моноблоку)
-- src: [Maze NEW Эмаль] EST Короб компланарный  38 мм 36*80*2750 комплект 2.5
UPDATE products SET rrp = 10646, updated_at = now() WHERE id = '45aa94cd-8375-402c-9ebb-49e5a92dfc26';

-- Короб | Скрытый Алюминиевый Короб Invisible 40/80/2200 c упл. На основании из 
-- src: [Maze NEW Эмаль] EST Наличник компланарный 10*80*2200
UPDATE products SET rrp = 1674, updated_at = now() WHERE id = '3cd7f353-8f86-4259-9722-dc2a7cdaac91';

-- Наличники | Наличник телескопический  10/70/2500 мм
-- src: [Maze NEW Эмаль] EST Наличник компланарный 10*80*2500
UPDATE products SET rrp = 2009, updated_at = now() WHERE id = 'bb609e0e-8119-4a7e-9f75-005cd5d4f001';

-- Наличники | Наличник телескопический  10/70/2750 мм
-- src: [Maze NEW Эмаль] EST Наличник компланарный 10*80*2750
UPDATE products SET rrp = 2511, updated_at = now() WHERE id = '070fdf80-b898-49eb-8740-71a168ab8a10';

-- Короб | Коробочный брус под покраску 38/75/2100 мм. телескоп с упл. (без врезк
-- src: [PR | PRIME Царга ] Коробочный брус телескоп PRB 36/75/2100 мм. Аляска,Милк,Манх
UPDATE products SET rrp = 1259, updated_at = now() WHERE id = 'd9bcb045-c03d-4a54-9b83-83eeff320d41';

-- Короб | Коробочный брус 38/75/2100 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [PR | PRIME Царга ] Коробочный брус телескоп PRB 36/75/2100 мм. Антрацит, Силк Г
UPDATE products SET rrp = 1384, updated_at = now() WHERE id = '5d06e6a4-4a92-47f7-8c2c-3bcb66f3cf3d';

-- Короб | Коробочный брус 38/75/2100 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [PR | PRIME Царга ] Коробочный брус телескоп PRB 36/75/2100 мм.
UPDATE products SET rrp = 1259, updated_at = now() WHERE id = '7e533335-946f-4b68-8df3-86b4b1074ac5';

-- Короб | Коробочный брус под покраску 38/75/2500 мм. телескоп с упл. (без врезк
-- src: [PR | PRIME Царга ] Коробочный брус телескоп PRB 36/75/2400 мм.
UPDATE products SET rrp = 1510, updated_at = now() WHERE id = '8d67ba95-e403-4bdd-84c3-fbfe10babd95';

-- Короб | Коробочный брус 26/75/2070 мм. НЕ телескоп с упл.
-- src: [PR | PRIME Царга ] Коробочный брус телескоп PRB 36/75/2750 мм.
UPDATE products SET rrp = 1888, updated_at = now() WHERE id = 'bdee4e8f-61d6-45c4-915c-07c7e02a2663';

-- Короб | Коробочный брус под покраску 38/75/2200 мм. телескоп с упл. (без врезк
-- src: [PR | PRIME Царга ] Коробочный брус телескоп PRB 36/75/3000 мм.
UPDATE products SET rrp = 2517, updated_at = now() WHERE id = '25a34a0c-aa2e-4b24-8732-309b15fff8a1';

-- Наличники | Наличник телескопический прямой 10/ 70/ 2150 мм
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/80/2200 мм. Аляска,Ми
UPDATE products SET rrp = 949, updated_at = now() WHERE id = '43605d64-4e7a-4a66-ab68-1c4bbe9999c3';

-- Наличники | Наличник телескопический прямой под покраску 10/70/2500 мм
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/80/2200 мм. Антрацит,
UPDATE products SET rrp = 1043, updated_at = now() WHERE id = 'f46224c7-4f0b-49eb-b176-b6b8ec2865f1';

-- Наличники | Наличник телескопический прямой под покраску 10/70/2150 мм
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/80/2200 мм.
UPDATE products SET rrp = 949, updated_at = now() WHERE id = '7d28b418-0bdf-469f-8e54-8d7402257ff9';

-- Наличники | Наличник телескопический  10/70/2500 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический прямойPRB 10/80/2500 мм.
UPDATE products SET rrp = 1138, updated_at = now() WHERE id = '968ee632-f9fe-4dd0-bc54-2eec397a5393';

-- Наличники | Наличник телескопический прямой 10/ 70/ 2750 мм
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/80/2750 мм.
UPDATE products SET rrp = 1423, updated_at = now() WHERE id = 'bab19166-e6fe-4d69-b8aa-29aa41b79ef9';

-- Наличники | Наличник телескопический прямой 10/ 70/ 2500 мм
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/80/3000 мм.
UPDATE products SET rrp = 1897, updated_at = now() WHERE id = 'e413b3be-f0ec-420c-81df-7908d3758275';

-- Наличники | Наличник телескопический  10/100/2150 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/ 100/ 2200 мм. Аляска
UPDATE products SET rrp = 1082, updated_at = now() WHERE id = 'f3267dfe-b55e-4fe8-8a23-d4e0ec82bd1f';

-- Добор | Добор телескопический / прямой 10/100/2800 мм
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/ 100/ 2200 мм. Антрац
UPDATE products SET rrp = 1190, updated_at = now() WHERE id = '80f90ec6-48b5-45b8-90c4-538cf6c1bf82';

-- Добор | Добор телескопический/прямой 10/100/2500 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/ 100 / 2200 мм.
UPDATE products SET rrp = 1082, updated_at = now() WHERE id = '321a7f9d-a11e-45eb-b776-d9b360cadf8c';

-- Добор | Добор телескопический / прямой 10/100/2500 мм
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/ 100 / 2500 мм.
UPDATE products SET rrp = 1298, updated_at = now() WHERE id = '833cb3df-ffc3-448f-b775-ee92820a3047';

-- Наличники | Наличник телескопический  10/70/2750 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/ 100 / 2750 мм.
UPDATE products SET rrp = 1623, updated_at = now() WHERE id = '8ac5cdf2-af07-4d78-bb97-23d6ecb1cc81';

-- Добор | Добор телескопический/прямой 10/100/2800 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический прямой PRB 10/ 100 / 3000 мм.
UPDATE products SET rrp = 2164, updated_at = now() WHERE id = 'edf4c013-d143-48df-92b2-2cc1b184bc33';

-- Наличники | Наличник телескопический  16/80/2500 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический PRB прямой 16/80/2200 мм. Аляска,Ми
UPDATE products SET rrp = 1059, updated_at = now() WHERE id = 'b60bde14-382a-439d-b4be-ec4ad009ede1';

-- Наличники | Наличник телескопический  16/80/2500 мм. (к моноблоку)
-- src: [PR | PRIME Царга ] Наличник телескопический PRB прямой 16/80/2200 мм. Антрацит,
UPDATE products SET rrp = 1165, updated_at = now() WHERE id = '4f0c4a7c-56da-4f1b-b4c9-a4285b6bf60f';

-- Наличники | Наличник телескопический  16/80/2150 мм. (к моноблоку)
-- src: [PR | PRIME Царга ] Наличник телескопический PRB прямой 16/80/2200 мм.
UPDATE products SET rrp = 1059, updated_at = now() WHERE id = '4ce5f6e2-7971-43d0-8ec2-9f3d48a0b9c2';

-- Наличники | Наличник телескопический 16/80/2150 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический PRB прямой 16/80/2500 мм.
UPDATE products SET rrp = 1270, updated_at = now() WHERE id = '4c9a68eb-c57b-4e85-b5c9-3d95da69f05d';

-- Наличники | Наличник телескопический ступенчатый 16/80/2150 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический PRB прямой 16/80/2750 мм.
UPDATE products SET rrp = 1588, updated_at = now() WHERE id = '7e5f46de-1f46-4346-810f-f92839668094';

-- Наличники | Наличник телескопический  16/80/2150 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический PRB прямой 16/80/3000 мм.
UPDATE products SET rrp = 2117, updated_at = now() WHERE id = 'd2635745-0ca9-411c-b8fd-e572ce090961';

-- Наличники | Наличник телескопический  6/70/2500 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический  фигурный  16/90/2500 мм.
UPDATE products SET rrp = 2085, updated_at = now() WHERE id = 'fe664a76-1139-4fd8-a0ff-93882488b5cb';

-- Наличники | Наличник телескопический  10/70/2750 мм.
-- src: [PR | PRIME Царга ] Наличник телескопический  фигурный  16/90/2750 мм.
UPDATE products SET rrp = 2606, updated_at = now() WHERE id = '9da5958f-bb37-4ea9-ada6-e815d31936cf';

-- Добор | Добор телескопический / прямой 10/100/2070 мм
-- src: [PR | PRIME Царга ] Добор телескопический 10/100/2070 мм. Аляска,Манхеттен,Магно
UPDATE products SET rrp = 1008, updated_at = now() WHERE id = '421c891b-59a1-4e1e-9cda-4cd3f89c10ea';

-- Добор | Добор телескопический /прямой 10/100/2070 мм.
-- src: [PR | PRIME Царга ] Добор телескопический 10/100/2070 мм. Антрацит, Силк Грей.
UPDATE products SET rrp = 1108, updated_at = now() WHERE id = '925625bc-82d5-4b24-9a76-879d449766a3';

-- Добор | Добор телескопический 10/100/2070 мм.
-- src: [PR | PRIME Царга ] Добор телескопический  10/100/2070 мм.
UPDATE products SET rrp = 1008, updated_at = now() WHERE id = 'ebf37e95-44fd-440d-8084-b2849440d4ac';

-- Добор | Добор телескопический 10/100/2500 мм.
-- src: [PR | PRIME Царга ] Добор телескопический  10/100/2400 мм.
UPDATE products SET rrp = 1209, updated_at = now() WHERE id = '7fe42ac6-41cc-40bf-b2f0-17f787314d23';

-- Добор | Добор телескопический/прямой 10/100/2800.
-- src: [PR | PRIME Царга ] Добор телескопический 10/100/2800 мм.
UPDATE products SET rrp = 1511, updated_at = now() WHERE id = 'f2f27c34-a7c0-40a0-a4ee-e0fe9e2bae13';

-- Добор | Добор телескопический / прямой 10/150/2070 мм
-- src: [PR | PRIME Царга ] Добор телескопический 10/150/2070 мм.Аляска,Манхеттен,Магнол
UPDATE products SET rrp = 1259, updated_at = now() WHERE id = '41a30e52-a426-4655-a259-53689e66d71b';

-- Добор | Добор телескопический/прямой 10/150/2070 мм.
-- src: [PR | PRIME Царга ] Добор телескопический 10/150/2070 мм. Антрацит, Силк Грей.
UPDATE products SET rrp = 1384, updated_at = now() WHERE id = 'e0bcfbee-4703-4479-960b-4accb2adeebb';

-- Добор | Добор прямой 10/150/2070 мм.
-- src: [PR | PRIME Царга ] Добор телескопический 10/150/2070 мм.
UPDATE products SET rrp = 1259, updated_at = now() WHERE id = '16aaf0b8-9ff5-47b6-b0fd-dfcb116832b9';

-- Добор | Добор телескопический / прямой 10/150/2500 мм
-- src: [PR | PRIME Царга ] Добор телескопический 10/150/2400 мм.
UPDATE products SET rrp = 1510, updated_at = now() WHERE id = '5e35371f-73cc-4676-ab51-ef185209fe6c';

-- Добор | Добор телескопический/прямой 10/150/2800 мм.
-- src: [PR | PRIME Царга ] Добор телескопический 10/150/2800 мм.
UPDATE products SET rrp = 1888, updated_at = now() WHERE id = 'e82e25be-e628-4957-8c2e-c313c15409cf';

-- Добор | Добор телескопический / прямой 10/200/2070 мм
-- src: [PR | PRIME Царга ] Добор телескопический 10/200/2070 мм. Аляска,Манхеттен,Магно
UPDATE products SET rrp = 1511, updated_at = now() WHERE id = '03841681-c65f-4a96-8acd-54a20eb93ef5';

-- Добор | Добор телескопический 10/200/2070 мм.
-- src: [PR | PRIME Царга ] Добор телескопический 10/200/2070 мм. Антрацит, Силк Грей.
UPDATE products SET rrp = 1662, updated_at = now() WHERE id = '74cc3c40-7178-489f-8c9e-78f3a352e46a';

-- Добор | Добор прямой 10/200/2070 мм.
-- src: [PR | PRIME Царга ] Добор телескопический 10/200/2070 мм.
UPDATE products SET rrp = 1511, updated_at = now() WHERE id = '57e46302-0100-4289-a72e-aefd8011e456';

-- Добор | Добор телескопический / прямой 10/200/2500 мм
-- src: [PR | PRIME Царга ] Добор телескопический 10/200/2400 мм.
UPDATE products SET rrp = 1814, updated_at = now() WHERE id = 'e5bb7e0d-72f6-4859-90b3-f9659df93d67';

-- Добор | Добор телескопический 10/200/2800мм.
-- src: [PR | PRIME Царга ] Добор телескопический 10/200/2800 мм.
UPDATE products SET rrp = 2267, updated_at = now() WHERE id = '33aecfbf-ea10-428e-8021-08a4e3047a4e';

-- Притворная планка | Притворная планка 10/38/2070.
-- src: [PR | PRIME Царга ] Притворная планка 10/30/2070 мм.
UPDATE products SET rrp = 856, updated_at = now() WHERE id = 'be6d5e22-78a2-4321-bfe2-c63d499118ef';

-- Плинтус | Плинтус 16/80/2070 мм.
-- src: [PR | PRIME Царга ] Плинтус 16/80/2070 мм. Аляска,Милк,Манхеттен,Магнолия.
UPDATE products SET rrp = 1107, updated_at = now() WHERE id = '526c63af-6acf-45be-9496-f068bca981f7';

-- Плинтус | Плинтус  16х80х2070 мм.
-- src: [PR | PRIME Царга ] Плинтус 16/80/2070 мм. Антрацит, Силк Грей.
UPDATE products SET rrp = 1217, updated_at = now() WHERE id = 'fdd4f049-8445-466a-93b3-2af7605fa770';

-- Плинтус | Плинтус 16/80/2070 мм. New
-- src: [PR | PRIME Царга ] Плинтус 16/80/2070 мм.
UPDATE products SET rrp = 1107, updated_at = now() WHERE id = '0ddd67bd-81b5-468e-997f-76f86505e141';

-- Добор | Добор прямой 10/100/2070 мм.
-- src: [PR | PRIME Царга ] Плинтус 10/80/2070 мм.
UPDATE products SET rrp = 884, updated_at = now() WHERE id = '1ec9ac70-04dc-4298-97c7-5d63b624292b';

-- Короб | Коробочный брус под покраску 38/75/2800 мм. телескоп с упл. Комплект 2
-- src: [EST| ESTETICA 42мм  ] EST Коробочный брус 36/85/2100 мм. телескоп с упл. Компле
UPDATE products SET rrp = 3984, updated_at = now() WHERE id = 'f8c7499f-884f-4290-8e99-dd0cd4427ee6';

-- Короб | Коробочный брус 38/75/2800 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [EST| ESTETICA 42мм  ] EST Коробочный брус 36/85/2100 мм. телескоп с упл. Компле
UPDATE products SET rrp = 4382, updated_at = now() WHERE id = '7d808fb7-fc4a-4fac-bef9-b3de91ca49a5';

-- Короб | Коробочный брус под покраску 38/75/2200 мм. телескоп с упл. Комплект 2
-- src: [EST| ESTETICA 42мм  ] EST Коробочный брус 36/85/2100 мм. телескоп с упл. Компле
UPDATE products SET rrp = 3984, updated_at = now() WHERE id = '71f5387f-b6ea-45ab-a99b-a8f46c019de4';

-- Короб | Коробочный брус 38/75/2200 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [EST| ESTETICA 42мм  ] EST Коробочный брус 36/85/2400 мм. телескоп с упл. Компле
UPDATE products SET rrp = 4780, updated_at = now() WHERE id = '7b541b78-68a9-452d-a513-c287241f762f';

-- Короб | Коробочный брус 38/75/2500 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [EST| ESTETICA 42мм  ] EST Коробочный брус 36/85/2750 мм. телескоп с упл. Компле
UPDATE products SET rrp = 5975, updated_at = now() WHERE id = '472dbfc3-7c7d-4941-bd45-55d2f5136059';

-- Короб | Скрытый Алюминиевый Короб Invisible SKY 40/80/2200 c упл. На основании
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/80/2200 мм. Аляска,Милк,М
UPDATE products SET rrp = 949, updated_at = now() WHERE id = 'c6e2d1ce-1164-4de4-824c-2cf6ef55480c';

-- Наличники | Наличник плоский  10/70/2500 мм.
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/80/2500 мм.
UPDATE products SET rrp = 1138, updated_at = now() WHERE id = '1a5d04c2-152a-4ac1-a20f-4086937ad8b3';

-- Наличники | Наличник плоский  10/70/2750 мм.
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/80/2750 мм.
UPDATE products SET rrp = 1423, updated_at = now() WHERE id = 'efd34e15-ced7-4656-9afc-f3bdcec5f8fa';

-- Добор | Добор телескопический/прямой 10/100/2500.
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/100/2200 мм. Аляска,Милк,
UPDATE products SET rrp = 1082, updated_at = now() WHERE id = '56649f10-6f13-4e3d-b19b-de84b65c86a7';

-- Добор | Добор телескопический 10/100/2070.
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/100/2200 мм. Антрацит, Си
UPDATE products SET rrp = 1190, updated_at = now() WHERE id = 'e987ea14-171a-468f-884d-7da462407389';

-- Добор | Добор телескопический/прямой 10/100/2070 мм.
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/100/2200 мм.
UPDATE products SET rrp = 1082, updated_at = now() WHERE id = '75b2a096-19bf-4ec3-bf29-d722951e01ca';

-- Добор | Добор телескопический  10/100/2500 мм.
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/100/2500 мм.
UPDATE products SET rrp = 1298, updated_at = now() WHERE id = 'f5532d59-d569-4886-af99-865b48caaee9';

-- Добор | Добор прямой 10/100/2500.
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/100/2750 мм.
UPDATE products SET rrp = 1623, updated_at = now() WHERE id = '3d97d31c-87e2-4b3d-a8ab-5e10a0a08238';

-- Добор | Добор прямой 10/100/2500 мм.
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 10/100/3000 мм.
UPDATE products SET rrp = 2164, updated_at = now() WHERE id = '4b9fe93c-ae2e-45ba-bb26-021cf3692e67';

-- Короб | Скрытый Алюминиевый Короб Invisible 40/80/2500 c упл. На основании из 
-- src: [EST| ESTETICA 42мм  ] Наличник телескопический PRB 16/80/2500 мм.
UPDATE products SET rrp = 1270, updated_at = now() WHERE id = 'a0fdaa85-4f47-4670-81bf-73e83cf2b4d5';

-- Добор | Добор прямой 10/100/2070.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/100/2070 мм. Аляска,Милк,Ман
UPDATE products SET rrp = 1008, updated_at = now() WHERE id = 'd0183a82-521f-4e74-ab03-9a14ec13ccdd';

-- Добор | Добор телескопический/прямой  10/280/2070 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/100/2070 мм. Антрацит,Силк Г
UPDATE products SET rrp = 1108, updated_at = now() WHERE id = '27503011-c73e-4b6e-a8ac-1d354e255cc1';

-- Добор | Добор телескопический / прямой 10/280/2070 мм
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/100/2070 мм.
UPDATE products SET rrp = 1008, updated_at = now() WHERE id = '1de11510-20c7-49df-94e4-fd70d5296c61';

-- Добор | Добор прямой 10/100/2800.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/100/2400 мм.
UPDATE products SET rrp = 1209, updated_at = now() WHERE id = '4a63191e-9b73-457f-8470-e2b15b53a31b';

-- Добор | Добор телескопический 10/280/2800 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/100/2800 мм.
UPDATE products SET rrp = 1511, updated_at = now() WHERE id = '0491e071-8a2a-47eb-ba7b-cf802ba2007a';

-- Добор | Добор телескопический 10/150/2500 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/150/2070 мм. Аляска,Милк,Ман
UPDATE products SET rrp = 1259, updated_at = now() WHERE id = '36463536-c0bb-4219-a63b-315bce7c906b';

-- Добор | Добор телескопический/прямой 10/150/2800 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/150/2070 мм. Антрацит,Силк Г
UPDATE products SET rrp = 1384, updated_at = now() WHERE id = '0e73e562-4811-42c6-b30c-0a6b0babf3e2';

-- Добор | Добор телескопический/прямой 10/280/2070 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/150/2070 мм.
UPDATE products SET rrp = 1259, updated_at = now() WHERE id = 'a39cf542-4fec-46fd-ba88-36baaa4c13ad';

-- Добор | Добор телескопический 10/150/2800 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/150/2400 мм.
UPDATE products SET rrp = 1510, updated_at = now() WHERE id = 'ad16737c-3272-41f3-a622-b3bd192e3686';

-- Добор | Добор прямой 10/150/2800 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/150/2800 мм.
UPDATE products SET rrp = 1888, updated_at = now() WHERE id = '2b6b3ae1-1170-4961-a034-be4c7a8b7e79';

-- Добор | Добор телескопический/прямой  10/200/2500 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/200/2070 мм. Аляска,Милк,Ман
UPDATE products SET rrp = 1511, updated_at = now() WHERE id = '52ec25f8-d233-4791-a6c8-71e892a13dd2';

-- Добор | Добор телескопический/прямой 10/200/2500 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/200/2070 мм. Антрацит,Силк Г
UPDATE products SET rrp = 1662, updated_at = now() WHERE id = '3e425edb-0c81-43da-b764-e0ffb528c7c6';

-- Добор | Добор телескопический/прямой  10/200/2800мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/200/2070 мм.
UPDATE products SET rrp = 1511, updated_at = now() WHERE id = '83e7d439-94fd-4546-a025-6733cc41e485';

-- Добор | Добор телескопический/прямой 10/200/2800мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/200/2400 мм.
UPDATE products SET rrp = 1814, updated_at = now() WHERE id = '5034dfcf-84eb-468b-8c26-d68d4a6d8719';

-- Добор | Добор прямой 10/200/2800 мм.
-- src: [EST| ESTETICA 42мм  ] Добор телескопический PRB 10/200/2800 мм.
UPDATE products SET rrp = 2267, updated_at = now() WHERE id = 'e0dbf603-f6e6-415e-a6fb-4f05be68c494';

-- Притворная планка | Притворная планка 10/38/2070 мм.
-- src: [EST| ESTETICA 42мм  ] Притворная планка 10/30/2070 мм.
UPDATE products SET rrp = 856, updated_at = now() WHERE id = 'f843bc2a-3def-43ba-8c51-615f613fccb6';

-- Добор | Добор телескопический 10/280/2070 мм.
-- src: [EST| ESTETICA 42мм  ] Плинтус 10/80/2070 мм.
UPDATE products SET rrp = 884, updated_at = now() WHERE id = '6a6121f5-8667-466a-a5f9-7cabb66857da';

-- Короб | Скрытый Алюминиевый Короб Invisible SKY 40/80/2800 c упл. На основании
-- src: [EST| ESTETICA 42мм  ] EST Короб компланарный  42 мм 36*84*2100 комплект 2.5 шт 
UPDATE products SET rrp = 3984, updated_at = now() WHERE id = '517c14e7-fc99-4f4e-a29d-4e85a7272a10';

-- Короб | Скрытый Алюминиевый Короб Invisible Reverse SKY 50/51/2500 c упл. На о
-- src: [EST| ESTETICA 42мм  ] EST Короб компланарный  42 мм 36*84*2400 комплект 2.5 шт 
UPDATE products SET rrp = 4780, updated_at = now() WHERE id = '384ab127-0202-4c92-81ad-981c3aeaabdc';

-- Короб | Скрытый Алюминиевый Короб Invisible SKY 40/80/2500 c упл. На основании
-- src: [EST| ESTETICA 42мм  ] EST Короб компланарный  42 мм 36*84*2750 комплект 2.5 шт 
UPDATE products SET rrp = 5975, updated_at = now() WHERE id = 'b6ae49dd-d124-40b2-8115-a7f9bd859ad7';

-- Короб | Скрытый Алюминиевый Короб Invisible SKY Reverse 50/51/2200 c упл. На о
-- src: [EST| ESTETICA 42мм  ] EST Короб компланарный  42 мм 36*84*3000 комплект 2.5 шт 
UPDATE products SET rrp = 9560, updated_at = now() WHERE id = 'e0ce31fd-84b0-4ab0-9358-93ee061a0fa3';

-- Добор | Добор телескопический/прямой 10/280/2500 мм.
-- src: [EST| ESTETICA 42мм  ] EST Наличник компланарный 10*80*2500
UPDATE products SET rrp = 1590, updated_at = now() WHERE id = '2e69b045-f5b9-4d80-ba0e-ae40a79d55b3';

-- Короб | Скрытый Алюминиевый Короб Invisible Reverse SKY 50/51/2800 c упл. На о
-- src: [EST| ESTETICA 42мм  ] EST Скрытый Алюминиевый  Короб Invisible AL 42/58 - под 2
UPDATE products SET rrp = 10236, updated_at = now() WHERE id = '65722756-bacd-4a2a-a6b2-5e04482778a2';

-- Короб | Скрытый Алюминиевый Короб Invisible Reverse 50/51/2500 c упл. На основ
-- src: [EST| ESTETICA 42мм  ] EST Скрытый Алюминиевый  Короб Invisible AL BLACK 42/58 -
UPDATE products SET rrp = 11169, updated_at = now() WHERE id = '0e3d6f98-e2f9-4e9b-9829-1cf57d253f05';

-- Короб | Скрытый Алюминиевый Короб Invisible 40/80/2800 c упл. На основании из 
-- src: [EST| ESTETICA 42мм  ] EST Скрытый Алюминиевый  Короб Invisible AL GOLD 42/58 - 
UPDATE products SET rrp = 11864, updated_at = now() WHERE id = '873721fc-5187-4913-9166-e165371d39f4';

-- Короб | Скрытый Алюминиевый Короб Invisible Reverse 50/51/2200 c упл. На основ
-- src: [EST| ESTETICA 42мм  ] EST Скрытый Алюминиевый  Короб Invisible RAL | NCS 42/58 
UPDATE products SET rrp = 17337, updated_at = now() WHERE id = '9f0b011d-0497-4325-99aa-dc80c80e4f5d';

-- Короб | Скрытый Алюминиевый Короб Invisible Reverse 50/51/2800 c упл. На основ
-- src: [EST| ESTETICA 42мм  ] EST Скрытый Алюминиевый  Короб Invisible AL  42/58 - под 
UPDATE products SET rrp = 10236, updated_at = now() WHERE id = '7409b460-37d9-407c-9b7a-f020f7e6715f';

-- Короб | Коробочный брус 38/75/2500 мм. телескоп с упл. Комплект 2.5 шт. ( врез
-- src: [EST| ESTETICA 42мм  ] EST Скрытый Алюминиевый  Короб Invisible AL BLACK 42/58 -
UPDATE products SET rrp = 11169, updated_at = now() WHERE id = 'a700994d-77ad-481f-97fe-01e7c1600c16';

-- Короб | Коробочный брус 38/75/2100 мм. тескоп с упл. ( без врезки )
-- src: [H | HEAVY 58мм] Короб компланарный Revers 58 мм 26*75*2100 комплект 2.5 шт  
UPDATE products SET rrp = 4247, updated_at = now() WHERE id = 'f04881e6-80df-4c46-84e8-a512388453ee';

-- Короб | Коробочный брус 38/75/2100 мм. тескоп с упл. ( без врезки )
-- src: [EST E | ESTETICA Эмаль ] EST Коробочный брус 36/85/2100 мм. телескоп с упл. Ком
UPDATE products SET rrp = 7096, updated_at = now() WHERE id = '67107eeb-efab-48a9-920f-b15618d24f35';

-- Короб | Коробочный брус под покраску 38/75/2800 мм. телескоп с упл. (без врезк
-- src: [EST E | ESTETICA Эмаль ] EST Коробочный брус 36/85/2400 мм. телескоп с упл. Ком
UPDATE products SET rrp = 8515, updated_at = now() WHERE id = 'b0946ecc-f9d5-4f9b-865c-afaf5929b274';

-- Добор | Добор телескопический 10/280/2500 мм.
-- src: [EST E | ESTETICA Эмаль ] Наличник телескопический PRB 10/80/2500 мм.
UPDATE products SET rrp = 2102, updated_at = now() WHERE id = '3fa9440f-31e2-4b99-8031-0803454d19f8';

-- Короб | Коробочный брус телескоп 32/100/2500 мм. с упл.
-- src: [EST E | ESTETICA Эмаль ] Наличник телескопический PRB 10/ 100 / 2500 мм
UPDATE products SET rrp = 2362, updated_at = now() WHERE id = '6098fe20-1636-40e9-b831-018838100532';

-- Добор | Добор телескопический / прямой 10/280/2500 мм
-- src: [EST E | ESTETICA Эмаль ] Наличник телескопический прямой PRB 16/80/2500 мм.
UPDATE products SET rrp = 2102, updated_at = now() WHERE id = 'b137cb1d-7e22-4a39-a34d-05b263d225ca';

-- Короб | Коробочный брус телескоп 32/100/2070 мм. с упл.
-- src: [EST E | ESTETICA Эмаль ] Добор телескопический PRB 10/100/2070 мм.
UPDATE products SET rrp = 1752, updated_at = now() WHERE id = '31915467-c022-47ce-826e-99208fe154a8';

-- Добор | Добор телескопический / прямой 10/280/2800 мм
-- src: [EST E | ESTETICA Эмаль ] Добор телескопический PRB 10/100/2800 мм.
UPDATE products SET rrp = 2627, updated_at = now() WHERE id = '7227eb2e-3772-49f1-9445-9e22ab630917';

-- Добор | Добор прямой 10/150/2500мм.
-- src: [EST E | ESTETICA Эмаль ] Добор телескопический PRB 10/150/2070 мм.
UPDATE products SET rrp = 2302, updated_at = now() WHERE id = '1481e24b-48ae-4984-9ab8-10f86863cb61';

-- Добор | Добор прямой 10/150/2500 мм.
-- src: [EST E | ESTETICA Эмаль ] Добор телескопический PRB 10/150/2400 мм.
UPDATE products SET rrp = 2762, updated_at = now() WHERE id = '13b17be0-328b-4a04-8b67-447df9d58279';

-- Добор | Добор телескопический/прямой  10/280/2800 мм.
-- src: [EST E | ESTETICA Эмаль ] Добор телескопический PRB 10/150/2800 мм.
UPDATE products SET rrp = 3453, updated_at = now() WHERE id = '666ab337-7516-4c74-802e-bb6ce66bb100';

-- Добор | Добор телескопический 10/200/2500 мм.
-- src: [EST E | ESTETICA Эмаль ] Добор телескопический PRB 10/200/2070 мм.
UPDATE products SET rrp = 2728, updated_at = now() WHERE id = 'bd5ef21f-2f3f-4c7d-9400-ab0f6c8e5fcc';

-- Добор | Добор прямой 10/200/2500 мм.
-- src: [EST E | ESTETICA Эмаль ] Добор телескопический PRB 10/200/2400 мм.
UPDATE products SET rrp = 3274, updated_at = now() WHERE id = 'a6f7cee2-2efb-4bcb-b5df-c998541c337b';

-- Добор | Добор телескопический/прямой 10/280/2800 мм.
-- src: [EST E | ESTETICA Эмаль ] Добор телескопический PRB 10/200/2800мм.
UPDATE products SET rrp = 4092, updated_at = now() WHERE id = '2c25fe22-6723-47ac-84d5-08a662df61d6';

-- Добор | Добор телескопический/прямой 10/280/2500 мм.
-- src: [EST E | ESTETICA Эмаль ] EST Наличник компланарный 10*80*2500
UPDATE products SET rrp = 2094, updated_at = now() WHERE id = 'b76a1e4e-c90c-4256-9db7-a33893771742';

-- Защёлки — без ручек в комплекте | B06101.50.34 Корпус врезного замка под кл.. (мат. хром) тех. уп. без о
-- src: [Фурнитура] AGB MEDIANA POLARIS  WC Матовый хром с ответной частью
UPDATE products SET rrp = 2265, updated_at = now() WHERE id = '5ea90701-7717-450b-8a3b-a25e758a01b7';

-- Защёлки — без ручек в комплекте | Защелка врезная MAGNM96WC-50 (M96WC-50) SSG Сатинированное золото
-- src: [Фурнитура] Защелка врезная MAGNM96WC-50 (M96WC-50) SSG сатинированное з
UPDATE products SET rrp = 1005, updated_at = now() WHERE id = '0bcf3af9-c38e-4488-b9ba-319685949205';

-- Защёлки — без ручек в комплекте | Защелка врезная MAGNM96WC-50 (M96WC-50) BL Черный
-- src: [Фурнитура] Защелка врезная MAGNM96WC-50 (M96WC-50) BL черный
UPDATE products SET rrp = 1005, updated_at = now() WHERE id = '38dfa027-c9b6-431a-b4d0-268096a108fd';

-- Защёлки — без ручек в комплекте | Защелка врезная MAGNM96WC-50 (M96WC-50) SSC Сатинированный хром
-- src: [Фурнитура] Защелка врезная MAGNM96WC-50 (M96WC-50) SSC сатинированный х
UPDATE products SET rrp = 1005, updated_at = now() WHERE id = 'e53a3893-e99c-4c15-85a2-3977c501a78d';

-- Защёлки — без ручек в комплекте | B01101.50.34 Корпус врезного замка под ключ MEDIANA EVOLUTION Матовый 
-- src: [Фурнитура] AGB MEDIANA POLARIS под цилиндр Матовый хром с ответной част
UPDATE products SET rrp = 2460, updated_at = now() WHERE id = '0a1b8ca9-3a63-47c5-9446-8535382b8358';

-- Защёлки — без ручек в комплекте | Защелка врезная магнитная ML96WC-50/BL SSG (сатин.золото) блистер Сати
-- src: [Фурнитура] MAGNM85C-50 (M85C-50) SSG сатинированное золото
UPDATE products SET rrp = 1005, updated_at = now() WHERE id = '635da6f5-988d-4d44-9c2a-5180dad7c0cf';

-- Защёлки — без ручек в комплекте | Защелка врезная магнитная ML96WC-50 SSC (сатин.хром) Сатинированный ни
-- src: [Фурнитура] MAGNM85C-50 (M85C-50) SSC сатинированный хром
UPDATE products SET rrp = 1005, updated_at = now() WHERE id = '6efcbb77-83da-4fb5-be00-eee35cff3c4a';

-- Петли — скрытой установки | E30200.03.34 (мат. хром) петля ECLIPSE 2.0 (4 накладки в комплекте) Ма
-- src: [Фурнитура] петля AGB (АГБ) ECLIPSE 2.2 (4 накладки в комплекте)
UPDATE products SET rrp = 2930, updated_at = now() WHERE id = '114e626a-bd9d-4046-a2f5-e5fa2f40cf16';

-- Петли — скрытой установки | E30200.02.34 (мат. хром) петля ECLIPSE 3.0 (4 накладки в комплекте) Ма
-- src: [Фурнитура] петля AGB (АГБ) ECLIPSE 2.0 (4 накладки в комплекте)
UPDATE products SET rrp = 2340, updated_at = now() WHERE id = 'f64815b6-2c8b-4e5e-b207-863f62e1cf2f';

-- Петли — скрытой установки | E30200.03.03 (латунь) петля ECLIPSE 2.0 (4 накладки в комплекте) Золот
-- src: [Фурнитура] петля AGB (АГБ) ECLIPSE 2.2 (4 накладки в комплекте)
UPDATE products SET rrp = 2780, updated_at = now() WHERE id = 'fe046d63-021e-42b6-b218-2b3bdbca9d09';

-- Петли — скрытой установки | E30200.92.34 (мат. хром) петля ECLIPSE 2.1 (4 накладки в комплекте), 6
-- src: [Фурнитура] Петля скрытой установки U3D2000.TG SC мат.хром
UPDATE products SET rrp = 1545, updated_at = now() WHERE id = 'bef75c14-ffef-4ac3-9c14-ff9c44ef7b62';

-- Петли — скрытой установки | E30200.03.06 петля ECLIPSE 2.0 (4 накладки в комплекте) Никель
-- src: [Фурнитура] петля AGB (АГБ) ECLIPSE 3.0 (4 накладки в комплекте)
UPDATE products SET rrp = 2150, updated_at = now() WHERE id = '909cf5d2-87ba-4010-9c1c-cfb37a27b84d';

-- Петли — скрытой установки | E30200.03.22 петля ECLIPSE 2.0 (4 накладки в комплекте) Бронза
-- src: [Фурнитура] петля AGB (АГБ) ECLIPSE 3.0 (4 накладки в комплекте)
UPDATE products SET rrp = 2850, updated_at = now() WHERE id = '144f907b-bfd2-42c4-aa1f-dab087503b9b';

-- Петли — скрытой установки | E30200.64.34 (мат. хром) петля ECLIPSE 4.1 (4 накладки в комплекте) Ма
-- src: [Фурнитура] петля AGB (АГБ) ECLIPSE 3.0 (4 накладки в комплекте)
UPDATE products SET rrp = 2025, updated_at = now() WHERE id = '0f22d504-8514-43e5-bcb9-f7392790dc3e';

-- Петли — скрытой установки | E30200.03.34.567 (мат. хром) петля ECLIPSE 2.0 (4 накладки в комплекте
-- src: [Фурнитура] Петля скрытой установки U3D3000.VPG SC мат. хром TECH
UPDATE products SET rrp = 1620, updated_at = now() WHERE id = '00aa0c7b-4128-4743-910d-83464f7ae16f';

-- Петли — накладные (карточные) | Петля универсальная IN4400U SB (4BB 100x75x2,5) мат. золото Матовое зо
-- src: [Фурнитура] Петля скрытой установки U3D7800.VPG SG мат. золото TECH
UPDATE products SET rrp = 2745, updated_at = now() WHERE id = '396ba286-b3ac-4a3b-aa58-81a47d770999';

-- Петли — скрытой установки | E30200.02.34.567 (мат. хром) петля ECLIPSE 3.0 (4 накладки в комплекте
-- src: [Фурнитура] Петля скрытой установки U3D7800.VPG SC мат. хром TECH
UPDATE products SET rrp = 2265, updated_at = now() WHERE id = '633e16a8-8745-4df4-b7f0-d06c8f51833b';

-- Петли — накладные (карточные) | Петля универсальная IN4400U SSG (4BB 100x75x2,5) Сатинированное золото
-- src: [Фурнитура] Петля универсальная IN4400U SSG (4BB 100x75x2,5) сатинирован
UPDATE products SET rrp = 280, updated_at = now() WHERE id = '0a00cf92-ee87-4119-b2a7-3846fad68bca';

-- Петли — накладные (карточные) | Петля универсальная IN4400U SSC (4BB 100x75x2,5) Сатинированный хром
-- src: [Фурнитура] Петля универсальная IN4400U SSC (4BB 100x75x2,5) сатинирован
UPDATE products SET rrp = 280, updated_at = now() WHERE id = '28ee4740-09e9-4385-b69e-13482ab395c0';

-- Петли — накладные (карточные) | Петля универсальная IN4400U-BL BL (4BB/BL 100x75x2,5) матовый БЛИСТЕР 
-- src: [Фурнитура] Петля универсальная IN4400U BL (4BB 100x75x2,5) черный матов
UPDATE products SET rrp = 280, updated_at = now() WHERE id = '4b497751-7752-463f-bbcd-f4856d76cf48';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.DM51.FLOW (FLOW DM) SSG-39 Сатинированное золото
-- src: [Фурнитура] Ручка раздельная K.DM51.FLOW (FLOW DM) SSG-39 сатинированное
UPDATE products SET rrp = 2700, updated_at = now() WHERE id = 'f5060337-8310-41b6-8391-fcf9f083932f';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.DM51.Straight (Straight DM) BL-24 Черный
-- src: [Фурнитура] Ручка раздельная K.DM51.Straight (Straight DM) BL-24 черный
UPDATE products SET rrp = 2700, updated_at = now() WHERE id = 'd35df83b-1fa6-424c-8623-a072435308fb';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.DM51.Straight (Straight DM) SSG-39 Сатинированное з
-- src: [Фурнитура] Ручка раздельная K.DM51.Straight (Straight DM) SSG-39 сатини
UPDATE products SET rrp = 2700, updated_at = now() WHERE id = '4c783c2f-7a01-4111-8743-210b4049a638';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.DM51.Straight (Straight DM) SSC-16 Сатинированный х
-- src: [Фурнитура] Ручка раздельная K.DM51.Straight (Straight DM) SSC-16 сатини
UPDATE products SET rrp = 2700, updated_at = now() WHERE id = 'bb921337-03bc-4132-8fae-fcc8fd66be9a';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.DM51.FLOW (FLOW DM) SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка раздельная K.DM51.FLOW (FLOW DM) SSC-16 сатинированный
UPDATE products SET rrp = 2700, updated_at = now() WHERE id = '3170bdd0-eb93-4dc4-b88c-80fefb57c901';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.DM51.FLOW (FLOW DM) BL-24 Черный
-- src: [Фурнитура] Ручка раздельная K.DM51.FLOW (FLOW DM) BL-24 черный
UPDATE products SET rrp = 2700, updated_at = now() WHERE id = '8c0b07ea-1564-446d-b191-49edf729bd09';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.KM52.ROCK (ROCK KM) SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка раздельная K.KM52.ROCK (ROCK KM) SSC-16 сатинированный
UPDATE products SET rrp = 2450, updated_at = now() WHERE id = '5d8d4dea-5362-4b8a-8cb3-c98b3edf82a7';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.KM52.ROCK (ROCK KM) BL-24 Черный
-- src: [Фурнитура] Ручка раздельная K.KM52.ROCK (ROCK KM) BL-24 черный
UPDATE products SET rrp = 2450, updated_at = now() WHERE id = '21d056ee-11f6-43d1-a1b7-e62bc95fb735';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.FLY (FLY SL) SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка раздельная K.SL52.FLY (FLY SL) SSC-16 сатинированный х
UPDATE products SET rrp = 1410, updated_at = now() WHERE id = '914e5eef-6e94-4b40-8a58-7405d2f169a7';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.FLY (FLY SL) BL-24 Черный
-- src: [Фурнитура] Ручка раздельная K.SL52.FLY (FLY SL) BL-24 черный
UPDATE products SET rrp = 1410, updated_at = now() WHERE id = 'fb25690c-f607-45eb-843c-bf8bdc1b13cc';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.PHANTOM (PHANTOM SL) SSC-16 Сатинированный хро
-- src: [Фурнитура] Ручка раздельная K.SL52.PHANTOM (PHANTOM SL) SSC-16 сатиниро
UPDATE products SET rrp = 1410, updated_at = now() WHERE id = 'bfd8efb4-b52e-4475-aeea-2d760d6372b1';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.FLY (FLY SL) SSG-39 Сатинированное золото
-- src: [Фурнитура] Ручка раздельная K.SL52.FLY (FLY SL) SSG-39 сатинированное з
UPDATE products SET rrp = 1410, updated_at = now() WHERE id = '62651968-f7ce-4546-ad56-63925ca10540';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.REDLINE (RED LINE SL) SSG-39 Сатинированное зо
-- src: [Фурнитура] Ручка раздельная K.SL52.REDLINE (RED LINE SL) SSG-39 сатинир
UPDATE products SET rrp = 1410, updated_at = now() WHERE id = 'cbe150a6-3eb6-4054-968c-5501eaca152c';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.REDLINE (RED LINE SL) SSC-16 Сатинированный хр
-- src: [Фурнитура] Ручка раздельная K.SL52.REDLINE (RED LINE SL) SSC-16 сатинир
UPDATE products SET rrp = 1410, updated_at = now() WHERE id = '461ecf64-535d-4945-abb6-c3026822b7e5';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.REDLINE (RED LINE SL) BL-24 Черный
-- src: [Фурнитура] Ручка раздельная K.SL52.REDLINE (RED LINE SL) BL-24 черный
UPDATE products SET rrp = 1410, updated_at = now() WHERE id = '1bfa8875-5b41-4ac6-90ec-4fa646a82e5a';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.PHANTOM (PHANTOM SL) BL-24 Черный
-- src: [Фурнитура] Ручка раздельная K.SL52.PHANTOM (PHANTOM SL) BL-24 черный
UPDATE products SET rrp = 1410, updated_at = now() WHERE id = 'c96c0a39-a4ed-43cb-8735-98633a5da933';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.PRIZMA SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка раздельная R.SLR52.PRIZMA SSC-16 сатинированный хром
UPDATE products SET rrp = 1200, updated_at = now() WHERE id = 'bf7909cc-2cb4-4fd3-aa04-edc298df3c4a';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.ABRASIVE BL-24 Черный
-- src: [Фурнитура] Ручка раздельная R.SLR52.ABRASIVE BL-24 черный
UPDATE products SET rrp = 1335, updated_at = now() WHERE id = '0418e06a-d569-414e-91db-eb949c5931a0';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.PRIZMA SSG-39 Сатинированное золото
-- src: [Фурнитура] Ручка раздельная R.SLR52.PRIZMA SSG-39 сатинированное золото
UPDATE products SET rrp = 1200, updated_at = now() WHERE id = '7c6cf6c0-f00c-4065-bbf1-e62802d35803';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.PRIZMA BL-24 Черный
-- src: [Фурнитура] Ручка раздельная R.SLR52.PRIZMA BL-24 черный
UPDATE products SET rrp = 1200, updated_at = now() WHERE id = '07cad324-b74e-400c-8c31-f7914efb5dea';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.ABRASIVE SSG-39 Сатинированное золото
-- src: [Фурнитура] Ручка раздельная R.SLR52.ABRASIVE SSG-39 сатинированное золо
UPDATE products SET rrp = 1335, updated_at = now() WHERE id = 'ffa02128-a836-4377-b5ac-af4e770b6c42';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.PRIDE BL-24 Черный
-- src: [Фурнитура] Ручка раздельная R.SLR52.PRIDE BL-24 черный
UPDATE products SET rrp = 1200, updated_at = now() WHERE id = '9e414ad3-dca7-401a-bfe8-fc0071b47e6c';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.PRIDE SSG-39 Сатинированное золото
-- src: [Фурнитура] Ручка раздельная R.SLR52.PRIDE SSG-39 сатинированное золото
UPDATE products SET rrp = 1200, updated_at = now() WHERE id = 'f53498c8-c2b8-4b4b-8be4-7451fa8834ce';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.ABRASIVE SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка раздельная R.SLR52.ABRASIVE SSC-16 сатинированный хром
UPDATE products SET rrp = 1200, updated_at = now() WHERE id = 'b4792b1a-85fa-4334-bc07-924596e1eac2';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.PRIDE SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка раздельная R.SLR52.PRIDE SSC-16 сатинированный хром
UPDATE products SET rrp = 1200, updated_at = now() WHERE id = '5b5a4ea9-4b76-4b6c-b155-44fbd13833b3';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.RL52.REDLINE (RED LINE RL) SSG-39 Сатинированное зо
-- src: [Фурнитура] Ручка поворотная BK6.K.DM51 (BK6 DM) SSG-39 сатинированное з
UPDATE products SET rrp = 960, updated_at = now() WHERE id = '80fda85e-2f0f-49e7-8cb6-46e596905945';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.KM52.SAMPLE (SAMPLE KM) SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка поворотная BK6.K.DM51 (BK6 DM) SSC-16 сатинированный х
UPDATE products SET rrp = 960, updated_at = now() WHERE id = 'd74e8494-6e8c-4bef-ab49-ecdad4aacd0b';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.ABRASIVE (ABRASIVE SL) SSG-39 Сатинированное з
-- src: [Фурнитура] Ручка поворотная BK6.K.SL52 (BK6 SL) SSG-39 сатинированное з
UPDATE products SET rrp = 765, updated_at = now() WHERE id = 'e7bd86c9-995a-4b33-a1b0-da3abcd4c9fc';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.PRIME (PRIME SL) SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка поворотная BK6.K.SL52 (BK6 SL) SSC-16 сатинированный х
UPDATE products SET rrp = 765, updated_at = now() WHERE id = '956391ad-7ea0-4e32-badc-77ebba0632f3';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.XM52.DENVER (DENVER XM) SSC/CP-16 /хром Сатинирован
-- src: [Фурнитура] Ручка Fuaro (Фуаро) поворотная BK6.K.KM52 (BK6 KM) SSC-16 са
UPDATE products SET rrp = 920, updated_at = now() WHERE id = '77d41881-9f2c-4570-98a1-5cd5104b8f6e';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.BARREL SSC-16 Сатинированный хром
-- src: [Фурнитура] Ручка поворотная BK6.R.SLR52 (BK6 SLR) SSC-16 сатинированный
UPDATE products SET rrp = 585, updated_at = now() WHERE id = '7173d502-f28f-42a4-abf6-8e3294a04aee';

-- Ручки дверные — На раздельном основании | Ручка раздельная R.SLR52.BARREL SSG-39 Сатинированное золото
-- src: [Фурнитура] Ручка поворотная BK6.R.SLR52 SSG-39 (BK6 SLR) сатинированное
UPDATE products SET rrp = 585, updated_at = now() WHERE id = 'e73bca9b-354f-48df-a81f-1b13cae60479';

-- Ручки дверные — На раздельном основании | Ручка раздельная K.SL52.NEO (NEO SL) SSC/CP-16 /хром Сатинированный хр
-- src: [Фурнитура] Накладка под цилиндр ET.K.SL52 (ET SL) SSC-16 сатинированный
UPDATE products SET rrp = 480, updated_at = now() WHERE id = '469259b7-6ceb-4754-9777-85da606e0dde';

-- Системы открывания Compack | Compack. Одностворчатая 90 Без цвета
-- src: [Ручное] прайс 21778₽
UPDATE products SET rrp = 21778, updated_at = now() WHERE id = '58436907-ccb8-4388-8afb-722ec043758d';

-- Системы открывания Compack | Compack. Одностворчатая 180 Без цвета
-- src: [Ручное] прайс 21778₽
UPDATE products SET rrp = 21778, updated_at = now() WHERE id = 'd943f03e-7e0f-46c3-b431-53ba4a578125';

-- Системы открывания Compack | Compack. Двухстворчатая 90 Без цвета
-- src: [Ручное] прайс 46035₽
UPDATE products SET rrp = 46035, updated_at = now() WHERE id = 'cc6b19a2-a57d-4418-a9f9-0e2647754d79';

-- Системы открывания Compack | Compack. Двухстворчатая 180 Без цвета
-- src: [Ручное] прайс 46035₽
UPDATE products SET rrp = 46035, updated_at = now() WHERE id = '61582b56-ba37-4806-94b2-f10120bebb57';

-- Системы открывания Пенал | Пенал Без цвета
-- src: [Ручное] прайс 37442₽
UPDATE products SET rrp = 37442, updated_at = now() WHERE id = '5d5ec245-7305-48ec-beb2-5c1c0f72eb9a';

-- Системы открывания Пенал | Пенал с обрамлением Без цвета
-- src: [Ручное] прайс 60890₽
UPDATE products SET rrp = 60890, updated_at = now() WHERE id = '9595251d-c6c9-4a79-9abf-789a0df1f45f';

-- Системы открывания Пенал | Пенал двойной с обрамлением Без цвета
-- src: [Ручное] прайс 104762₽
UPDATE products SET rrp = 104762, updated_at = now() WHERE id = '76bb064b-d6f8-4a6f-b32a-695f712e81fa';

-- Система открывания Invisible | Invisible. AVERS и REVERS Без цвета
-- src: [Ручное] прайс 34926₽
UPDATE products SET rrp = 34926, updated_at = now() WHERE id = 'b755fe88-800d-4763-aeb8-8dd5733dc4f5';

-- Система открывания Invisible | Invisible. SKY Без цвета
-- src: [Ручное] прайс 34926₽
UPDATE products SET rrp = 34926, updated_at = now() WHERE id = '2ffff765-009e-405a-b65c-9f11f6755131';

COMMIT;
