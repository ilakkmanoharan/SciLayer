import { NextRequest, NextResponse } from "next/server";
import {
  setInvitationStatus,
  submissionIdFromInvitationToken,
} from "@/lib/reviewer-invitations";

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ token: string }> },
) {
  const { token } = await context.params;
  const submissionId = submissionIdFromInvitationToken(token);

  if (!submissionId) {
    return NextResponse.json({ error: "Invalid invitation." }, { status: 404 });
  }

  await setInvitationStatus(submissionId, "accepted");

  return NextResponse.redirect(new URL(`/reviewer/reviews/${submissionId}`, request.url));
}
