import { taxonomy } from "@/lib/taxonomy";

export type ClassificationInput = {
  title: string;
  abstract?: string;
  keywords?: string[];
  manuscriptText?: string;
};

export type ClassificationResult = {
  field: string;
  subfield: string;
  methods: string[];
  tags: string[];
  journalFit: string;
  confidenceScore: number;
  modelUsed: string;
};

const methodTerms = [
  "simulation",
  "benchmark",
  "dataset",
  "case study",
  "formal analysis",
  "experiment",
  "review",
];

export function classifyManuscript(input: ClassificationInput): ClassificationResult {
  const text = [
    input.title,
    input.abstract,
    input.keywords?.join(" "),
    input.manuscriptText,
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();

  const scored = taxonomy
    .map((entry) => ({
      entry,
      score: entry.keywords.reduce(
        (total, keyword) => total + (text.includes(keyword) ? 1 : 0),
        0,
      ),
    }))
    .sort((a, b) => b.score - a.score);

  const best = scored[0]?.score ? scored[0].entry : taxonomy[0];
  const matchingSubfield =
    best.subfields.find((subfield) => text.includes(subfield.toLowerCase())) ??
    best.subfields[0];

  const keywordTags = input.keywords?.map((keyword) => keyword.toLowerCase()) ?? [];
  const inferredTags = best.keywords.filter((keyword) => text.includes(keyword));
  const methods = methodTerms.filter((term) => text.includes(term));

  return {
    field: best.field,
    subfield: matchingSubfield,
    methods: methods.length ? methods : ["editorial triage"],
    tags: Array.from(new Set([...keywordTags, ...inferredTags])).slice(0, 8),
    journalFit: `SciLayer ${best.field}`,
    confidenceScore: Math.min(0.95, 0.55 + (scored[0]?.score ?? 0) * 0.1),
    modelUsed: "rules-v0.1",
  };
}
