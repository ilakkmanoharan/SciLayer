import { classifyManuscript } from "@/lib/classification";
import { loadPublishedArticles } from "@/lib/published-articles";

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
  repositoryLinks?: { label: string; href: string }[];
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

/** Demo-only articles (not in content/articles). Ilakkuvaselvi Manoharan papers live under content/articles/. */
const demoOnlyArticles: DemoArticle[] = [
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

export const demoArticles: DemoArticle[] = [...loadPublishedArticles(), ...demoOnlyArticles];

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

export function getAllArticleSlugs() {
  return demoArticles.map((article) => article.slug);
}

export function getJournal(slug: string) {
  return demoJournals.find((journal) => journal.slug === slug);
}
