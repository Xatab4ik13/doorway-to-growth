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
  /** Развёрнутый SEO-текст внизу страницы (2–3 абзаца). */
  body?: string[];
}


export const CATEGORY_SEO: Record<string, CategorySeo> = {
  "entrance-doors": {
    slug: "entrance-doors",
    name: "Входные двери",
    keyphrase: "Входные двери",
    intro:
      "Входные двери Brandoors с многослойным утеплением, противосъёмными ригелями и отделкой под интерьер квартиры. Замер, доставка и установка по Москве и области.",
    body: [
      "Входная дверь Brandoors собирается на стальном каркасе с двойным контуром уплотнения: холод и шум с лестничной клетки остаются снаружи. Внутреннее наполнение — минеральная плита, поверх неё влагостойкие панели, которые можно подобрать в цвет межкомнатных дверей квартиры.",
      "Замки ставим двух разных систем — сувальдный и цилиндровый, дополнительно противосъёмные ригели со стороны петель и броненакладка. Полотно доступно в стандартных проёмах и по индивидуальным размерам, в том числе под нестандартную высоту и открывание внутрь или наружу.",
      "В салоне можно посмотреть срез полотна, сравнить отделки вживую и рассчитать комплект вместе с погонажем и фурнитурой. После замера мастер привозит и устанавливает дверь, старую конструкцию демонтируем и вывозим.",
    ],
  },
  "mezhkomnatnye-dveri": {
    slug: "mezhkomnatnye-dveri",
    name: "Межкомнатные двери",
    keyphrase: "Межкомнатные двери",
    intro:
      "Межкомнатные двери Brandoors: скрытый монтаж, эмаль, шпон и стекло. Шесть коллекций под разные интерьерные задачи — от минимализма до фактурного дерева.",
    body: [
      "Межкомнатные двери Brandoors выпускаются шестью коллекциями: ESTETICA, GHOST, HEAVY, PRIME, REFLECT и MAZE. Они отличаются не только рисунком полотна, но и конструкцией — скрытый короб заподлицо со стеной, классический короб с наличником, полотна со стеклом и зеркалом.",
      "Любая модель собирается под конкретный проём: высота до 2700 мм, скрытые или накладные петли, магнитная защёлка, механизмы Invisible, Compack, пенал и купе. Кромка и погонаж подбираются в цвет полотна, поэтому дверь читается как единая плоскость стены.",
      "Выбирать удобнее в экспозиции: цвет эмали и текстуру шпона сложно оценить по фотографии. В салоне помогут собрать комплект на всю квартиру в одном оттенке и рассчитать стоимость с доставкой и установкой.",
    ],
  },
  pogonazh: {
    slug: "pogonazh",
    name: "Погонаж",
    keyphrase: "Дверной погонаж",
    intro:
      "Наличники, плинтус, коробы, доборы и притворные планки Brandoors в цвет двери. Комплектующие подбираются под конкретную модель и высоту проёма.",
    body: [
      "Погонаж — это всё, что обрамляет дверь: коробка, наличники, доборные планки, притворная планка и плинтус. Brandoors выпускает их в тех же покрытиях, что и полотна, поэтому переход между дверью, стеной и полом получается без цветовых стыков.",
      "Наличники доступны в прямом и скруглённом профиле, скрытые алюминиевые версии — для коллекции GHOST и других решений заподлицо. Доборы закрывают глубокие проёмы в панельных домах, а плинтус можно подобрать в высоту 60, 80 или 100 мм.",
      "Точный комплект считает менеджер салона по замеру: количество планок зависит от толщины стены, типа открывания и наличия притвора.",
    ],
  },
  furnitura: {
    slug: "furnitura",
    name: "Фурнитура",
    keyphrase: "Дверная фурнитура",
    intro:
      "Дверные ручки, скрытые петли, защёлки и системы открывания Invisible, Compack, Magic, пенал и купе. Вся фурнитура совместима с дверями Brandoors.",
    body: [
      "Фурнитура определяет, как дверь ощущается в руке и как долго она прослужит. В каталоге — ручки на розетке и планке, магнитные и механические защёлки, сантехнические фиксаторы, скрытые и накладные петли с регулировкой в трёх плоскостях.",
      "Отдельный блок — системы открывания: Invisible для полотен заподлицо, Compack для узких помещений, Magic, раздвижной пенал и купе. Они подбираются вместе с дверью, потому что влияют на конструкцию короба и на ширину проёма.",
      "Всё, что представлено в разделе, совместимо с полотнами Brandoors и есть в экспозиции салона — механизм можно попробовать до заказа.",
    ],
  },
};

