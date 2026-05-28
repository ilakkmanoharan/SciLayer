import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { demoArticles } from "@/lib/demo-data";
import { pointValues } from "@/lib/points";

export default async function AuthorPage({
  params,
}: {
  params: Promise<{ orcid: string }>;
}) {
  const { orcid } = await params;
  const articles = demoArticles.filter((article) =>
    article.authors.some((author) => author.orcid === orcid),
  );
  const author = articles[0]?.authors.find((item) => item.orcid === orcid);
  const points =
    articles.length * pointValues.submitValidManuscript +
    articles.filter((article) => article.status === "published_preprint").length *
      pointValues.publishPreprint;

  return (
    <PageShell
      eyebrow="Author profile"
      title={author?.name ?? "SciLayer author"}
      description="Author profiles collect publication activity, article history, affiliations, and public scholarly output."
    >
      <div className="grid gap-6 lg:grid-cols-[20rem_1fr]">
        <aside className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Researcher ID</p>
          <p className="mt-2 font-mono text-sm text-slate-700">{orcid}</p>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-cyan-700">
            Affiliation
          </p>
          <p className="mt-2 text-slate-700">{author?.affiliation ?? "Pending profile sync"}</p>
          <p className="mt-5 text-sm font-bold uppercase tracking-wide text-cyan-700">Points</p>
          <p className="mt-2 text-4xl font-black text-slate-950">{points}</p>
        </aside>
        <section className="grid gap-4">
          {articles.length ? (
            articles.map((article) => (
              <article key={article.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-2xl font-black text-slate-950">
                  <Link href={`/articles/${article.slug}`}>{article.title}</Link>
                </h2>
                <p className="mt-3 text-slate-600">{article.abstract}</p>
              </article>
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
