import Link from "next/link";
import { PageShell } from "@/components/page-shell";
import { getCurrentUser } from "@/lib/auth/user";
import { hasAuthSecret, hasOrcidCredentials } from "@/lib/orcid";
import { redirect } from "next/navigation";

const errorMessages: Record<string, string> = {
  invalid_oauth_state: "The ORCID login session expired. Please try signing in again.",
  orcid_exchange_failed:
    "SciLayer could not complete the ORCID sign-in. Check that the redirect URI in your ORCID application matches this site.",
  orcid_not_configured:
    "ORCID credentials are missing on the server. Add ORCID_CLIENT_ID and ORCID_CLIENT_SECRET in Vercel environment variables.",
  auth_secret_missing:
    "Session secret is missing. Add AUTH_SECRET or NEXTAUTH_SECRET in Vercel environment variables.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams?: Promise<{ error?: string; next?: string }>;
}) {
  const params = await searchParams;
  const existingUser = await getCurrentUser();

  if (existingUser) {
    redirect(params?.next ?? "/dashboard");
  }

  const orcidReady = hasOrcidCredentials() && hasAuthSecret();
  const next = params?.next ?? "/dashboard";
  const error = params?.error ? errorMessages[params.error] ?? "Sign-in failed." : null;

  return (
    <PageShell
      eyebrow="Account"
      title="Log in to SciLayer"
      description="Access your author dashboard, track submissions, manage reviews, and follow the publication status of your scientific papers."
    >
      <div className="max-w-xl rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
        <h2 className="text-2xl font-black text-slate-950">Researcher access</h2>
        <p className="mt-3 text-slate-600">
          Sign in with your ORCID iD to submit manuscripts, view decisions, and continue
          work on papers in review.
        </p>

        {!orcidReady && !error ? (
          <div className="mt-5 rounded-2xl bg-amber-50 p-4 text-sm text-amber-950">
            <p className="font-bold">ORCID sign-in is not fully configured on this server.</p>
            <p className="mt-2">
              The site administrator must set <code>ORCID_CLIENT_ID</code>,{" "}
              <code>ORCID_CLIENT_SECRET</code>, and <code>AUTH_SECRET</code>, then redeploy.
            </p>
          </div>
        ) : null}

        {error ? (
          <p className="mt-5 rounded-2xl bg-red-50 p-4 text-sm font-medium text-red-900">
            {error}
          </p>
        ) : null}

        <Link
          href={`/api/orcid/login?next=${encodeURIComponent(next)}`}
          className="mt-6 inline-flex rounded-full bg-slate-950 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800"
        >
          Continue with ORCID iD
        </Link>
      </div>
    </PageShell>
  );
}
