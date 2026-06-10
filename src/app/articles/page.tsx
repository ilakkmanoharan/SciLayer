import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { groupArticlesByCollection } from "@/lib/article-catalog";
import { demoArticles } from "@/lib/demo-data";

function ArticleCard({
  article,
  indexLabel,
}: {
  article: (typeof demoArticles)[number];
  indexLabel?: string;
}) {
  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-center gap-3">
        {indexLabel ? (
          <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
            {indexLabel}
          </span>
        ) : null}
        <StatusBadge status={article.status} />
        <span className="text-sm text-slate-500">v{article.version}</span>
        <span className="text-sm text-slate-500">{article.license}</span>
        <span className="text-sm text-slate-500">{article.articleType}</span>
      </div>
      <h3 className="mt-4 text-2xl font-black text-slate-950">
        <Link href={`/articles/${article.slug}`}>{article.title}</Link>
      </h3>
      <p className="mt-3 max-w-3xl leading-7 text-slate-600">{article.abstract}</p>
      <div className="mt-4 flex flex-wrap gap-2">
        {article.classification.tags.map((tag) => (
          <Link
            key={tag}
            href={`/tags/${encodeURIComponent(tag)}`}
            className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700"
          >
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}

export default function ArticlesPage() {
  const grouped = groupArticlesByCollection(demoArticles);

  return (
    <PageShell
      eyebrow="Discovery"
      title="Browse articles"
      description="Preprints and accepted journal articles, grouped by research program. Catalog defined in content/articles/catalog.json."
    >
      <div className="grid gap-12">
        {grouped.map(({ collection, articles }) => (
          <section key={collection?.id ?? "other"}>
            <div className="mb-5 border-b border-slate-200 pb-4">
              <h2 className="text-3xl font-black text-slate-950">
                {collection?.title ?? "Other articles"}
              </h2>
              {collection?.description ? (
                <p className="mt-2 max-w-3xl leading-7 text-slate-600">{collection.description}</p>
              ) : null}
            </div>
            <div className="grid gap-5">
              {articles.map((article, index) => (
                <ArticleCard
                  key={article.slug}
                  article={article}
                  indexLabel={
                    collection?.id === "asra-phases"
                      ? `Phase ${index + 1}`
                      : undefined
                  }
                />
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
