import Link from "next/link";
import { notFound } from "next/navigation";
import { StatusBadge } from "@/components/status-badge";
import { getAllArticleSlugs, getArticle } from "@/lib/demo-data";
import { renderMarkdown } from "@/lib/markdown";

export async function generateStaticParams() {
  return getAllArticleSlugs().map((slug) => ({ slug }));
}

export default async function ArticlePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const article = getArticle(slug);

  if (!article) {
    notFound();
  }

  const renderedHtml = await renderMarkdown(article.manuscriptMd);

  return (
    <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 lg:grid-cols-[1fr_22rem]">
      <article className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <StatusBadge status={article.status} />
        <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-950">{article.title}</h1>
        <p className="mt-4 text-lg leading-8 text-slate-600">{article.abstract}</p>
        <div className="mt-5 text-sm text-slate-600">
          {article.authors.map((author) => (
            <Link key={author.orcid} href={`/authors/${author.orcid}`} className="mr-3 font-bold text-cyan-700">
              {author.name}
            </Link>
          ))}
          <span className="mt-2 block text-slate-500">
            Version {article.version}
            {article.publishedAt ? ` · Published ${article.publishedAt}` : null}
          </span>
        </div>
        <div
          className="prose prose-slate mt-10 max-w-none"
          dangerouslySetInnerHTML={{ __html: renderedHtml }}
        />
      </article>

      <aside className="space-y-5">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Metadata</h2>
          <dl className="mt-4 space-y-3 text-sm text-slate-700">
            <div>
              <dt className="font-bold">Article type</dt>
              <dd>{article.articleType}</dd>
            </div>
            <div>
              <dt className="font-bold">Classification</dt>
              <dd>
                {article.classification.field} / {article.classification.subfield}
              </dd>
            </div>
            <div>
              <dt className="font-bold">GitHub source</dt>
              <dd className="break-words">{article.githubUrl}</dd>
            </div>
            <div>
              <dt className="font-bold">Engagement</dt>
              <dd>
                {article.views} views, {article.downloads} downloads
              </dd>
            </div>
          </dl>
          <Link
            href={`/articles/${article.slug}/versions`}
            className="mt-5 inline-flex rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800"
          >
            View versions
          </Link>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-lg font-black text-slate-950">Tags</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {article.classification.tags.map((tag) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">
                {tag}
              </Link>
            ))}
          </div>
        </section>
      </aside>
    </main>
  );
}
