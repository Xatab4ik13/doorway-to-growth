/**
 * Статические SEO-маршруты каталога Brandoors.
 *
 * Вместо параметризованных ссылок вида /catalog/list?category=...&collection=...
 * каталог получает человекочитаемые индексируемые URL:
 *
 *   /catalog                                    — выбор категории
 *   /catalog/entrance-doors                     — входные двери
 *   /catalog/mezhkomnatnye-dveri                — выбор коллекции
 *   /catalog/mezhkomnatnye-dveri/ghost          — коллекция GHOST
 *   /catalog/pogonazh                           — погонаж
 *   /catalog/furnitura                          — фурнитура
 *
 * Мета-теги и H1 формируются с привязкой к конкретному салону, чтобы
 * пять доменов не выглядели дублями друг друга для Яндекса.
 */

import { storeHref } from "@/lib/storeHref";

export const CATALOG_ROOT = "catalog";

/** Родительская категория, у которой есть промежуточная страница выбора коллекций. */
export const COLLECTIONS_PARENT_SLUG = "mezhkomnatnye-dveri";

export interface CategorySeo {
  slug: string;
  /** Название категории для H1 и хлебных крошек. */
  name: string;
  /** Ключевая фраза для title — то, как товар ищут в поиске. */
  keyphrase: string;
  /** Уникальный вводный текст категории (для description и текстового блока). */
  intro: string;
}

export const CATEGORY_SEO: Record<string, CategorySeo> = {
  "entrance-doors": {
    slug: "entrance-doors",
    name: "Входные двери",
    keyphrase: "Входные двери",
    intro:
      "Входные двери Brandoors с многослойным утеплением, противосъёмными ригелями и отделкой под интерьер квартиры. Замер, доставка и установка по Москве и области.",
  },
  "mezhkomnatnye-dveri": {
    slug: "mezhkomnatnye-dveri",
    name: "Межкомнатные двери",
    keyphrase: "Межкомнатные двери",
    intro:
      "Межкомнатные двери Brandoors: скрытый монтаж, эмаль, шпон и стекло. Шесть коллекций под разные интерьерные задачи — от минимализма до фактурного дерева.",
  },
  pogonazh: {
    slug: "pogonazh",
    name: "Погонаж",
    keyphrase: "Дверной погонаж",
    intro:
      "Наличники, плинтус, коробы, доборы и притворные планки Brandoors в цвет двери. Комплектующие подбираются под конкретную модель и высоту проёма.",
  },
  furnitura: {
    slug: "furnitura",
    name: "Фурнитура",
    keyphrase: "Дверная фурнитура",
    intro:
      "Дверные ручки, скрытые петли, защёлки и системы открывания Invisible, Compack, Magic, пенал и купе. Вся фурнитура совместима с дверями Brandoors.",
  },
};

export interface CollectionSeo {
  slug: string;
  /** Имя коллекции в базе (categories.name) — по нему фильтруется каталог. */
  name: string;
  keyphrase: string;
  intro: string;
}

export const COLLECTION_SEO: Record<string, CollectionSeo> = {
  estetica: {
    slug: "estetica",
    name: "ESTETICA",
    keyphrase: "Двери ESTETICA",
    intro:
      "Коллекция ESTETICA — классические пропорции и мягкая геометрия полотна. Эмаль и шпон, скрытые и накладные петли, широкая размерная сетка.",
  },
  ghost: {
    slug: "ghost",
    name: "GHOST",
    keyphrase: "Двери скрытого монтажа GHOST",
    intro:
      "Коллекция GHOST — двери скрытого монтажа заподлицо со стеной. Алюминиевый короб без наличников, кромка в цвет, покраска под стену или контрастная отделка.",
  },
  heavy: {
    slug: "heavy",
    name: "HEAVY",
    keyphrase: "Двери HEAVY",
    intro:
      "Коллекция HEAVY — массивное полотно с выраженной фактурой и глубоким рельефом. Решение для интерьеров, где дверь работает как архитектурный элемент.",
  },
  prime: {
    slug: "prime",
    name: "PRIME",
    keyphrase: "Двери PRIME",
    intro:
      "Коллекция PRIME — сдержанный современный дизайн, ровное полотно и точная кромка. Универсальная база для квартир и офисных пространств.",
  },
  reflect: {
    slug: "reflect",
    name: "REFLECT",
    keyphrase: "Двери REFLECT со стеклом",
    intro:
      "Коллекция REFLECT — двери со стеклом и зеркальными вставками. Лакобель, сатин и прозрачное стекло: свет проходит между комнатами, объём сохраняется.",
  },
  maze: {
    slug: "maze",
    name: "MAZE",
    keyphrase: "Двери MAZE",
    intro:
      "Коллекция MAZE — графичные фрезеровки и наборный рисунок полотна. Дверь становится самостоятельным декоративным акцентом стены.",
  },
};

