import type { Article } from "./types";
import { scherbinkaNews } from "./scherbinka";
import { kashirskyNews } from "./kashirsky";
import { roomerNews } from "./roomer";
import { dekoratorNews } from "./dekorator";
import { m2News } from "./m2";
import { scherbinkaNewsExtra } from "./scherbinka-extra";
import { kashirskyNewsExtra } from "./kashirsky-extra";
import { roomerNewsExtra } from "./roomer-extra";
import { dekoratorNewsExtra } from "./dekorator-extra";
import { m2NewsExtra } from "./m2-extra";

export type { Article, ArticleBlock } from "./types";

/** Наборы статей по slug салона. У каждого домена свой уникальный контент. */
export const NEWS_BY_SITE: Record<string, Article[]> = {
  scherbinka: [...scherbinkaNews, ...scherbinkaNewsExtra],
  kashirsky: [...kashirskyNews, ...kashirskyNewsExtra],
  roomer: [...roomerNews, ...roomerNewsExtra],
  dekorator: [...dekoratorNews, ...dekoratorNewsExtra],
  m2: [...m2News, ...m2NewsExtra],
};


function sortByDateDesc(list: Article[]): Article[] {
  return [...list].sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getArticles(siteSlug: string | undefined): Article[] {
  if (!siteSlug) return [];
  return sortByDateDesc(NEWS_BY_SITE[siteSlug] ?? []);
}

export function getArticle(
  siteSlug: string | undefined,
  articleSlug: string | undefined
): Article | undefined {
  if (!siteSlug || !articleSlug) return undefined;
  return (NEWS_BY_SITE[siteSlug] ?? []).find((a) => a.slug === articleSlug);
}

/** Все пары [siteSlug, articleSlug] — для генерации sitemap. */
export function allArticleRoutes(): Array<{ siteSlug: string; articleSlug: string; date: string }> {
  return Object.entries(NEWS_BY_SITE).flatMap(([siteSlug, list]) =>
    list.map((a) => ({ siteSlug, articleSlug: a.slug, date: a.date }))
  );
}
