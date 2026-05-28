import { NextRequest, NextResponse } from "next/server";
import { exchangeOrcidCode } from "@/lib/orcid";

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
    const token = await exchangeOrcidCode(code, request.nextUrl.origin);
    const session = Buffer.from(
      JSON.stringify({
        orcid: token.orcid,
        name: token.name ?? "SciLayer researcher",
        authenticatedAt: new Date().toISOString(),
      }),
    ).toString("base64url");

    const response = NextResponse.redirect(new URL("/submit", request.url));
    response.cookies.set("scilayer_orcid_session", session, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 30,
    });
    response.cookies.delete("scilayer_orcid_state");

    return response;
  } catch {
    const response = NextResponse.redirect(
      new URL("/login?error=orcid_exchange_failed", request.url),
    );
    response.cookies.delete("scilayer_orcid_state");

    return response;
  }
}
