import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { demoArticles } from "@/lib/demo-data";

const reviewActions = ["Accept invitation", "Decline", "Approve", "Request changes", "Reject"];

export default function ReviewerDashboardPage() {
  return (
    <PageShell
      eyebrow="Reviewer dashboard"
      title="Review invitations"
      description="Reviewers receive secure email links and can accept, decline, or submit recommendations from this workspace."
    >
      <div className="grid gap-5">
        {demoArticles.map((article) => (
          <section key={article.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Invited</p>
            <h2 className="mt-2 text-2xl font-black text-slate-950">
              <Link href={`/articles/${article.slug}`}>{article.title}</Link>
            </h2>
            <p className="mt-3 text-slate-600">{article.abstract}</p>
            <div className="mt-5 flex flex-wrap gap-2">
              {reviewActions.map((action) => (
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
