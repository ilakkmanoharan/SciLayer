import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import {
  getArticleCollectionIndex,
  groupAuthorArticlesByCollection,
  sortArticlesByPublishedDate,
} from "@/lib/article-catalog";
import { demoArticles } from "@/lib/demo-data";
import { pointValues } from "@/lib/points";

function formatPublishedDate(isoDate?: string) {
  if (!isoDate) {
    return "Date pending";
  }

  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function generateStaticParams() {
  const orcids = new Set<string>();
  for (const article of demoArticles) {
    for (const author of article.authors) {
      orcids.add(author.orcid);
    }
  }
  return Array.from(orcids).map((orcid) => ({ orcid }));
}

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ orcid: string }>;
}) {
  const { orcid } = await params;
  const authorArticles = sortArticlesByPublishedDate(
    demoArticles.filter((article) => article.authors.some((author) => author.orcid === orcid)),
  );
  const grouped = groupAuthorArticlesByCollection(authorArticles);
  const author = authorArticles[0]?.authors.find((item) => item.orcid === orcid);
  const points =
    authorArticles.length * pointValues.submitValidManuscript +
    authorArticles.filter((article) => article.status === "published_preprint").length *
      pointValues.publishPreprint;

  return (
    <PageShell
      eyebrow="Author profile"
      title={author?.name ?? "SciLayer author"}
      description="Publications grouped by research program and sorted by publication date."
    >
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Researcher ID</p>
          <p className="mt-2 font-mono text-sm text-slate-700">{orcid}</p>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-cyan-700">
            Affiliation
          </p>
          <p className="mt-2 text-slate-700">{author?.affiliation ?? "Pending profile sync"}</p>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-cyan-700">
            Publications
          </p>
          <p className="mt-2 text-4xl font-black text-slate-950">{authorArticles.length}</p>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-cyan-700">Points</p>
          <p className="mt-2 text-4xl font-black text-slate-950">{points}</p>
        </aside>

        <section className="grid gap-10">
          {grouped.length ? (
            grouped.map(({ collection, articles }) => (
              <div key={collection?.id ?? "other"}>
                <div className="mb-5 border-b border-slate-200 pb-4">
                  <h2 className="text-2xl font-black text-slate-950">
                    {collection?.title ?? "Other articles"}
                  </h2>
                  {collection?.description ? (
                    <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600">
                      {collection.description}
                    </p>
                  ) : null}
                  <p className="mt-2 text-sm font-bold text-slate-500">
                    {articles.length} article{articles.length === 1 ? "" : "s"} · newest first
                  </p>
                </div>
                <div className="grid gap-4">
                  {articles.map((article) => {
                    const phaseIndex =
                      collection?.id === "asra-phases"
                        ? getArticleCollectionIndex(article.slug)
                        : undefined;

                    return (
                      <article
                        key={article.slug}
                        className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
                      >
                        <div className="flex flex-wrap items-center gap-3">
                          <time
                            dateTime={article.publishedAt}
                            className="rounded-full bg-cyan-50 px-3 py-1 text-xs font-bold text-cyan-800"
                          >
                            {formatPublishedDate(article.publishedAt)}
                          </time>
                          {phaseIndex !== undefined ? (
                            <span className="rounded-full bg-slate-900 px-3 py-1 text-xs font-bold text-white">
                              Phase {phaseIndex + 1}
                            </span>
                          ) : null}
                          <StatusBadge status={article.status} />
                          <span className="text-sm text-slate-500">{article.articleType}</span>
                          {article.journal ? (
                            <span className="text-sm text-slate-500">{article.journal}</span>
                          ) : null}
                        </div>
                        <h3 className="mt-4 text-2xl font-black text-slate-950">
                          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                        </h3>
                        <p className="mt-3 leading-7 text-slate-600">{article.abstract}</p>
                        <div className="mt-4 flex flex-wrap gap-2">
                          {article.classification.tags.slice(0, 5).map((tag) => (
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
                  })}
                </div>
              </div>
            ))
          ) : (
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              No articles found for this researcher yet.
            </div>
          )}
        </section>
      </div>
    </PageShell>
  );
}
