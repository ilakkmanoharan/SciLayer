import Link from "next/link";
import { notFound } from "next/navigation";
import { PageShell } from "@/components/page-shell";
import { getArticle } from "@/lib/demo-data";

export default async function ArticleVersionsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  return (
    <PageShell
      eyebrow="Versioning"
      title={`${article.title}: history`}
      description="Every SciLayer manuscript keeps a version record with the source commit and metadata snapshot."
    >
      <div className="grid gap-4">
        {article.versions.map((version) => (
          <section key={version.version} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
              Version {version.version}
            </p>
            <h2 className="mt-2 text-xl font-black text-slate-950">{version.summary}</h2>
            <p className="mt-2 text-sm text-slate-600">
              Commit {version.commit} on {version.createdAt}
            </p>
          </section>
        ))}
      </div>
      <Link
        href={`/articles/${article.slug}`}
        className="mt-6 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800"
      >
        Back to article
      </Link>
    </PageShell>
  );
}
