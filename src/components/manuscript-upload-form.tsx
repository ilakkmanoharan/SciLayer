"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  additionalArticleTypes,
  primaryArticleTypes,
  specializedArticleTypes,
} from "@/lib/article-types";
import { uploadFields } from "@/lib/upload-spec";

type RelatedWebsite = { url: string; description: string };

export function ManuscriptUploadForm() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [abstract, setAbstract] = useState("");
  const [keywords, setKeywords] = useState("");
  const [articleType, setArticleType] = useState("Article");
  const [journalTarget, setJournalTarget] = useState("SciLayer Systems");
  const [coverLetter, setCoverLetter] = useState("");
  const [relatedWebsites, setRelatedWebsites] = useState<RelatedWebsite[]>([
    { url: "", description: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateWebsite(index: number, key: keyof RelatedWebsite, value: string) {
    setRelatedWebsites((current) =>
      current.map((item, i) => (i === index ? { ...item, [key]: value } : item)),
    );
  }

  async function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);

    const form = event.currentTarget;
    const data = new FormData(form);
    data.set("relatedWebsites", JSON.stringify(relatedWebsites.filter((w) => w.url.trim())));

    const response = await fetch("/api/submissions/upload", {
      method: "POST",
      body: data,
    });

    const payload = await response.json();
    setIsSubmitting(false);

    if (!response.ok) {
      setError(payload.error ?? "Upload failed.");
      return;
    }

    setSuccess(payload.message);
    router.push(`/submissions?submitted=${encodeURIComponent(payload.submission.id)}`);
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Basic information</h2>
        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <label className="block md:col-span-2">
            <span className="text-sm font-bold text-slate-800">Title*</span>
            <input
              name="title"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
            />
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-800">Article type*</span>
            <select
              name="articleType"
              required
              value={articleType}
              onChange={(e) => setArticleType(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
            >
              <optgroup label="Primary research and reviews">
                {primaryArticleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Shorter and specialized">
                {specializedArticleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </optgroup>
              <optgroup label="Additional types">
                {additionalArticleTypes.map((type) => (
                  <option key={type} value={type}>
                    {type}
                  </option>
                ))}
              </optgroup>
            </select>
          </label>
          <label className="block">
            <span className="text-sm font-bold text-slate-800">Journal target</span>
            <input
              name="journalTarget"
              value={journalTarget}
              onChange={(e) => setJournalTarget(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold text-slate-800">Abstract*</span>
            <textarea
              name="abstract"
              required
              rows={5}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold text-slate-800">Keywords</span>
            <input
              name="keywords"
              value={keywords}
              onChange={(e) => setKeywords(e.target.value)}
              placeholder="comma-separated"
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
            />
          </label>
          <label className="block md:col-span-2">
            <span className="text-sm font-bold text-slate-800">Cover letter</span>
            <textarea
              name="coverLetter"
              rows={4}
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              className="mt-2 w-full rounded-2xl border border-slate-300 px-4 py-3"
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Manuscript files</h2>
        <p className="mt-2 text-sm text-slate-600">
          Upload your manuscript packet here (PDF, Word, or LaTeX). For ASRA-style papers, use your
          main PDF as the manuscript file. SciLayer archives to GitHub after upload—you do not
          commit to GitHub yourself.
        </p>
        <div className="mt-5 grid gap-5">
          {(Object.keys(uploadFields) as (keyof typeof uploadFields)[]).map((key) => {
            const spec = uploadFields[key];
            return (
              <label key={key} className="block rounded-2xl border border-dashed border-slate-300 p-4">
                <span className="text-sm font-bold text-slate-800">
                  {spec.label}
                  {spec.required ? "*" : ""}
                </span>
                <p className="mt-1 text-xs text-slate-500">{spec.hint}</p>
                <input
                  type="file"
                  name={key}
                  accept={spec.accept}
                  required={spec.required}
                  className="mt-3 block w-full text-sm"
                />
              </label>
            );
          })}
        </div>
      </section>

      <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-xl font-black text-slate-950">Related websites</h2>
        <p className="mt-2 text-sm text-slate-600">
          Code repositories, datasets, preprints, or project sites (description required, max
          255 characters each).
        </p>
        <div className="mt-4 space-y-4">
          {relatedWebsites.map((site, index) => (
            <div key={index} className="grid gap-3 rounded-2xl bg-slate-50 p-4 md:grid-cols-2">
              <input
                placeholder="https://github.com/..."
                value={site.url}
                onChange={(e) => updateWebsite(index, "url", e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
              <input
                placeholder="Description (required if URL provided)"
                maxLength={255}
                value={site.description}
                onChange={(e) => updateWebsite(index, "description", e.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2 text-sm"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setRelatedWebsites((w) => [...w, { url: "", description: "" }])}
            className="text-sm font-bold text-cyan-700"
          >
            + Add another link
          </button>
        </div>
      </section>

      {error ? (
        <p className="rounded-2xl bg-red-50 p-4 text-sm text-red-900">{error}</p>
      ) : null}
      {success ? (
        <p className="rounded-2xl bg-cyan-50 p-4 text-sm text-cyan-900">{success}</p>
      ) : null}

      <button
        type="submit"
        disabled={isSubmitting}
        className="rounded-full bg-slate-950 px-6 py-3 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60"
      >
        {isSubmitting ? "Uploading and archiving..." : "Submit manuscript packet"}
      </button>
    </form>
  );
}
