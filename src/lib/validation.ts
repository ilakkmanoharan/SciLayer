import yaml from "js-yaml";
import { z } from "zod";

export const githubSubmissionSchema = z.object({
  githubUrl: z.string().url().refine((value) => value.includes("github.com"), {
    message: "Submission URL must be a GitHub repository, branch, or pull request URL.",
  }),
  title: z.string().min(5).optional(),
  abstract: z.string().min(20).optional(),
  keywords: z.array(z.string()).optional(),
});

export const metadataSchema = z.object({
  title: z.string().min(5),
  short_title: z.string().optional(),
  article_type: z.string().default("preprint"),
  journal_target: z.string().optional(),
  authors: z
    .array(
      z.object({
        name: z.string().min(1),
        orcid: z.string().regex(/^\d{4}-\d{4}-\d{4}-\d{3}[\dX]$/),
        affiliation: z.string().optional(),
        email: z.string().email().optional(),
      }),
    )
    .min(1),
  abstract: z.string().min(20),
  keywords: z.array(z.string()).min(1),
  subjects: z.array(z.string()).min(1),
  license: z.string().default("CC-BY-4.0"),
  review_preference: z.enum(["open", "private"]).default("open"),
  github_repo: z.string().url(),
  github_branch: z.string().default("main"),
  corresponding_author_orcid: z.string(),
});

export type GithubSubmission = z.infer<typeof githubSubmissionSchema>;
export type ManuscriptMetadata = z.infer<typeof metadataSchema>;

export function validateGithubSubmission(payload: unknown) {
  return githubSubmissionSchema.safeParse(payload);
}

export function parseMetadataYaml(source: string) {
  const parsed = yaml.load(source);
  return metadataSchema.safeParse(parsed);
}

export function validateRequiredSubmissionFiles(files: string[]) {
  const required = ["manuscript.md", "metadata.yml", "references.bib"];
  const missing = required.filter((file) => !files.includes(file));

  return {
    valid: missing.length === 0,
    missing,
    checks: required.map((file) => ({
      label: file,
      passed: files.includes(file),
    })),
  };
}

export function slugifyTitle(title: string) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 90);
}