export interface CollectionSeo {
  slug: string;
  /** Имя коллекции в базе (categories.name) — по нему фильтруется каталог. */
  name: string;
  keyphrase: string;
  intro: string;
  /** Развёрнутый SEO-текст внизу страницы коллекции. */
  body?: string[];
}

export const COLLECTION_SEO: Record<string, CollectionSeo> = {
  estetica: {
    slug: "estetica",
    name: "ESTETICA",
    keyphrase: "Двери ESTETICA",
    intro:
      "Коллекция ESTETICA — классические пропорции и мягкая геометрия полотна. Эмаль и шпон, скрытые и накладные петли, широкая размерная сетка.",
    body: [
      "ESTETICA построена на классических пропорциях: спокойное полотно, аккуратная филёнка и мягкая геометрия без резких переходов. Такая дверь не спорит с интерьером и одинаково уместна в неоклассике, современной классике и мягком минимализме.",
      "Полотна выпускаются в эмали и шпоне, с остеклением и глухие, под скрытые и накладные петли. Размерная сетка перекрывает и типовые проёмы, и высокие потолки, поэтому коллекцию часто берут на всю квартиру целиком.",
      "В экспозиции салона можно сравнить оттенки эмали при разном свете — это главный критерий выбора в этой коллекции.",
    ],
  },
  ghost: {
    slug: "ghost",
    name: "GHOST",
    keyphrase: "Двери скрытого монтажа GHOST",
    intro:
      "Коллекция GHOST — двери скрытого монтажа заподлицо со стеной. Алюминиевый короб без наличников, кромка в цвет, покраска под стену или контрастная отделка.",
    body: [
      "GHOST — двери скрытого монтажа: алюминиевый короб монтируется в стену на этапе отделки, наличники не нужны, полотно встаёт заподлицо с плоскостью стены. Визуально дверь исчезает — остаётся только линия примыкания и ручка.",
      "Открывание бывает обычным и обратным (полотно уходит в сторону соседней комнаты), петли скрытые с регулировкой, кромка выполняется в цвет полотна или контрастным алюминием. Поверхность можно красить под стену тем же составом, что и стены.",
      "Такие двери требуют точного замера и согласования с бригадой на объекте — короб ставится до финишной шпаклёвки. Менеджер салона подскажет порядок работ и подготовит спецификацию для строителей.",
    ],
  },
  heavy: {
    slug: "heavy",
    name: "HEAVY",
    keyphrase: "Двери HEAVY",
    intro:
      "Коллекция HEAVY — массивное полотно с выраженной фактурой и глубоким рельефом. Решение для интерьеров, где дверь работает как архитектурный элемент.",
    body: [
      "HEAVY — самая «плотная» коллекция линейки: утолщённое полотно, глубокий рельеф и выраженная фактура поверхности. Дверь воспринимается как часть архитектуры, а не как проходной элемент отделки.",
      "За счёт массы полотна улучшается шумоизоляция между комнатами, поэтому коллекцию часто выбирают для спален, кабинетов и домашних кинотеатров. Петли и механизмы подбираются с запасом по нагрузке.",
      "Рельеф лучше оценивать вживую: под разным углом света рисунок читается по-разному — образцы стоят в экспозиции салона.",
    ],
  },
  prime: {
    slug: "prime",
    name: "PRIME",
    keyphrase: "Двери PRIME",
    intro:
      "Коллекция PRIME — сдержанный современный дизайн, ровное полотно и точная кромка. Универсальная база для квартир и офисных пространств.",
    body: [
      "PRIME — универсальная современная база: ровное полотно, точная кромка, минимум декора. Коллекция закрывает большинство задач в квартирах, апартаментах и офисных помещениях, где дверь должна быть аккуратным фоном.",
      "Доступны глухие и остеклённые полотна, вертикальные вставки, скрытые петли и магнитная защёлка. Широкая палитра покрытий позволяет собрать один оттенок на все комнаты и подобрать плинтус в тон.",
      "Это наиболее сбалансированная коллекция по соотношению цены и внешнего вида — с неё имеет смысл начинать выбор, если интерьер ещё не определён окончательно.",
    ],
  },
  reflect: {
    slug: "reflect",
    name: "REFLECT",
    keyphrase: "Двери REFLECT со стеклом",
    intro:
      "Коллекция REFLECT — двери со стеклом и зеркальными вставками. Лакобель, сатин и прозрачное стекло: свет проходит между комнатами, объём сохраняется.",
    body: [
      "REFLECT работает со светом: стеклянные и зеркальные вставки пропускают дневной свет из комнаты в коридор и визуально увеличивают пространство. Это рабочее решение для тёмных прихожих и узких планировок.",
      "Стекло бывает прозрачным, сатинированным, тонированным и в исполнении лакобель; зеркальное полотно заменяет отдельное зеркало в коридоре. Все вставки закалённые, по запросу — с плёнкой безопасности.",
      "Подбирать стекло стоит вместе с освещением помещения: в салоне образцы стоят под разным светом, чтобы можно было сравнить прозрачность и степень матовости.",
    ],
  },
  maze: {
    slug: "maze",
    name: "MAZE",
    keyphrase: "Двери MAZE",
    intro:
      "Коллекция MAZE — графичные фрезеровки и наборный рисунок полотна. Дверь становится самостоятельным декоративным акцентом стены.",
    body: [
      "MAZE — коллекция с графичной фрезеровкой: рисунок набирается на полотне и превращает дверь в декоративный акцент. Хорошо смотрится там, где стена остаётся пустой и дверь становится главным элементом.",
      "Глубина фрезеровки и раскладка рисунка отличаются от модели к модели, покрытие — эмаль и шпон, включая контрастные сочетания полотна и кромки. Возможны высокие полотна для проёмов до потолка.",
      "Коллекцию берут для гостиных, коридоров и входных групп в квартиру, когда нужен характер без дополнительного декора на стенах.",
    ],
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
  // Предложный падеж города для естественных заголовков: «купить в Москве».
  const cityIn = city.endsWith("а") ? `${city.slice(0, -1)}е` : city;

  if (collection) {
    return {
      h1: `${collection.name} — межкомнатные двери`,
      title: `${collection.keyphrase} — купить в ${cityIn}, салон ${salon}`,
      description: `${collection.intro} Салон Brandoors ${salon}, ${locality}. Живая экспозиция, замер и расчёт стоимости.`,
    };
  }

  if (category) {
    return {
      h1: category.name,
      title: `${category.keyphrase} — купить в ${cityIn}, салон ${salon}`,
      description: `${category.intro} Салон Brandoors ${salon}, ${locality}.`,
    };
  }


  return {
    h1: "Каталог",
    title: `Каталог дверей Brandoors — салон ${salon}, ${city}`,
    description: `Каталог межкомнатных и входных дверей Brandoors. Салон ${salon}, ${locality}: экспозиция, замер, доставка и установка.`,
  };
}

/** Ссылка на карточку товара внутри текущего магазина. */
export function productHref(slug: string | null | undefined, productSlug: string) {
  return storeHref(slug, `/product/${productSlug}`);
}

export interface ProductMetaSource {
  name: string;
  description?: string | null;
  rrp?: number | null;
  categoryName?: string | null;
}

/**
 * Уникальные title/description/H1 для карточки товара.
 * Шаблон: «[Модель] — [Коллекция/Категория], купить в Москве — салон [Салон]».
 * Гео-привязка к салону не даёт пяти доменам выглядеть дублями.
 */
export function buildProductMeta(
  site: SiteMetaSource | null | undefined,
  product: ProductMetaSource,
  category: CategorySeo | null,
  collection: CollectionSeo | null
) {
  const salon = siteShortName(site);
  const locality = siteLocality(site);
  const city = site?.city || "Москва";
  const cityIn = city.endsWith("а") ? `${city.slice(0, -1)}е` : city;

  const group =
    collection?.name ||
    category?.name ||
    product.categoryName ||
    "Двери Brandoors";

  const kind = collection ? `${collection.name}, межкомнатная дверь` : group;

  const title = `${product.name} — ${kind} — купить в ${cityIn}, салон ${salon}`;

  const priceLine =
    product.rrp && Number(product.rrp) > 0
      ? `Цена от ${Math.round(Number(product.rrp)).toLocaleString("ru-RU")} ₽.`
      : "Цена по запросу.";

  const base =
    product.description?.trim() ||
    `${product.name} — ${kind.toLowerCase()} Brandoors. Покрытия, размеры и фурнитура подбираются под проём.`;

  const salonLine =
    salon.toLowerCase() === locality.toLowerCase()
      ? `Салон Brandoors ${salon}`
      : `Салон ${salon}, ${locality}`;

  const description = `${base} ${priceLine} ${salonLine}: экспозиция, замер, доставка и установка.`
    .replace(/\s+/g, " ")
    .trim();

  return {
    h1: product.name,
    title,
    description: description.length > 320 ? `${description.slice(0, 317)}…` : description,
    group,
  };
}
