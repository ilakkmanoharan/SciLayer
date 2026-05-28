import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { demoJournals } from "@/lib/demo-data";

export default function JournalsPage() {
  return (
    <PageShell
      eyebrow="Journals"
      title="SciLayer journal collections"
      description="Journals organize accepted articles by editorial scope and support ISSN-ready metadata, reviewers, and editor decisions."
    >
      <div className="grid gap-5 md:grid-cols-2">
        {demoJournals.map((journal) => (
          <article key={journal.slug} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-2xl font-black text-slate-950">
              <Link href={`/journals/${journal.slug}`}>{journal.name}</Link>
            </h2>
            <p className="mt-3 text-slate-600">{journal.description}</p>
            <p className="mt-4 text-sm font-medium text-slate-500">{journal.scope}</p>
          </article>
        ))}
      </div>
    </PageShell>
  );
}
