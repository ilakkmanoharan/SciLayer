import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { requireAuth } from "@/lib/auth/user";

export default async function DashboardPage() {
  const user = await requireAuth();

  return (
    <PageShell
      eyebrow="Dashboard"
      title={`Welcome, ${user.name}`}
      description="Track submissions, reviews, and publication status for your scientific papers."
    >
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Link
          href="/submissions"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-cyan-300"
        >
          <h2 className="text-xl font-black text-slate-950">Submissions</h2>
          <p className="mt-2 text-sm text-slate-600">Submit and manage manuscripts.</p>
        </Link>
        <Link
          href="/reviews"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-cyan-300"
        >
          <h2 className="text-xl font-black text-slate-950">Reviews</h2>
          <p className="mt-2 text-sm text-slate-600">View assigned peer reviews.</p>
        </Link>
        <Link
          href="/settings"
          className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm hover:border-cyan-300"
        >
          <h2 className="text-xl font-black text-slate-950">Settings</h2>
          <p className="mt-2 text-sm text-slate-600">Researcher profile and account.</p>
        </Link>
      </div>
      <section className="mt-8 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-lg font-black text-slate-950">Your researcher identity</h2>
        <dl className="mt-4 space-y-3 text-sm text-slate-700">
          <div>
            <dt className="font-bold">Name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="font-bold">ORCID iD</dt>
            <dd>
              <Link
                href={`https://orcid.org/${user.orcidId}`}
                className="font-mono text-cyan-700 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                {user.orcidId}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-bold">Author profile</dt>
            <dd>
              <Link href={`/authors/${user.orcidId}`} className="font-bold text-cyan-700 hover:underline">
                View all publications by category
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-bold">Role</dt>
            <dd className="capitalize">{user.role.toLowerCase()}</dd>
          </div>
        </dl>
      </section>
    </PageShell>
  );
}
