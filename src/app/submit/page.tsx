import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { metadataExample, submissionInstructions } from "@/lib/submission-instructions";

export default function SubmitPage() {
  return (
    <PageShell
      eyebrow="Submission"
      title="Submit a GitHub Markdown manuscript"
      description="SciLayer accepts scientific manuscripts from every field, including preprints, research articles, reviews, datasets, and methods papers."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.9fr]">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">Required instructions</h2>
          <pre className="mt-4 rounded-2xl bg-slate-950 p-5 text-sm leading-6 text-slate-50">
            {submissionInstructions}
          </pre>
          <Link
            href="/submit/github"
            className="mt-6 inline-flex rounded-full bg-cyan-600 px-5 py-3 text-sm font-bold text-white hover:bg-cyan-700"
          >
            Submit GitHub URL
          </Link>
        </section>
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <h2 className="text-xl font-black text-slate-950">metadata.yml example</h2>
          <pre className="mt-4 rounded-2xl bg-slate-100 p-5 text-xs leading-5 text-slate-800">
            {metadataExample}
          </pre>
        </section>
      </div>
    </PageShell>
  );
}
