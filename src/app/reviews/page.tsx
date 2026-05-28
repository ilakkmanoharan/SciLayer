import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { requireAuth } from "@/lib/auth/user";

export default async function ReviewsPage() {
  await requireAuth();

  return (
    <PageShell
      eyebrow="Reviews"
      title="Peer review assignments"
      description="Access manuscripts assigned to you and submit recommendations."
    >
      <Link
        href="/reviewer"
        className="inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
      >
        Open reviewer workspace
      </Link>
    </PageShell>
  );
}
