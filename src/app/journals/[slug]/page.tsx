import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { demoArticles, getJournal } from "@/lib/demo-data";

export default async function JournalPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const journal = getJournal(slug);

  if (!journal) {
    notFound();
  }

  const articles = demoArticles.filter((article) => article.journal === journal.name);

  return (
    <PageShell eyebrow="Journal" title={journal.name} description={journal.scope}>
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Scope</h2>
        <p className="mt-3 text-slate-600">{journal.description}</p>
      </section>
      <section className="mt-6 grid gap-4">
        {articles.map((article) => (
          <article key={article.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <StatusBadge status={article.status} />
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="mt-2 text-slate-600">{article.abstract}</p>
          </article>
        ))}
      </section>
    </PageShell>
  );
}
