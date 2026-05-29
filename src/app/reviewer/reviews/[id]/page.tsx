import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getInvitationStatus } from "@/lib/reviewer-invitations";
import { getSubmission } from "@/lib/submissions/store";

function manuscriptFileUrl(submissionId: string, storedName: string) {
  return `/api/submissions/${submissionId}/files/${encodeURIComponent(storedName)}`;
}

export default async function ReviewWorkspacePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getSubmission(id);
  const status = await getInvitationStatus(id);

  if (!submission) {
    notFound();
  }

  if (status !== "accepted") {
    redirect(`/reviewer?invited=${encodeURIComponent(id)}`);
  }

  const manuscript =
    submission.files.find((f) => f.field === "manuscript") ??
    submission.files.find((f) => f.field === "manuscriptPdf");
  const supplementary = submission.files.filter((f) => f.field === "supplementary");
  const figures = submission.files.filter((f) => f.field === "figuresTables");
  const graphic = submission.files.find((f) => f.field === "graphicAbstract");
  const isPdf = manuscript?.mimeType === "application/pdf" || manuscript?.originalName.endsWith(".pdf");

  return (
    <PageShell
      eyebrow="Review workspace"
      title={submission.title}
      description="Read the uploaded manuscript and supporting files before submitting your recommendation."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/reviewer"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800"
        >
          Back to invitations
        </Link>
        {submission.githubArchiveUrl ? (
          <Link
            href={submission.githubArchiveUrl}
            target="_blank"
            rel="noreferrer"
            className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800"
          >
            SciLayer GitHub archive
          </Link>
        ) : null}
      </div>

      <div className="mb-6 rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
        <p>
          <strong>Article type:</strong> {submission.articleType}
        </p>
        <p>
          <strong>Author:</strong> {submission.authorName}
        </p>
        <p>
          <strong>Journal target:</strong> {submission.journalTarget}
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <article className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="px-4 pt-4 text-xl font-black text-slate-950">Manuscript</h2>
          {manuscript && isPdf ? (
            <iframe
              title="Manuscript PDF"
              src={manuscriptFileUrl(submission.id, manuscript.storedName)}
              className="mt-4 h-[70vh] w-full rounded-2xl border border-slate-200"
            />
          ) : manuscript ? (
            <div className="p-4">
              <p className="text-sm text-slate-600">
                Preview not available for this file type. Download to review:
              </p>
              <a
                href={manuscriptFileUrl(submission.id, manuscript.storedName)}
                className="mt-3 inline-flex font-bold text-cyan-700 hover:underline"
              >
                {manuscript.originalName}
              </a>
            </div>
          ) : (
            <p className="p-4 text-slate-600">No manuscript file found.</p>
          )}
          <div className="border-t border-slate-100 p-4">
            <h3 className="font-bold text-slate-950">Abstract</h3>
            <p className="mt-2 text-sm leading-6 text-slate-700">{submission.abstract}</p>
          </div>
        </article>

        <aside className="space-y-5">
          {submission.coverLetter ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Cover letter</h2>
              <pre className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
                {submission.coverLetter}
              </pre>
            </section>
          ) : null}

          {supplementary.length ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Supplementary files</h2>
              <ul className="mt-4 space-y-2">
                {supplementary.map((file) => (
                  <li key={file.storedName}>
                    <a
                      href={manuscriptFileUrl(submission.id, file.storedName)}
                      className="font-bold text-cyan-700 hover:underline"
                    >
                      {file.originalName}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {figures.length ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Figures and tables</h2>
              <ul className="mt-4 space-y-2">
                {figures.map((file) => (
                  <li key={file.storedName}>
                    <a
                      href={manuscriptFileUrl(submission.id, file.storedName)}
                      className="font-bold text-cyan-700 hover:underline"
                    >
                      {file.originalName}
                    </a>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}

          {graphic ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Graphic abstract</h2>
              <a
                href={manuscriptFileUrl(submission.id, graphic.storedName)}
                className="mt-3 inline-flex font-bold text-cyan-700 hover:underline"
              >
                {graphic.originalName}
              </a>
            </section>
          ) : null}

          {submission.relatedWebsites.length ? (
            <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-lg font-black text-slate-950">Related websites</h2>
              <ul className="mt-4 space-y-3 text-sm">
                {submission.relatedWebsites.map((site) => (
                  <li key={site.url}>
                    <a href={site.url} className="font-bold text-cyan-700 hover:underline" target="_blank" rel="noreferrer">
                      {site.url}
                    </a>
                    <p className="mt-1 text-slate-600">{site.description}</p>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </aside>
      </div>
    </PageShell>
  );
}
