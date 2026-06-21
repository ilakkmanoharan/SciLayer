import { sortArticlesByPublishedDate } from "@/lib/article-catalog";
import { demoArticles, type DemoArticle } from "@/lib/demo-data";

export type AuthorProfile = {
  name: string;
  orcid: string;
  affiliation: string;
  articleCount: number;
};

export function getAllAuthors(): AuthorProfile[] {
  const byOrcid = new Map<string, AuthorProfile>();

  for (const article of demoArticles) {
    for (const author of article.authors) {
      const existing = byOrcid.get(author.orcid);
      if (existing) {
        existing.articleCount += 1;
      } else {
        byOrcid.set(author.orcid, {
          name: author.name,
          orcid: author.orcid,
          affiliation: author.affiliation,
          articleCount: 1,
        });
      }
    }
  }

  return Array.from(byOrcid.values()).sort((a, b) => {
    if (b.articleCount !== a.articleCount) {
      return b.articleCount - a.articleCount;
    }
    return a.name.localeCompare(b.name);
  });
}

export function getAuthorByOrcid(orcid: string): AuthorProfile | undefined {
  return getAllAuthors().find((author) => author.orcid === orcid);
}

export function getArticlesByAuthor(orcid: string): DemoArticle[] {
  return sortArticlesByPublishedDate(
    demoArticles.filter((article) => article.authors.some((author) => author.orcid === orcid)),
  );
}

export function getAuthorInitials(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}
