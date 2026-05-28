export type TaxonomyField = {
  field: string;
  subfields: string[];
  keywords: string[];
};

export const taxonomy: TaxonomyField[] = [
  {
    field: "Artificial Intelligence",
    subfields: [
      "Machine Learning",
      "Foundation Models",
      "Reasoning Systems",
      "Scientific AI",
      "Autonomous Agents",
    ],
    keywords: ["ai", "machine learning", "model", "reasoning", "agent", "embedding"],
  },
  {
    field: "Biology",
    subfields: [
      "Systems Biology",
      "Bioinformatics",
      "Computational Biology",
      "Molecular Biology",
      "Decision Biology",
    ],
    keywords: ["biology", "genome", "protein", "cell", "bioinformatics", "molecular"],
  },
  {
    field: "Computer Science",
    subfields: [
      "Algorithms",
      "Distributed Systems",
      "Databases",
      "Software Engineering",
      "Human-Computer Interaction",
    ],
    keywords: ["algorithm", "database", "distributed", "software", "interface", "system"],
  },
  {
    field: "Physics",
    subfields: [
      "Quantum Computing",
      "Statistical Mechanics",
      "Materials Physics",
      "Computational Physics",
    ],
    keywords: ["physics", "quantum", "material", "mechanics", "simulation"],
  },
  {
    field: "Information Science",
    subfields: [
      "Information Theory",
      "Knowledge Systems",
      "Semantic Search",
      "Scholarly Graphs",
    ],
    keywords: ["information", "knowledge", "semantic", "citation", "graph", "search"],
  },
  {
    field: "Complex Systems",
    subfields: ["Networks", "Emergence", "Dynamical Systems", "Adaptive Systems"],
    keywords: ["network", "emergence", "dynamical", "adaptive", "complex"],
  },
];

export const articleStatuses = [
  "draft",
  "submitted",
  "validation_failed",
  "validated",
  "under_moderation",
  "reviewers_invited",
  "under_review",
  "changes_requested",
  "approved",
  "published_preprint",
  "submitted_to_journal",
  "journal_under_review",
  "journal_accepted",
  "journal_rejected",
  "published_journal_article",
  "withdrawn",
] as const;
