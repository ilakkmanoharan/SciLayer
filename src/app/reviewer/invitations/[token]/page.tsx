import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getSubmission } from "@/lib/submissions/store";
import { submissionIdFromInvitationToken } from "@/lib/reviewer-invitations";

export default async function ReviewInvitationLandingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const submissionId = submissionIdFromInvitationToken(token);

  if (!submissionId) {
    notFound();
  }

  const submission = await getSubmission(submissionId);

  if (!submission) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Review invitation"
      title="You have a new review invitation"
      description="Open the reviewer dashboard to accept or decline this assignment."
    >
      <section className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
          {submission.articleType}
        </p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">{submission.title}</h2>
        <p className="mt-3 text-slate-600">{submission.abstract}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/reviewer?invited=${encodeURIComponent(submission.id)}`}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Open reviewer dashboard
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
