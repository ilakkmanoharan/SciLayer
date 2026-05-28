import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { requireAuth } from "@/lib/auth/user";

export default async function SettingsPage() {
  const user = await requireAuth();

  return (
    <PageShell
      eyebrow="Settings"
      title="Account settings"
      description="Manage your researcher profile linked to your ORCID iD."
    >
      <section className="max-w-xl rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <dl className="space-y-4 text-sm text-slate-700">
          <div>
            <dt className="font-bold text-slate-950">Display name</dt>
            <dd>{user.name}</dd>
          </div>
          <div>
            <dt className="font-bold text-slate-950">ORCID profile</dt>
            <dd>
              <Link
                href={`https://orcid.org/${user.orcidId}`}
                className="text-cyan-700 hover:underline"
                target="_blank"
                rel="noreferrer"
              >
                https://orcid.org/{user.orcidId}
              </Link>
            </dd>
          </div>
          <div>
            <dt className="font-bold text-slate-950">Platform role</dt>
            <dd className="capitalize">{user.role.toLowerCase()}</dd>
          </div>
        </dl>
        <form action="/api/auth/logout" method="post" className="mt-6">
          <button
            type="submit"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:border-slate-950"
          >
            Log out
          </button>
        </form>
      </section>
    </PageShell>
  );
}
