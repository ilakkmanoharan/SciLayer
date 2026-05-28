import { PageShell } from "@/components/page-shell";
import { articleStatuses, taxonomy } from "@/lib/taxonomy";

export default function AdminDashboardPage() {
  return (
    <PageShell
      eyebrow="Admin dashboard"
      title="Platform operations"
      description="Admins manage users, journals, moderation queues, abuse reports, and the classification taxonomy."
    >
      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Article lifecycle</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {articleStatuses.map((status) => (
              <span key={status} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {status}
              </span>
            ))}
          </div>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Taxonomy</h2>
          <div className="mt-4 space-y-4">
            {taxonomy.map((entry) => (
              <div key={entry.field}>
                <p className="font-bold text-slate-950">{entry.field}</p>
                <p className="text-sm text-slate-600">{entry.subfields.join(", ")}</p>
              </div>
            ))}
          </div>
        </section>
      </div>
    </PageShell>
  );
}
