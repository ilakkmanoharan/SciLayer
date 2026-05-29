export type RelatedWebsite = {
  url: string;
  description: string;
};

export type SubmissionFile = {
  field: string;
  originalName: string;
  storedName: string;
  mimeType: string;
  size: number;
  githubRawUrl?: string;
};

export type ManuscriptSubmission = {
  id: string;
  slug: string;
  title: string;
  abstract: string;
  keywords: string[];
  articleType: string;
  journalTarget: string;
  authorOrcid: string;
  authorName: string;
  relatedWebsites: RelatedWebsite[];
  files: SubmissionFile[];
  githubArchivePath?: string;
  githubArchiveUrl?: string;
  coverLetter?: string;
  status: "submitted" | "validated" | "under_review" | "published_preprint";
  createdAt: string;
};
