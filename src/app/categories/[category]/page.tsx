import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { demoArticles } from "@/lib/demo-data";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category);
  const articles = demoArticles.filter(
    (article) => article.classification.field === decodedCategory,
  );

  return (
    <PageShell
      eyebrow="Category"
      title={decodedCategory}
      description="Category pages provide taxonomy-driven discovery across fields and subfields."
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
