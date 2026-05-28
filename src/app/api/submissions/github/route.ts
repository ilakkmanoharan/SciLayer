import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth/session";
import { classifyManuscript } from "@/lib/classification";
import { buildReviewerInvitationEmail } from "@/lib/email";
import { awardPoints } from "@/lib/points";
import { buildInvitationUrls } from "@/lib/reviewer-invitations";
import {
  slugifyTitle,
  validateGithubSubmission,
  validateRequiredSubmissionFiles,
} from "@/lib/validation";

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Authentication required." }, { status: 401 });
  }

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
  const slug = slugifyTitle(title);
  const invitationUrls = buildInvitationUrls(request.nextUrl.origin, slug);
  const reviewerEmailPreview = buildReviewerInvitationEmail({
    reviewerName: "Reviewer",
    articleTitle: title,
    authors: [session.name],
    field: classification.field,
    subfield: classification.subfield,
    tags: classification.tags,
    dashboardUrl: invitationUrls.dashboardUrl,
  });

  return NextResponse.json({
    invitationUrls,
    article: {
      title,
      slug,
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
