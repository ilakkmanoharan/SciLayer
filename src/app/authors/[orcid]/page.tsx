import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { AuthorAvatar } from "@/components/author-avatar";
import { PageShell } from "@/components/page-shell";
import {
  getArticleCollectionIndex,
  groupAuthorArticlesByCollection,
} from "@/lib/article-catalog";
import { getArticlesByAuthor, getAuthorByOrcid } from "@/lib/authors";
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
  const authorProfile = getAuthorByOrcid(orcid);
  const authorArticles = getArticlesByAuthor(orcid);
  const grouped = groupAuthorArticlesByCollection(authorArticles);
  const points =
    authorArticles.length * pointValues.submitValidManuscript +
    authorArticles.filter((article) => article.status === "published_preprint").length *
      pointValues.publishPreprint;

  return (
    <PageShell
      eyebrow="Author profile"
      title={authorProfile?.name ?? "SciLayer author"}
      description="Publications grouped by research program and sorted by publication date."
    >
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm lg:sticky lg:top-6 lg:self-start">
          <div className="flex items-center gap-4">
            <AuthorAvatar name={authorProfile?.name ?? "Author"} size="lg" />
            <div>
              <p className="text-lg font-black text-slate-950">{authorProfile?.name ?? "Unknown author"}</p>
              <Link
                href={`https://orcid.org/${orcid}`}
                className="mt-1 inline-block font-mono text-xs text-cyan-700 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {orcid}
              </Link>
            </div>
          </div>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-cyan-700">Affiliation</p>
          <p className="mt-2 text-slate-700">{authorProfile?.affiliation ?? "Pending profile sync"}</p>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-cyan-700">Publications</p>
          <p className="mt-2 text-4xl font-black text-slate-950">{authorArticles.length}</p>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-cyan-700">Points</p>
          <p className="mt-2 text-4xl font-black text-slate-950">{points}</p>
          <Link
            href="/authors"
            className="mt-6 inline-block text-sm font-bold text-cyan-700 hover:underline"
          >
            ← All authors
          </Link>
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
                        </div>
                        <h3 className="mt-4 text-2xl font-black text-slate-950">
                          <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                        </h3>
                        <p className="mt-3 leading-7 text-slate-600">{article.abstract}</p>
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
