import Link from "next/link";
import { AuthorAvatar } from "@/components/author-avatar";
import { PageShell } from "@/components/page-shell";
import { getAllAuthors } from "@/lib/authors";

export default function AuthorsPage() {
  const authors = getAllAuthors();

  return (
    <PageShell
      eyebrow="Directory"
      title="Authors"
      description="Public researcher profiles and publication lists. No login required."
    >
      <div className="grid gap-4">
        {authors.map((author) => (
          <article
            key={author.orcid}
            className="flex flex-wrap items-center gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
          >
            <AuthorAvatar name={author.name} size="lg" />
            <div className="min-w-0 flex-1">
              <h2 className="text-2xl font-black text-slate-950">
                <Link href={`/authors/${author.orcid}`} className="hover:text-cyan-700">
                  {author.name}
                </Link>
              </h2>
              <p className="mt-1 text-sm text-slate-600">{author.affiliation}</p>
              <p className="mt-2 font-mono text-sm text-slate-500">
                ORCID{" "}
                <Link
                  href={`https://orcid.org/${author.orcid}`}
                  className="text-cyan-700 hover:underline"
                  target="_blank"
                  rel="noreferrer"
                >
                  {author.orcid}
                </Link>
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-slate-950">{author.articleCount}</p>
              <p className="text-sm font-bold text-slate-500">
                article{author.articleCount === 1 ? "" : "s"}
              </p>
              <Link
                href={`/authors/${author.orcid}`}
                className="mt-3 inline-block text-sm font-bold text-cyan-700 hover:underline"
              >
                View profile →
              </Link>
            </div>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
