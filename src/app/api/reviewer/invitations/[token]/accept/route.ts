import { NextRequest, NextResponse } from "next/server";
import {
  setInvitationStatus,
  slugFromInvitationToken,
} from "@/lib/reviewer-invitations";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const slug = slugFromInvitationToken(token);

  if (!slug) {
    return NextResponse.json({ error: "Invalid invitation." }, { status: 404 });
  }

  await setInvitationStatus(slug, "accepted");

  return NextResponse.redirect(new URL(`/reviewer/reviews/${slug}`, request.url));
}
