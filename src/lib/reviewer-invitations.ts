import { cookies } from "next/headers";
import { demoArticles, getArticle } from "@/lib/demo-data";
import { getAppOrigin } from "@/lib/orcid";

export type InvitationStatus = "invited" | "accepted" | "declined";

const COOKIE_PREFIX = "scilayer_invite_";

export function invitationTokenForSlug(slug: string) {
  return `inv-${slug}`;
}

export function slugFromInvitationToken(token: string): string | null {
  if (!token.startsWith("inv-")) {
    return null;
  }

  const slug = token.slice(4);
  return getArticle(slug) ? slug : null;
}

export function buildInvitationUrls(origin: string, slug: string) {
  const base = getAppOrigin(origin);
  const token = invitationTokenForSlug(slug);

  return {
      landingUrl: `${base}/reviewer/invitations/${token}`,
      dashboardUrl: `${base}/reviewer?invited=${encodeURIComponent(slug)}`,
      reviewUrl: `${base}/reviewer/reviews/${slug}`,
    };
}

export async function getInvitationStatus(slug: string): Promise<InvitationStatus> {
  const store = await cookies();
  const value = store.get(`${COOKIE_PREFIX}${slug}`)?.value;

  if (value === "accepted" || value === "declined") {
    return value;
  }

  return "invited";
}

export async function setInvitationStatus(slug: string, status: "accepted" | "declined") {
  const store = await cookies();
  store.set(`${COOKIE_PREFIX}${slug}`, status, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 90,
  });
}

export async function getReviewerInvitations() {
  return Promise.all(
    demoArticles.map(async (article) => ({
      slug: article.slug,
      token: invitationTokenForSlug(article.slug),
      title: article.title,
      abstract: article.abstract,
      authors: article.authors.map((author) => author.name).join(", "),
      status: await getInvitationStatus(article.slug),
    })),
  );
}
