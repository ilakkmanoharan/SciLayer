import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { demoArticles } from "@/lib/demo-data";

export default function SearchPage({
  searchParams,
}: {
  searchParams?: { q?: string };
}) {
  const query = searchParams?.q?.toLowerCase() ?? "";
  const articles = query
    ? demoArticles.filter((article) =>
        [article.title, article.abstract, article.classification.tags.join(" ")]
          .join(" ")
          .toLowerCase()
          .includes(query),
      )
    : demoArticles;

  return (
    <PageShell
      eyebrow="Semantic discovery"
      title="Search SciLayer"
      description="The MVP uses keyword search over titles, abstracts, and tags. PostgreSQL full-text search is the next backend step, with pgvector later."
    >
      <form className="mb-6 flex max-w-2xl gap-3">
        <input
          name="q"
          defaultValue={searchParams?.q}
          placeholder="Search articles, tags, authors..."
          className="w-full rounded-full border border-slate-300 px-5 py-3 outline-none ring-cyan-500 focus:ring-2"
        />
        <button className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white">
          Search
        </button>
      </form>
      <div className="grid gap-4">
        {articles.map((article) => (
          <article key={article.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="mt-3 text-slate-600">{article.abstract}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
