import Link from "next/link";
import { StatusBadge } from "@/components/status-badge";
import { demoArticles } from "@/lib/demo-data";

const capabilities = [
  "Research articles",
  "Preprints",
  "Reviews",
  "Methods papers",
  "Datasets",
  "All scientific fields",
];

export default function HomePage() {
  const featured = demoArticles[0];

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
          </div>
        </div>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <StatusBadge status={featured.status} />
          <h2 className="mt-4 text-2xl font-black text-slate-950">{featured.title}</h2>
          <p className="mt-3 text-sm leading-6 text-slate-600">{featured.abstract}</p>
          <div className="mt-5 grid gap-3 text-sm text-slate-700">
            <p>
              <strong>Classification:</strong> {featured.classification.field} /{" "}
              {featured.classification.subfield}
            </p>
            <p>
              <strong>Tags:</strong> {featured.classification.tags.join(", ")}
            </p>
            <p>
              <strong>Version:</strong> v{featured.version}
            </p>
          </div>
        </div>
      </section>

      <section className="mt-16 grid gap-4 md:grid-cols-3">
        {capabilities.map((capability) => (
          <div key={capability} className="rounded-2xl border border-slate-200 bg-white p-5">
            <p className="font-bold text-slate-950">{capability}</p>
          </div>
        ))}
      </section>
    </main>
  );
}
