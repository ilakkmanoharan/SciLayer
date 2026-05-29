import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { requireAuth } from "@/lib/auth/user";
import { listSubmissionsForAuthor } from "@/lib/submissions/store";

export default async function SubmissionsPage({
  searchParams,
}: {
  searchParams?: Promise<{ submitted?: string }>;
}) {
  const user = await requireAuth();
  const params = await searchParams;
  const submissions = await listSubmissionsForAuthor(user.orcidId);

  return (
    <PageShell
      eyebrow="Submissions"
      title="Your manuscripts"
      description="Track uploaded manuscript packets and SciLayer GitHub archive links."
    >
      {params?.submitted ? (
        <div className="mb-6 rounded-2xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-950">
          Manuscript uploaded successfully. Reviewers can now access your files in the review
          workspace.
        </div>
      ) : null}

      <Link
        href="/submissions/upload"
        className="mb-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
      >
        Upload new manuscript
      </Link>

      <div className="grid gap-4">
        {submissions.length ? (
          submissions.map((submission) => (
            <article
              key={submission.id}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                {submission.articleType} · {submission.status.replaceAll("_", " ")}
              </p>
              <h2 className="mt-2 text-2xl font-black text-slate-950">{submission.title}</h2>
              <p className="mt-3 text-slate-600">{submission.abstract}</p>
              <p className="mt-3 text-sm text-slate-500">
                Files: {submission.files.map((f) => f.originalName).join(", ")}
              </p>
              {submission.githubArchiveUrl ? (
                <a
                  href={submission.githubArchiveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-4 inline-flex text-sm font-bold text-cyan-700 hover:underline"
                >
                  View SciLayer GitHub archive
                </a>
              ) : null}
            </article>
          ))
        ) : (
          <div className="rounded-3xl border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-slate-600">No submissions yet.</p>
          </div>
        )}
      </div>
    </PageShell>
  );
}
