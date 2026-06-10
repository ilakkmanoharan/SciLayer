import { readFileSync, existsSync } from "node:fs";
import path from "node:path";

export type ArticleCollection = {
  id: string;
  title: string;
  description: string;
  order: number;
  articles: string[];
};

type ArticleCatalogFile = {
  version: number;
  description?: string;
  collections: ArticleCollection[];
};

const CATALOG_PATH = path.join(process.cwd(), "content", "articles", "catalog.json");

let cachedCatalog: ArticleCatalogFile | null = null;
let cachedSlugMap: Map<string, { collection: ArticleCollection; index: number }> | null = null;

function loadCatalogFile(): ArticleCatalogFile {
  if (cachedCatalog) {
    return cachedCatalog;
  }

  if (!existsSync(CATALOG_PATH)) {
    cachedCatalog = { version: 1, collections: [] };
    return cachedCatalog;
  }

  cachedCatalog = JSON.parse(readFileSync(CATALOG_PATH, "utf8")) as ArticleCatalogFile;
  return cachedCatalog;
}

function buildSlugMap(): Map<string, { collection: ArticleCollection; index: number }> {
  if (cachedSlugMap) {
    return cachedSlugMap;
  }

  cachedSlugMap = new Map();
  const catalog = loadCatalogFile();

  for (const collection of catalog.collections) {
    collection.articles.forEach((slug, index) => {
      cachedSlugMap!.set(slug, { collection, index });
    });
  }

  return cachedSlugMap;
}

export function getArticleCollections(): ArticleCollection[] {
  return [...loadCatalogFile().collections].sort((a, b) => a.order - b.order);
}

export function getArticleCollectionForSlug(slug: string): ArticleCollection | undefined {
  return buildSlugMap().get(slug)?.collection;
}

export function getArticleCollectionIndex(slug: string): number | undefined {
  return buildSlugMap().get(slug)?.index;
}

export function groupArticlesByCollection<T extends { slug: string }>(
  articles: T[],
): { collection: ArticleCollection | null; articles: T[] }[] {
  const collections = getArticleCollections();
  const bySlug = new Map(articles.map((article) => [article.slug, article]));
  const grouped: { collection: ArticleCollection | null; articles: T[] }[] = [];

  for (const collection of collections) {
    const items = collection.articles
      .map((slug) => bySlug.get(slug))
      .filter((article): article is T => article !== undefined);

    if (items.length > 0) {
      grouped.push({ collection, articles: items });
      items.forEach((article) => bySlug.delete(article.slug));
    }
  }

  const remaining = Array.from(bySlug.values());
  if (remaining.length > 0) {
    grouped.push({ collection: null, articles: remaining });
  }

  return grouped;
}
