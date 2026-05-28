import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getArticle } from "@/lib/demo-data";
import { renderMarkdown } from "@/lib/markdown";
import { getInvitationStatus } from "@/lib/reviewer-invitations";

export default async function ReviewWorkspacePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);
  const status = await getInvitationStatus(slug);

  if (!article) {
    notFound();
  }

  if (status !== "accepted") {
    redirect(`/reviewer?invited=${encodeURIComponent(slug)}`);
  }

  const renderedHtml = await renderMarkdown(article.manuscriptMd);
  const materials = article.supportingMaterials;

  return (
    <PageShell
      eyebrow="Review workspace"
      title={article.title}
      description="Read the manuscript and supporting files before submitting your recommendation."
    >
      <div className="mb-6 flex flex-wrap gap-3">
        <Link
          href="/reviewer"
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800"
        >
          Back to invitations
        </Link>
        <Link
          href={`/articles/${article.slug}`}
          className="rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800"
        >
          Public article page
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem]">
        <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Manuscript</h2>
          <div
            className="prose prose-slate mt-6 max-w-none"
            dangerouslySetInnerHTML={{ __html: renderedHtml }}
          />
        </article>

        <aside className="space-y-5">
          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Cover letter</h2>
            <pre className="mt-4 whitespace-pre-wrap text-sm leading-6 text-slate-700">
              {materials.coverLetter}
            </pre>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Supplementary files</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {materials.supplementary.map((file) => (
                <li key={file.name}>
                  <p className="font-bold text-slate-950">{file.name}</p>
                  <p>{file.description}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">Figures</h2>
            <ul className="mt-4 space-y-3 text-sm text-slate-700">
              {materials.figures.map((figure) => (
                <li key={figure.name}>
                  <p className="font-bold text-slate-950">{figure.name}</p>
                  <p>{figure.caption}</p>
                </li>
              ))}
            </ul>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-black text-slate-950">References</h2>
            <p className="mt-4 text-sm text-slate-700">{materials.referencesNote}</p>
            <p className="mt-2 text-sm text-slate-500">
              GitHub source: {article.githubUrl}
            </p>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}
