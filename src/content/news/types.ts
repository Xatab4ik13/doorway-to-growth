/**
 * Статьи новостного раздела storefront.
 * Хранятся статикой в коде и привязаны к slug конкретного салона,
 * чтобы у каждого из пяти доменов был свой уникальный контент.
 */

export type ArticleBlock =
  | { type: "p"; text: string }
  | { type: "h2"; text: string }
  | { type: "ul"; items: string[] }
  | { type: "quote"; text: string };

export interface Article {
  /** URL-сегмент: /news/<slug> */
  slug: string;
  /** Заголовок в ленте и <h1> */
  title: string;
  /** <title> страницы */
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
  blocks: ArticleBlock[];
}
