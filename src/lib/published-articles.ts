import { readFileSync, readdirSync, existsSync } from "node:fs";
import path from "node:path";
import { classifyManuscript } from "@/lib/classification";
import type { DemoArticle } from "@/lib/demo-data";

const CONTENT_ROOT = path.join(process.cwd(), "content", "articles");

type ArticleMetadata = {
  slug: string;
  title: string;
  abstract: string;
  articleType: string;
  version: number;
  status: DemoArticle["status"];
  license: string;
  githubUrl: string;
  journal?: string;
  publishedAt?: string;
  views: number;
  downloads: number;
  keywords: string[];
  authors: DemoArticle["authors"];
  manuscriptFile: string;
  versions: {
    version: number;
    manuscriptFile: string;
    commit: string;
    createdAt: string;
    summary: string;
  }[];
};

function readManuscript(dir: string, filename: string) {
  const filePath = path.join(dir, filename);
  if (!existsSync(filePath)) {
    return `# Manuscript unavailable\n\nThe source file \`${filename}\` could not be loaded.`;
  }
  return readFileSync(filePath, "utf8");
}

function loadArticleFromDir(dirName: string): DemoArticle | null {
  const dir = path.join(CONTENT_ROOT, dirName);
  const metadataPath = path.join(dir, "metadata.json");

  if (!existsSync(metadataPath)) {
    return null;
  }

  const meta = JSON.parse(readFileSync(metadataPath, "utf8")) as ArticleMetadata;
  const manuscriptMd = readManuscript(dir, meta.manuscriptFile);
  const classification = classifyManuscript({
    title: meta.title,
    abstract: meta.abstract,
    keywords: meta.keywords,
  });

  return {
    slug: meta.slug,
    title: meta.title,
    abstract: meta.abstract,
    authors: meta.authors,
    status: meta.status,
    articleType: meta.articleType,
    version: meta.version,
    license: meta.license,
    githubUrl: meta.githubUrl,
    publishedAt: meta.publishedAt,
    views: meta.views,
    downloads: meta.downloads,
    journal: meta.journal,
    classification,
    manuscriptMd,
    supportingMaterials: {
      coverLetter: "",
      supplementary: [],
      figures: [],
      referencesNote: "References are included in the manuscript body.",
    },
    versions: meta.versions.map((v) => ({
      version: v.version,
      commit: v.commit,
      createdAt: v.createdAt,
      summary: v.summary,
    })),
  };
}

let cached: DemoArticle[] | null = null;

export function loadPublishedArticles(): DemoArticle[] {
  if (cached) {
    return cached;
  }

  if (!existsSync(CONTENT_ROOT)) {
    cached = [];
    return cached;
  }

  const dirs = readdirSync(CONTENT_ROOT, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  cached = dirs
    .map(loadArticleFromDir)
    .filter((article): article is DemoArticle => article !== null)
    .sort((a, b) => {
      const dateA = a.publishedAt ?? "";
      const dateB = b.publishedAt ?? "";
      return dateB.localeCompare(dateA);
    });

  return cached;
}

export function getPublishedArticle(slug: string) {
  return loadPublishedArticles().find((article) => article.slug === slug);
}

export function getPublishedArticleSlugs() {
  return loadPublishedArticles().map((article) => article.slug);
}
