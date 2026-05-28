const ORCID_BASE_URL = process.env.ORCID_BASE_URL ?? "https://orcid.org";

export type OrcidTokenResponse = {
  access_token: string;
  token_type: string;
  refresh_token?: string;
  expires_in?: number;
  scope: string;
  name?: string;
  orcid: string;
};

export function hasOrcidCredentials() {
  return Boolean(process.env.ORCID_CLIENT_ID && process.env.ORCID_CLIENT_SECRET);
}

export function getOrcidRedirectUri(origin: string) {
  return process.env.ORCID_REDIRECT_URI ?? `${origin}/api/orcid/callback`;
}

export function buildOrcidAuthorizeUrl(origin: string, state: string) {
  const clientId = process.env.ORCID_CLIENT_ID;
  const redirectUri = getOrcidRedirectUri(origin);

  if (!clientId) {
    return null;
  }

  const params = new URLSearchParams({
    client_id: clientId,
    response_type: "code",
    scope: "/authenticate",
    redirect_uri: redirectUri,
    state,
  });

  return `${ORCID_BASE_URL}/oauth/authorize?${params.toString()}`;
}

export async function exchangeOrcidCode(code: string, origin: string) {
  const clientId = process.env.ORCID_CLIENT_ID;
  const clientSecret = process.env.ORCID_CLIENT_SECRET;

  if (!clientId || !clientSecret) {
    throw new Error("ORCID OAuth credentials are not configured.");
  }

  const body = new URLSearchParams({
    client_id: clientId,
    client_secret: clientSecret,
    grant_type: "authorization_code",
    code,
    redirect_uri: getOrcidRedirectUri(origin),
  });

  const response = await fetch(`${ORCID_BASE_URL}/oauth/token`, {
    method: "POST",
    headers: {
      accept: "application/json",
      "content-type": "application/x-www-form-urlencoded",
    },
    body,
  });

  if (!response.ok) {
    const details = await response.text();
    throw new Error(`ORCID token exchange failed: ${details}`);
  }

  return (await response.json()) as OrcidTokenResponse;
}