export const CATEGORY_SLUGS = Object.keys(CATEGORY_SEO);
export const COLLECTION_SLUGS = Object.keys(COLLECTION_SEO);

export function getCategorySeo(slug?: string | null): CategorySeo | null {
  if (!slug) return null;
  return CATEGORY_SEO[slug] ?? null;
}

export function getCollectionSeo(slug?: string | null): CollectionSeo | null {
  if (!slug) return null;
  return COLLECTION_SEO[slug.toLowerCase()] ?? null;
}

/** Обратный поиск: имя коллекции в БД → slug для URL. */
export function collectionSlugByName(name?: string | null): string | null {
  if (!name) return null;
  const target = name.trim().toUpperCase();
  const found = COLLECTION_SLUGS.find((s) => COLLECTION_SEO[s].name === target);
  return found ?? null;
}

/* ------------------------------------------------------------------ */
/*  Построение ссылок                                                  */
/* ------------------------------------------------------------------ */

export function catalogHref(slug?: string | null) {
  return storeHref(slug, CATALOG_ROOT);
}

export function categoryHref(slug: string | null | undefined, categorySlug: string) {
  return storeHref(slug, `${CATALOG_ROOT}/${categorySlug}`);
}

export function collectionHref(slug: string | null | undefined, collectionSlug: string) {
  return storeHref(
    slug,
    `${CATALOG_ROOT}/${COLLECTIONS_PARENT_SLUG}/${collectionSlug}`
  );
}

/** Ссылка на коллекцию по её имени в БД (ESTETICA, GHOST…). */
export function collectionHrefByName(slug: string | null | undefined, name: string) {
  const collectionSlug = collectionSlugByName(name);
  if (!collectionSlug) return categoryHref(slug, COLLECTIONS_PARENT_SLUG);
  return collectionHref(slug, collectionSlug);
}

/* ------------------------------------------------------------------ */
/*  Мета-теги, уникальные для каждого салона                           */
/* ------------------------------------------------------------------ */

export interface SiteMetaSource {
  name?: string | null;
  city?: string | null;
  district?: string | null;
}

/** Короткая гео-привязка салона: район, если есть, иначе город. */
export function siteLocality(site?: SiteMetaSource | null) {
  if (!site) return "Москва";
  return site.district || site.city || "Москва";
}

/** Название салона без дублирующего бренда в начале. */
export function siteShortName(site?: SiteMetaSource | null) {
  if (!site?.name) return "Brandoors";
  return site.name.replace(/^BRANDOORS\s*/i, "").trim() || "Brandoors";
}

export function buildCatalogMeta(
  site: SiteMetaSource | null | undefined,
  category: CategorySeo | null,
  collection: CollectionSeo | null
) {
  const salon = siteShortName(site);
  const locality = siteLocality(site);
  const city = site?.city || "Москва";

  if (collection) {
    return {
      h1: `${collection.name} — межкомнатные двери`,
      title: `${collection.keyphrase} — купить в ${city}, салон ${salon}`,
      description: `${collection.intro} Салон Brandoors ${salon}, ${locality}. Живая экспозиция, замер и расчёт стоимости.`,
    };
  }

  if (category) {
    return {
      h1: category.name,
      title: `${category.keyphrase} — купить в ${city}, салон ${salon}`,
      description: `${category.intro} Салон Brandoors ${salon}, ${locality}.`,
    };
  }

  return {
    h1: "Каталог",
    title: `Каталог дверей Brandoors — салон ${salon}, ${city}`,
    description: `Каталог межкомнатных и входных дверей Brandoors. Салон ${salon}, ${locality}: экспозиция, замер, доставка и установка.`,
  };
}
