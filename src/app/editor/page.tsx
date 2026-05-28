import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { StatusBadge } from "@/components/status-badge";
import { demoArticles } from "@/lib/demo-data";

export default function EditorDashboardPage() {
  return (
    <PageShell
      eyebrow="Editor dashboard"
      title="Moderation and publication decisions"
      description="Editors assign reviewers, override classification, and move approved manuscripts into preprint or journal publication."
    >
      <div className="grid gap-5">
        {demoArticles.map((article) => (
          <section key={article.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <StatusBadge status={article.status} />
            <h2 className="mt-3 text-2xl font-black text-slate-950">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            <div className="mt-4 grid gap-3 text-sm text-slate-700 md:grid-cols-3">
              <p>
                <strong>Field:</strong> {article.classification.field}
              </p>
              <p>
                <strong>Subfield:</strong> {article.classification.subfield}
              </p>
              <p>
                <strong>Journal fit:</strong> {article.classification.journalFit}
              </p>
            </div>
            <div className="mt-5 flex flex-wrap gap-2">
              {["Assign reviewers", "Override classification", "Approve preprint", "Request changes"].map((action) => (
                <button key={action} className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800">
                  {action}
                </button>
              ))}
            </div>
          </section>
        ))}
      </div>
    </PageShell>
  );
}
