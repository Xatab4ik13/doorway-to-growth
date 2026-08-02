/**
 * Статьи новостного раздела storefront.
 * Хранятся статикой в коде и привязаны к slug конкретного салона,
 * чтобы у каждого из пяти доменов был свой уникальный контент.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string }
  /** Иллюстрация. `src` — ключ из NEWS_MEDIA (src/content/news/media.ts). */
  | { type: "img"; src: string; alt: string; caption?: string }
  /** Блок внутренней перелинковки. `to` — путь относительно магазина, без ведущего слэша. */
  | { type: "links"; title?: string; items: Array<{ label: string; to: string }> };

export interface Article {
  /** URL-сегмент: /news/<slug> */
  slug: string;
  /** Заголовок в ленте и <h1> */
  title: string;
  /** <title> страницы, до 60 символов */
  seoTitle: string;
  /** meta description */
  description: string;
  /** Короткий анонс в ленте */
  excerpt: string;
  /** ISO-дата публикации */
  date: string;
  /** Примерное время чтения, мин */
  readingMinutes: number;
  tags: string[];
  /** Ключ обложки из NEWS_MEDIA */
  cover?: string;
  blocks: ArticleBlock[];
}
