"use client";

import { useState } from "react";

type SubmissionResult = {
  article: {
    title: string;
    slug: string;
    status: string;
  };
  validation: {
    valid: boolean;
    checks: { label: string; passed: boolean }[];
  };
  classification: {
    field: string;
    subfield: string;
    tags: string[];
    confidenceScore: number;
  };
  pointsEvent: {
    eventType: string;
    points: number;
  };
  reviewerEmailPreview: {
    subject: string;
    body: string;
  };
  invitationUrls: {
    landingUrl: string;
    dashboardUrl: string;
    reviewUrl: string;
  };
};

export function GithubSubmissionForm() {
  const [githubUrl, setGithubUrl] = useState("");
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [result, setResult] = useState<SubmissionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setResult(null);

    const response = await fetch("/api/submissions/github", {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({
        githubUrl,
        title: title || undefined,
        abstract: abstract || undefined,
        keywords: keywords
          .split(",")
          .map((keyword) => keyword.trim())
          .filter(Boolean),
      }),
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Submission failed validation.");
      return;
    }

    setResult(payload);
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
      <form onSubmit={onSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <label className="block text-sm font-bold text-slate-800" htmlFor="githubUrl">
          GitHub repository, branch, or PR URL
        </label>
        <input
          id="githubUrl"
          type="url"
          required
          value={githubUrl}
          onChange={(event) => setGithubUrl(event.target.value)}
          placeholder="https://github.com/scilayer/submissions/pull/1"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-cyan-500 focus:ring-2"
        />

        <label className="mt-5 block text-sm font-bold text-slate-800" htmlFor="title">
          Manuscript title
        </label>
        <input
          id="title"
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          placeholder="Adaptive Scientific Reasoning Architecture"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-cyan-500 focus:ring-2"
        />

        <label className="mt-5 block text-sm font-bold text-slate-800" htmlFor="abstract">
          Abstract
        </label>
        <textarea
          id="abstract"
          value={abstract}
          onChange={(event) => setAbstract(event.target.value)}
          placeholder="Briefly describe the manuscript for MVP classification."
          rows={5}
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-cyan-500 focus:ring-2"
        />

        <label className="mt-5 block text-sm font-bold text-slate-800" htmlFor="keywords">
          Keywords
        </label>
        <input
          id="keywords"
          value={keywords}
          onChange={(event) => setKeywords(event.target.value)}
          placeholder="scientific AI, world models, intervention learning"
          className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3 text-slate-900 outline-none ring-cyan-500 focus:ring-2"
        />

        {error ? <p className="mt-4 rounded-2xl bg-red-50 p-4 text-sm text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="mt-6 rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting ? "Validating..." : "Validate and classify"}
        </button>
      </form>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Submission result</h2>
        {!result ? (
          <p className="mt-3 text-slate-600">
            Submit a GitHub URL to preview validation, classification, points, and the reviewer email template.
          </p>
        ) : (
          <div className="mt-5 space-y-5">
            <div>
              <p className="text-sm font-bold uppercase tracking-wide text-cyan-700">
                {result.article.status.replaceAll("_", " ")}
              </p>
              <h3 className="mt-1 text-2xl font-black text-slate-950">{result.article.title}</h3>
              <p className="text-sm text-slate-500">Slug: {result.article.slug}</p>
            </div>
            <div className="grid gap-2">
              {result.validation.checks.map((check) => (
                <p key={check.label} className="text-sm text-slate-700">
                  {check.passed ? "Passed" : "Missing"}: {check.label}
                </p>
              ))}
            </div>
            <div className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-700">
              <p>
                <strong>Classification:</strong> {result.classification.field} /{" "}
                {result.classification.subfield}
              </p>
              <p>
                <strong>Tags:</strong> {result.classification.tags.join(", ")}
              </p>
              <p>
                <strong>Confidence:</strong>{" "}
                {Math.round(result.classification.confidenceScore * 100)}%
              </p>
            </div>
            <div className="rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">
              Awarded +{result.pointsEvent.points} points for a valid manuscript submission.
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <p className="text-sm font-bold text-slate-950">
                {result.reviewerEmailPreview.subject}
              </p>
              <pre className="mt-3 whitespace-pre-wrap text-xs leading-5 text-slate-700">
                {result.reviewerEmailPreview.body}
              </pre>
              <a
                href={result.invitationUrls.dashboardUrl}
                className="mt-5 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
              >
                Open reviewer dashboard
              </a>
              <p className="mt-3 text-xs text-slate-500">
                Invitation link: {result.invitationUrls.landingUrl}
              </p>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
