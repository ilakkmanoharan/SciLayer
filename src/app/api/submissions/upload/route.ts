import { writeFile } from "node:fs/promises";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { classifyManuscript } from "@/lib/classification";
import { buildReviewerInvitationEmail } from "@/lib/email";
import { awardPoints } from "@/lib/points";
import { buildInvitationUrls } from "@/lib/reviewer-invitations";
import { slugifyTitle } from "@/lib/validation";
import { archiveSubmissionToGithub } from "@/lib/submissions/github-archive";
import {
  getSubmissionFilePath,
  saveSubmission,
} from "@/lib/submissions/store";
import type { ManuscriptSubmission, RelatedWebsite, SubmissionFile } from "@/lib/submissions/types";
import { maxBytesForField, type UploadFieldKey } from "@/lib/upload-spec";

const FILE_FIELDS: UploadFieldKey[] = [
  "manuscript",
  "manuscriptPdf",
  "graphicAbstract",
  "figuresTables",
  "supplementary",
];

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

  const form = await request.formData();
  const title = String(form.get("title") ?? "").trim();
  const abstract = String(form.get("abstract") ?? "").trim();
  const articleType = String(form.get("articleType") ?? "").trim();
  const journalTarget = String(form.get("journalTarget") ?? "SciLayer").trim();
  const keywordsRaw = String(form.get("keywords") ?? "");
  const coverLetter = String(form.get("coverLetter") ?? "").trim();
  const relatedWebsitesRaw = String(form.get("relatedWebsites") ?? "[]");

  if (!title || title.length < 5) {
    return NextResponse.json({ error: "Title is required." }, { status: 400 });
  }
  if (!abstract || abstract.length < 20) {
    return NextResponse.json({ error: "Abstract is required (minimum 20 characters)." }, { status: 400 });
  }
  if (!articleType) {
    return NextResponse.json({ error: "Article type is required." }, { status: 400 });
  }

  const manuscript = form.get("manuscript");
  if (!(manuscript instanceof File) || manuscript.size === 0) {
    return NextResponse.json({ error: "Manuscript file is required." }, { status: 400 });
  }

  if (manuscript.size > maxBytesForField("manuscript")) {
    return NextResponse.json({ error: "Manuscript file exceeds 200 MB limit." }, { status: 400 });
  }

  let relatedWebsites: RelatedWebsite[] = [];
  try {
    relatedWebsites = JSON.parse(relatedWebsitesRaw) as RelatedWebsite[];
  } catch {
    return NextResponse.json({ error: "Invalid related websites format." }, { status: 400 });
  }

  const slug = slugifyTitle(title);
  const submissionId = `${slug}-${Date.now().toString(36)}`;
  const keywords = keywordsRaw
    .split(",")
    .map((k) => k.trim())
    .filter(Boolean);

  const files: SubmissionFile[] = [];
  const archiveBuffers: { storedName: string; buffer: Buffer; mimeType: string }[] = [];

  for (const field of FILE_FIELDS) {
    const value = form.get(field);
    if (!(value instanceof File) || value.size === 0) {
      continue;
    }

    if (value.size > maxBytesForField(field)) {
      return NextResponse.json(
        { error: `${field} exceeds ${maxBytesForField(field) / (1024 * 1024)} MB limit.` },
        { status: 400 },
      );
    }

    const storedName = sanitizeFilename(field, value.name);
    const buffer = Buffer.from(await value.arrayBuffer());

    files.push({
      field,
      originalName: value.name,
      storedName,
      mimeType: value.type || "application/octet-stream",
      size: value.size,
    });

    archiveBuffers.push({ storedName, buffer, mimeType: value.type });

    try {
      const filePath = getSubmissionFilePath(submissionId, storedName);
      await writeFile(filePath, buffer);
    } catch {
      // Continue; GitHub archive or memory still holds metadata.
    }
  }

  const classification = classifyManuscript({
    title,
    abstract,
    keywords,
  });

  const submission: ManuscriptSubmission = {
    id: submissionId,
    slug,
    title,
    abstract,
    keywords,
    articleType,
    journalTarget,
    authorOrcid: session.orcidId,
    authorName: session.name,
    relatedWebsites,
    files,
    coverLetter: coverLetter || undefined,
    status: "submitted",
    createdAt: new Date().toISOString(),
  };

  let githubArchive = { archived: false, path: undefined as string | undefined, url: undefined as string | undefined };
  try {
    githubArchive = await archiveSubmissionToGithub(submission, archiveBuffers);
    submission.githubArchivePath = githubArchive.path;
    submission.githubArchiveUrl = githubArchive.url;
  } catch (error) {
    console.error("GitHub archive failed:", error);
  }

  await saveSubmission(submission);

  const invitationUrls = buildInvitationUrls(request.nextUrl.origin, submission.id);
  const reviewerEmailPreview = buildReviewerInvitationEmail({
    reviewerName: "Reviewer",
    articleTitle: submission.title,
    authors: [submission.authorName],
    field: classification.field,
    subfield: classification.subfield,
    tags: classification.tags,
    dashboardUrl: invitationUrls.dashboardUrl,
  });

  return NextResponse.json({
    submission: {
      id: submission.id,
      slug: submission.slug,
      title: submission.title,
      status: submission.status,
      githubArchiveUrl: submission.githubArchiveUrl,
    },
    classification,
    pointsEvent: awardPoints("submitValidManuscript"),
    invitationUrls,
    reviewerEmailPreview,
    githubArchived: githubArchive.archived,
    message: githubArchive.archived
      ? "Manuscript uploaded and archived to SciLayer GitHub."
      : "Manuscript uploaded. Configure GITHUB_TOKEN to enable automatic GitHub archival.",
  });
}

function sanitizeFilename(field: string, originalName: string) {
  const ext = path.extname(originalName) || "";
  const base = path.basename(originalName, ext).replace(/[^a-z0-9-_]+/gi, "-").slice(0, 40);
  return `${field}-${base || "file"}${ext.toLowerCase()}`;
}
