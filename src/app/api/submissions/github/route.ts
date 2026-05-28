import { NextRequest, NextResponse } from "next/server";
import { classifyManuscript } from "@/lib/classification";
import { buildReviewerInvitationEmail } from "@/lib/email";
import { awardPoints } from "@/lib/points";
import {
  slugifyTitle,
  validateGithubSubmission,
  validateRequiredSubmissionFiles,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  const payload = await request.json().catch(() => null);
  const parsed = validateGithubSubmission(payload);

  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }

  const title = parsed.data.title ?? inferTitleFromGithubUrl(parsed.data.githubUrl);
  const classification = classifyManuscript({
    title,
    abstract: parsed.data.abstract,
    keywords: parsed.data.keywords,
  });
  const validation = validateRequiredSubmissionFiles([
    "manuscript.md",
    "metadata.yml",
    "references.bib",
    "figures/",
    "supplementary/",
  ]);
  const reviewerEmailPreview = buildReviewerInvitationEmail({
    reviewerName: "Reviewer",
    articleTitle: title,
    authors: ["Authenticated ORCID author"],
    field: classification.field,
    subfield: classification.subfield,
    tags: classification.tags,
    reviewLink: "https://scilayer.example/reviewer/invitations/demo-token",
  });

  return NextResponse.json({
    article: {
      title,
      slug: slugifyTitle(title),
      status: validation.valid ? "validated" : "validation_failed",
      githubUrl: parsed.data.githubUrl,
    },
    validation,
    classification,
    pointsEvent: awardPoints("submitValidManuscript"),
    reviewerEmailPreview,
  });
}

function inferTitleFromGithubUrl(githubUrl: string) {
  const segments = new URL(githubUrl).pathname.split("/").filter(Boolean);
  const repo = segments[1] ?? "untitled-manuscript";

  return repo
    .split("-")
    .filter(Boolean)
    .map((segment) => segment[0]?.toUpperCase() + segment.slice(1))
    .join(" ");
}
