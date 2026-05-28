import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getArticle } from "@/lib/demo-data";
import { slugFromInvitationToken } from "@/lib/reviewer-invitations";

export default async function ReviewInvitationLandingPage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;
  const slug = slugFromInvitationToken(token);

  if (!slug) {
    notFound();
  }

  const article = getArticle(slug);
  if (!article) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Review invitation"
      title="You have a new review invitation"
      description="SciLayer will take you to the reviewer dashboard where you can accept or decline this assignment."
    >
      <section className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Manuscript</p>
        <h2 className="mt-2 text-2xl font-black text-slate-950">{article.title}</h2>
        <p className="mt-3 text-slate-600">{article.abstract}</p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href={`/reviewer?invited=${encodeURIComponent(slug)}`}
            className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
          >
            Open reviewer dashboard
          </Link>
          <Link
            href="/login?next=/reviewer"
            className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800"
          >
            Log in first
          </Link>
        </div>
      </section>
    </PageShell>
  );
}
