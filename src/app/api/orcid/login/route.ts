import { NextRequest, NextResponse } from "next/server";
import {
  buildOrcidAuthorizeUrl,
  getAppOrigin,
  hasAuthSecret,
  hasOrcidCredentials,
} from "@/lib/orcid";

export function GET(request: NextRequest) {
  if (!hasOrcidCredentials()) {
    return NextResponse.redirect(new URL("/login?error=orcid_not_configured", request.url));
  }

  if (!hasAuthSecret()) {
    return NextResponse.redirect(new URL("/login?error=auth_secret_missing", request.url));
  }

  const next = request.nextUrl.searchParams.get("next") ?? "/dashboard";
  const state = crypto.randomUUID();
  const origin = getAppOrigin(request.nextUrl.origin);
  const authorizationUrl = buildOrcidAuthorizeUrl(origin, state);

  if (!authorizationUrl) {
    return NextResponse.redirect(new URL("/login?error=orcid_not_configured", request.url));
  }

  const response = NextResponse.redirect(authorizationUrl);
  response.cookies.set("scilayer_orcid_state", state, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });
  response.cookies.set("scilayer_auth_next", next, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 10 * 60,
  });

  return response;
}
