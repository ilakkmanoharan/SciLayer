import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { demoArticles } from "@/lib/demo-data";

export default async function TagPage({
  params,
}: {
  params: Promise<{ tag: string }>;
}) {
  const { tag } = await params;
  const decodedTag = decodeURIComponent(tag);
  const articles = demoArticles.filter((article) =>
    article.classification.tags.includes(decodedTag),
  );

  return (
    <PageShell
      eyebrow="Tag"
      title={decodedTag}
      description="Tag pages collect manuscripts that share classification tags or author-provided keywords."
    >
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
