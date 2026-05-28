import { classifyManuscript } from "@/lib/classification";

export type DemoArticle = {
  slug: string;
  title: string;
  abstract: string;
  authors: {
    name: string;
    orcid: string;
    affiliation: string;
  }[];
  status: "published_preprint" | "under_review" | "journal_accepted";
  articleType: string;
  version: number;
  license: string;
  githubUrl: string;
  publishedAt?: string;
  views: number;
  downloads: number;
  journal?: string;
  classification: ReturnType<typeof classifyManuscript>;
  manuscriptMd: string;
  supportingMaterials: {
    coverLetter: string;
    supplementary: { name: string; description: string }[];
    figures: { name: string; caption: string }[];
    referencesNote: string;
  };
  versions: {
    version: number;
    commit: string;
    createdAt: string;
    summary: string;
  }[];
};

export const demoArticles: DemoArticle[] = [
  {
    slug: "adaptive-scientific-reasoning-architecture",
    title: "Adaptive Scientific Reasoning Architecture",
    abstract:
      "This preprint introduces a modular architecture for autonomous scientific reasoning, intervention planning, and evidence synthesis across evolving research domains.",
    authors: [
      {
        name: "Ilakkuvaselvi Manoharan",
        orcid: "0000-0000-0000-0000",
        affiliation: "Independent Researcher",
      },
    ],
    status: "published_preprint",
    articleType: "preprint",
    version: 1,
    license: "CC-BY-4.0",
    githubUrl: "https://github.com/scilayer/submissions/pull/1",
    publishedAt: "2026-05-26",
    views: 128,
    downloads: 34,
    journal: "SciLayer Systems",
    classification: classifyManuscript({
      title: "Adaptive Scientific Reasoning Architecture",
      abstract:
        "Autonomous agents combine world models, scientific AI, and intervention learning for discovery.",
      keywords: ["adaptive reasoning", "scientific discovery", "world models"],
    }),
    manuscriptMd: `# Adaptive Scientific Reasoning Architecture

SciLayer renders accepted Markdown manuscripts as public scholarly articles.

## Abstract

This preprint introduces a modular architecture for autonomous scientific reasoning, intervention planning, and evidence synthesis across evolving research domains.

## Contribution

The article demonstrates the SciLayer v0.1 publication path from GitHub submission to validated preprint.`,
    supportingMaterials: {
      coverLetter: `Dear Editor,

Please consider this manuscript for review in SciLayer Systems. We introduce an adaptive scientific reasoning architecture for intervention planning and evidence synthesis.

Sincerely,
Ilakkuvaselvi Manoharan`,
      supplementary: [
        {
          name: "appendix.md",
          description: "Extended methods and ablation study notes.",
        },
        {
          name: "data-description.md",
          description: "Dataset provenance and preprocessing steps.",
        },
      ],
      figures: [
        { name: "figure1.png", caption: "System architecture overview." },
        { name: "figure2.png", caption: "Intervention planning workflow." },
      ],
      referencesNote: "references.bib — 42 cited works included in the submission package.",
    },
    versions: [
      {
        version: 1,
        commit: "8a7f2d1",
        createdAt: "2026-05-26",
        summary: "Initial validated preprint publication.",
      },
    ],
  },
  {
    slug: "semantic-scholarship-graph-for-open-review",
    title: "Semantic Scholarship Graph for Open Review",
    abstract:
      "A knowledge graph design for connecting manuscripts, reviewers, author activity, citations, and public review decisions.",
    authors: [
      {
        name: "Maya Chen",
        orcid: "0000-0002-1825-0097",
        affiliation: "SciLayer Research Collective",
      },
    ],
    status: "under_review",
    articleType: "preprint",
    version: 2,
    license: "CC-BY-4.0",
    githubUrl: "https://github.com/scilayer/submissions/tree/main",
    views: 94,
    downloads: 21,
    journal: "SciLayer Information Science",
    classification: classifyManuscript({
      title: "Semantic Scholarship Graph for Open Review",
      abstract:
        "Semantic search and scholarly graphs connect articles, authors, tags, and open peer review.",
      keywords: ["semantic search", "scholarly graphs", "open review"],
    }),
    manuscriptMd: `# Semantic Scholarship Graph for Open Review

This manuscript is in review and demonstrates versioned preprint history.`,
    supportingMaterials: {
      coverLetter: `Dear Editor,

We submit this manuscript on semantic scholarship graphs for open review routing and discovery.

Sincerely,
Maya Chen`,
      supplementary: [
        {
          name: "appendix.md",
          description: "Additional graph schema and query examples.",
        },
        {
          name: "reviewer-notes.md",
          description: "Summary of prior related work in semantic search.",
        },
      ],
      figures: [{ name: "figure1.png", caption: "Scholarly graph schema diagram." }],
      referencesNote: "references.bib — 28 references provided.",
    },
    versions: [
      {
        version: 1,
        commit: "4d91b0a",
        createdAt: "2026-05-12",
        summary: "Initial submission.",
      },
      {
        version: 2,
        commit: "fb06c12",
        createdAt: "2026-05-20",
        summary: "Added reviewer routing and tag extraction notes.",
      },
    ],
  },
];

export const demoJournals = [
  {
    name: "SciLayer Systems",
    slug: "scilayer-systems",
    description: "Systems, agents, infrastructure, and scientific computing.",
    scope: "Reasoning systems, autonomous discovery, computational science, and research infrastructure.",
  },
  {
    name: "SciLayer Information Science",
    slug: "scilayer-information-science",
    description: "Semantic discovery, citation networks, scholarly graphs, and knowledge systems.",
    scope: "Information theory, semantic search, knowledge systems, and scholarly communication.",
  },
];

export function getArticle(slug: string) {
  return demoArticles.find((article) => article.slug === slug);
}

export function getJournal(slug: string) {
  return demoJournals.find((journal) => journal.slug === slug);
}
