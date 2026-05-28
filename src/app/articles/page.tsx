import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { demoArticles } from "@/lib/demo-data";

export default function ArticlesPage() {
  return (
    <PageShell
      eyebrow="Discovery"
      title="Browse articles"
      description="Preprints and accepted journal articles appear here after validation, moderation, and reviewer approval."
    >
      <div className="grid gap-5">
        {demoArticles.map((article) => (
          <article key={article.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-wrap items-center gap-3">
              <StatusBadge status={article.status} />
              <span className="text-sm text-slate-500">v{article.version}</span>
              <span className="text-sm text-slate-500">{article.license}</span>
            </div>
            <h2 className="mt-4 text-2xl font-black text-slate-950">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
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
        ))}
      </div>
    </PageShell>
  );
}
