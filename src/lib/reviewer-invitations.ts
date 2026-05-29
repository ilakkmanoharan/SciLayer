import { cookies } from "next/headers";
import { listAllSubmissions } from "@/lib/submissions/store";
import { getAppOrigin } from "@/lib/orcid";

export type InvitationStatus = "invited" | "accepted" | "declined";

const COOKIE_PREFIX = "scilayer_invite_";

export function invitationTokenForSubmission(submissionId: string) {
  return `inv-${submissionId}`;
}

export function submissionIdFromInvitationToken(token: string): string | null {
  if (!token.startsWith("inv-")) {
    return null;
  }
  return token.slice(4);
}

export function buildInvitationUrls(origin: string, submissionId: string) {
  const base = getAppOrigin(origin);
  const token = invitationTokenForSubmission(submissionId);

  return {
    landingUrl: `${base}/reviewer/invitations/${token}`,
    dashboardUrl: `${base}/reviewer?invited=${encodeURIComponent(submissionId)}`,
    reviewUrl: `${base}/reviewer/reviews/${submissionId}`,
  };
}

export async function getInvitationStatus(submissionId: string): Promise<InvitationStatus> {
  const store = await cookies();
  const value = store.get(`${COOKIE_PREFIX}${submissionId}`)?.value;

  if (value === "accepted" || value === "declined") {
    return value;
  }

  return "invited";
}

export async function setInvitationStatus(
  submissionId: string,
  status: "accepted" | "declined",
) {
  const store = await cookies();
  store.set(`${COOKIE_PREFIX}${submissionId}`, status, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
}

export async function getReviewerInvitations() {
  const submissions = await listAllSubmissions();

  return Promise.all(
    submissions.map(async (submission) => ({
      submissionId: submission.id,
      slug: submission.slug,
      token: invitationTokenForSubmission(submission.id),
      title: submission.title,
      abstract: submission.abstract,
      authors: submission.authorName,
      articleType: submission.articleType,
      status: await getInvitationStatus(submission.id),
    })),
  );
}
