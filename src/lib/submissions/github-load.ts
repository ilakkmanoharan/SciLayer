import type { ManuscriptSubmission } from "@/lib/submissions/types";

function githubRepo() {
  return process.env.SCILAYER_SUBMISSIONS_REPO ?? "ilakkmanoharan/scilayer-submissions";
}

function githubHeaders() {
  const token = process.env.GITHUB_TOKEN;
  if (!token) {
    return null;
  }

  return {
    Authorization: `Bearer ${token}`,
    Accept: "application/vnd.github+json",
  };
}

export async function loadSubmissionFromGithub(
  submissionId: string,
): Promise<ManuscriptSubmission | null> {
  const submissions = await listSubmissionsFromGithub();
  return submissions.find((submission) => submission.id === submissionId) ?? null;
}

export async function listSubmissionsFromGithub(): Promise<ManuscriptSubmission[]> {
  const headers = githubHeaders();
  if (!headers) {
    return [];
  }

  const repo = githubRepo();
  const year = new Date().getFullYear();
  const results: ManuscriptSubmission[] = [];

  for (const y of [year, year - 1]) {
    const response = await fetch(
      `https://api.github.com/repos/${repo}/contents/submissions/${y}`,
      { headers, next: { revalidate: 120 } },
    );

    if (!response.ok) {
      continue;
    }

    const entries = (await response.json()) as { name: string; type: string }[];
    for (const entry of entries) {
      if (entry.type !== "dir") {
        continue;
      }

      const manifestResponse = await fetch(
        `https://api.github.com/repos/${repo}/contents/submissions/${y}/${entry.name}/manifest.json`,
        { headers, next: { revalidate: 120 } },
      );

      if (!manifestResponse.ok) {
        continue;
      }

      const manifestPayload = (await manifestResponse.json()) as {
        content?: string;
        encoding?: string;
      };

      if (!manifestPayload.content) {
        continue;
      }

      const raw =
        manifestPayload.encoding === "base64"
          ? Buffer.from(manifestPayload.content, "base64").toString("utf8")
          : manifestPayload.content;

      try {
        results.push(JSON.parse(raw) as ManuscriptSubmission);
      } catch {
        // skip invalid manifest
      }
    }
  }

  return results;
}
