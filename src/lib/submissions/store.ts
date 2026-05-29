import { mkdir, readFile, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import {
  listSubmissionsFromGithub,
  loadSubmissionFromGithub,
} from "@/lib/submissions/github-load";
import type { ManuscriptSubmission } from "@/lib/submissions/types";

const DATA_ROOT = path.join(process.cwd(), "data", "submissions");

const memoryStore = new Map<string, ManuscriptSubmission>();

async function ensureDir(dir: string) {
  await mkdir(dir, { recursive: true });
}

function manifestPath(id: string) {
  return path.join(DATA_ROOT, id, "manifest.json");
}

function submissionDir(id: string) {
  return path.join(DATA_ROOT, id);
}

export async function saveSubmission(submission: ManuscriptSubmission) {
  memoryStore.set(submission.id, submission);

  try {
    const dir = submissionDir(submission.id);
    await ensureDir(dir);
    await writeFile(manifestPath(submission.id), JSON.stringify(submission, null, 2), "utf8");
  } catch {
    // Ephemeral filesystem (e.g. serverless); memory + GitHub archive remain source of truth.
  }
}

export async function getSubmission(id: string): Promise<ManuscriptSubmission | null> {
  if (memoryStore.has(id)) {
    return memoryStore.get(id) ?? null;
  }

  try {
    const raw = await readFile(manifestPath(id), "utf8");
    const parsed = JSON.parse(raw) as ManuscriptSubmission;
    memoryStore.set(id, parsed);
    return parsed;
  } catch {
    // try GitHub manifest (production)
  }

  const fromGithub = await loadSubmissionFromGithub(id);
  if (fromGithub) {
    memoryStore.set(id, fromGithub);
    return fromGithub;
  }

  return null;
}

export async function getSubmissionBySlug(slug: string): Promise<ManuscriptSubmission | null> {
  for (const submission of memoryStore.values()) {
    if (submission.slug === slug) {
      return submission;
    }
  }

  try {
    const ids = await readdir(DATA_ROOT);
    for (const id of ids) {
      const submission = await getSubmission(id);
      if (submission?.slug === slug) {
        return submission;
      }
    }
  } catch {
    return null;
  }

  return null;
}

export function getSubmissionFilePath(submissionId: string, storedName: string) {
  return path.join(submissionDir(submissionId), storedName);
}

export async function listAllSubmissions() {
  const byId = new Map<string, ManuscriptSubmission>();

  for (const submission of memoryStore.values()) {
    byId.set(submission.id, submission);
  }

  try {
    const ids = await readdir(DATA_ROOT);
    for (const id of ids) {
      const submission = await getSubmission(id);
      if (submission) {
        byId.set(submission.id, submission);
      }
    }
  } catch {
    // ignore
  }

  for (const submission of await listSubmissionsFromGithub()) {
    byId.set(submission.id, submission);
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function listSubmissionsForAuthor(orcidId: string) {
  const byId = new Map<string, ManuscriptSubmission>();

  for (const submission of memoryStore.values()) {
    if (submission.authorOrcid === orcidId) {
      byId.set(submission.id, submission);
    }
  }

  try {
    const ids = await readdir(DATA_ROOT);
    for (const id of ids) {
      const submission = await getSubmission(id);
      if (submission && submission.authorOrcid === orcidId) {
        byId.set(submission.id, submission);
      }
    }
  } catch {
    // ignore
  }

  for (const submission of await listSubmissionsFromGithub()) {
    if (submission.authorOrcid === orcidId) {
      byId.set(submission.id, submission);
    }
  }

  return Array.from(byId.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}
