import { NextRequest, NextResponse } from "next/server";
import type { UserRole } from "@/lib/auth/types";
import { createSession } from "@/lib/auth/session";
import { upsertResearcherFromOrcid } from "@/lib/auth/user";
import { exchangeOrcidCode, getAppOrigin } from "@/lib/orcid";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");
  const error = request.nextUrl.searchParams.get("error");
  const state = request.nextUrl.searchParams.get("state");
  const expectedState = request.cookies.get("scilayer_orcid_state")?.value;

  if (error) {
    return NextResponse.redirect(new URL(`/login?error=${error}`, request.url));
  }

  if (!code) {
    return NextResponse.json({ error: "Missing ORCID OAuth code." }, { status: 400 });
  }

  if (!state || !expectedState || state !== expectedState) {
    return NextResponse.redirect(new URL("/login?error=invalid_oauth_state", request.url));
  }

  try {
    const origin = getAppOrigin(request.nextUrl.origin);
    const token = await exchangeOrcidCode(code, origin);
    const user = await upsertResearcherFromOrcid({
      orcidId: token.orcid,
      name: token.name ?? "SciLayer researcher",
    });

    await createSession({
      userId: user.id,
      orcidId: user.orcidId,
      name: user.name,
      role: user.role as UserRole,
    });

    const nextPath = request.cookies.get("scilayer_auth_next")?.value ?? "/dashboard";
    const safeNext = nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : "/dashboard";
    const response = NextResponse.redirect(new URL(safeNext, request.url));
    response.cookies.delete("scilayer_orcid_state");
    response.cookies.delete("scilayer_auth_next");

    return response;
  } catch {
    const response = NextResponse.redirect(
      new URL("/login?error=orcid_exchange_failed", request.url),
    );
    response.cookies.delete("scilayer_orcid_state");

    return response;
  }
}
