import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { requireAuth } from "@/lib/auth/user";

export default async function SubmissionsPage() {
  await requireAuth();

  return (
    <PageShell
      eyebrow="Submissions"
      title="Your manuscripts"
      description="Prepare manuscripts in GitHub, then submit them for validation, classification, and review."
    >
      <div className="flex flex-wrap gap-3">
        <Link
          href="/submit"
          className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Submission instructions
        </Link>
        <Link
          href="/submit/github"
          className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:border-slate-950"
        >
          Submit GitHub URL
        </Link>
      </div>
    </PageShell>
  );
}
