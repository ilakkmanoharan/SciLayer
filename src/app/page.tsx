import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { AuthorAvatar } from "@/components/author-avatar";
import { getArticlesByAuthor, getAuthorByOrcid } from "@/lib/authors";
import { demoArticles } from "@/lib/demo-data";

const ILAKK_ORCID = "0009-0008-8073-5416";

const capabilityLinks = [
  { label: "Research articles", href: "/articles", description: "Browse all published research" },
  { label: "Preprints", href: "/articles", description: "Open preprints and working papers" },
  { label: "Reviews", href: "/reviews", description: "Peer review workspace" },
  { label: "Methods papers", href: "/articles", description: "Methods and technical reports" },
  { label: "Datasets", href: "/articles", description: "Data releases and benchmarks" },
  { label: "Authors", href: "/authors", description: "Researcher profiles and publications" },
];

function formatDate(isoDate?: string) {
  if (!isoDate) {
    return "Date pending";
  }
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export default function HomePage() {
  const featured = demoArticles[0];
  const featuredAuthor = getAuthorByOrcid(ILAKK_ORCID);
  const authorArticles = getArticlesByAuthor(ILAKK_ORCID);

  return (
    <main className="mx-auto max-w-7xl px-6 py-12">
      <section className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.2em] text-cyan-700">
            SciLayer v0.1
          </p>
          <h1 className="max-w-4xl text-5xl font-black tracking-tight text-slate-950 md:text-7xl">
            An open archive for scientific papers across every field.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
            SciLayer publishes and organizes preprints, research articles, reviews,
            datasets, and methods papers across the full spectrum of scientific
            research.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              href="/submit"
              className="rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
            >
              Submit Manuscript
            </Link>
            <Link
              href="/articles"
              className="rounded-full border border-slate-300 px-5 py-3 text-sm font-bold text-slate-800 hover:border-slate-950"
            >
              Browse Articles
            </Link>
            <Link
              href="/authors"
              className="rounded-full border border-cyan-300 bg-cyan-50 px-5 py-3 text-sm font-bold text-cyan-900 hover:border-cyan-500"
            >
              Authors
            </Link>
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <StatusBadge status={featured.status} />
          <h2 className="mt-4 text-2xl font-black text-slate-950">
            <Link href={`/articles/${featured.slug}`} className="hover:text-cyan-700">
              {featured.title}
            </Link>
          </h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{featured.abstract}</p>
          <div className="mt-5 grid gap-3 text-sm text-slate-700">
            <p>
              <strong>Classification:</strong> {featured.classification.field} /{" "}
              {featured.classification.subfield}
            </p>
            <p>
              <strong>Tags:</strong> {featured.classification.tags.slice(0, 6).join(", ")}
            </p>
            <p>
              <strong>Version:</strong> v{featured.version}
            </p>
          </div>
        </div>
      </section>

      {featuredAuthor ? (
        <section className="mt-16 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center gap-4 border-b border-slate-100 pb-6">
            <AuthorAvatar name={featuredAuthor.name} size="lg" />
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">Featured author</p>
              <h2 className="mt-1 text-2xl font-black text-slate-950">
                <Link href={`/authors/${featuredAuthor.orcid}`} className="hover:text-cyan-700">
                  {featuredAuthor.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-slate-600">
                ORCID{" "}
                <Link
                  href={`https://orcid.org/${featuredAuthor.orcid}`}
                  className="font-mono font-bold text-cyan-700 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {featuredAuthor.orcid}
                </Link>
                {" · "}
                {featuredAuthor.affiliation}
              </p>
            </div>
            <Link
              href={`/authors/${featuredAuthor.orcid}`}
              className="ml-auto rounded-full border border-slate-300 px-4 py-2 text-sm font-bold text-slate-800 hover:border-slate-950"
            >
              View profile
            </Link>
          </div>

          <div className="mt-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <h3 className="text-xl font-black text-slate-950">
                <Link href="/articles" className="hover:text-cyan-700">
                  Research articles
                </Link>
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {authorArticles.length} published preprints · newest first
              </p>
            </div>
            <Link href="/articles" className="text-sm font-bold text-cyan-700 hover:underline">
              Browse all SciLayer articles →
            </Link>
          </div>

          <ul className="mt-5 divide-y divide-slate-100">
            {authorArticles.map((article) => (
              <li key={article.slug} className="flex flex-wrap items-start gap-3 py-4 first:pt-0">
                <time
                  dateTime={article.publishedAt}
                  className="mt-0.5 shrink-0 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600"
                >
                  {formatDate(article.publishedAt)}
                </time>
                <div className="min-w-0 flex-1">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="font-bold text-slate-950 hover:text-cyan-700"
                  >
                    {article.title}
                  </Link>
                  <p className="mt-1 line-clamp-2 text-sm leading-6 text-slate-600">{article.abstract}</p>
                </div>
                <StatusBadge status={article.status} />
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {capabilityLinks.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="rounded-2xl border border-slate-200 bg-white p-5 transition hover:border-cyan-300 hover:shadow-sm"
          >
            <p className="font-bold text-slate-950">{item.label}</p>
            <p className="mt-2 text-sm text-slate-600">{item.description}</p>
          </Link>
        ))}
      </section>
    </main>
  );
}
